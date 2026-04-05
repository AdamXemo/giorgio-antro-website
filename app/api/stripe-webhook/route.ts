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

  const pi = event.data.object as Stripe.PaymentIntent

  // Idempotency: skip if we already created this order
  const existing = await getOrderByStripePaymentIntentId(pi.id)
  if (existing) {
    console.log(`[stripe-webhook] Order already exists for PI ${pi.id}, skipping`)
    return NextResponse.json({ received: true })
  }

  // Retrieve the PI with expanded latest_charge to get billing details
  const fullPi = await getStripe().paymentIntents.retrieve(pi.id, {
    expand: ['latest_charge'],
  })
  const charge = fullPi.latest_charge as Stripe.Charge | null
  const billing = charge?.billing_details

  if (!billing?.name || !billing?.email || !billing?.address) {
    console.error('[stripe-webhook] Missing billing details on charge for PI:', pi.id)
    return NextResponse.json({ error: 'Missing billing details' }, { status: 400 })
  }

  // Parse items from metadata
  let items: OrderItem[] = []
  try {
    items = JSON.parse(pi.metadata?.items ?? '[]') as OrderItem[]
  } catch {
    console.error('[stripe-webhook] Failed to parse items metadata for PI:', pi.id)
    return NextResponse.json({ error: 'Invalid items metadata' }, { status: 400 })
  }

  const subtotal = parseFloat(pi.metadata?.subtotal ?? '0')
  const shipping = parseFloat(pi.metadata?.shipping ?? '0')
  const total = parseFloat(pi.metadata?.total ?? '0')

  const addr = billing.address
  const order = await createOrder({
    status: 'paid',
    customerInfo: {
      name: billing.name,
      email: billing.email,
      phone: billing.phone ?? undefined,
      address: {
        line1:      addr.line1 ?? '',
        line2:      addr.line2 ?? undefined,
        city:       addr.city ?? '',
        state:      addr.state ?? '',
        postalCode: addr.postal_code ?? '',
        country:    addr.country ?? '',
      },
    },
    items,
    subtotal,
    shipping,
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
