import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createOrder, getOrderByStripePaymentIntentId } from '@/lib/orders'
import { sendOrderConfirmation } from '@/lib/email'
import type { OrderItem } from '@/lib/orders'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'payment_intent.succeeded') {
    return NextResponse.json({ received: true })
  }

  const piEvent = event.data.object as Stripe.PaymentIntent

  // Idempotency: skip if we already created this order
  const existing = await getOrderByStripePaymentIntentId(piEvent.id)
  if (existing) {
    console.log(`[stripe-webhook] Order already exists for PI ${piEvent.id}, skipping`)
    return NextResponse.json({ received: true })
  }

  // Re-retrieve the PI with the charge expanded so we get billing details
  const pi = await getStripe().paymentIntents.retrieve(piEvent.id, {
    expand: ['latest_charge'],
  })

  const charge = pi.latest_charge as Stripe.Charge | null
  const billing = charge?.billing_details

  const customerName = billing?.name ?? pi.shipping?.name ?? null
  const customerEmail = billing?.email ?? null
  const customerPhone = billing?.phone ?? pi.shipping?.phone ?? null

  if (!customerName || !customerEmail) {
    console.error('[stripe-webhook] Missing customer details on PI:', pi.id)
    return NextResponse.json({ error: 'Missing customer details' }, { status: 400 })
  }

  const addr = pi.shipping?.address
  if (!addr?.line1 || !addr?.city || !addr?.postal_code || !addr?.country) {
    console.error('[stripe-webhook] Missing shipping address on PI:', pi.id)
    return NextResponse.json({ error: 'Missing shipping address' }, { status: 400 })
  }

  let items: OrderItem[] = []
  try {
    items = JSON.parse(pi.metadata?.items ?? '[]') as OrderItem[]
  } catch {
    console.error('[stripe-webhook] Failed to parse items metadata for PI:', pi.id)
    return NextResponse.json({ error: 'Invalid items metadata' }, { status: 400 })
  }

  const subtotal = parseFloat(pi.metadata?.subtotal ?? '0')
  const shippingCost = parseFloat(pi.metadata?.shipping ?? '0')
  const total = parseFloat(pi.metadata?.total ?? '0')

  const order = await createOrder({
    status: 'paid',
    customerInfo: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone ?? undefined,
      address: {
        line1: addr.line1,
        line2: addr.line2 ?? undefined,
        city: addr.city,
        state: addr.state ?? '',
        postalCode: addr.postal_code,
        country: addr.country,
      },
    },
    items,
    subtotal,
    shipping: shippingCost,
    total,
    stripePaymentIntentId: pi.id,
  })

  // Fire-and-forget email
  sendOrderConfirmation(order).catch((err) =>
    console.error('[stripe-webhook] sendOrderConfirmation failed:', err)
  )

  console.log(`[stripe-webhook] Order ${order.orderNumber} created for PI ${pi.id}`)
  return NextResponse.json({ received: true })
}
