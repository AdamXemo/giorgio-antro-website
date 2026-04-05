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

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  // Only process paid sessions (could also be 'unpaid' for async methods)
  if (session.payment_status !== 'paid') {
    console.log(`[stripe-webhook] Session ${session.id} not yet paid, skipping`)
    return NextResponse.json({ received: true })
  }

  const paymentIntentId = typeof session.payment_intent === 'string'
    ? session.payment_intent
    : session.payment_intent?.id ?? null

  if (!paymentIntentId) {
    console.error('[stripe-webhook] No payment_intent on session:', session.id)
    return NextResponse.json({ error: 'Missing payment intent' }, { status: 400 })
  }

  // Idempotency: skip if we already created this order
  const existing = await getOrderByStripePaymentIntentId(paymentIntentId)
  if (existing) {
    console.log(`[stripe-webhook] Order already exists for PI ${paymentIntentId}, skipping`)
    return NextResponse.json({ received: true })
  }

  const customer = session.customer_details
  const shipping = session.collected_information?.shipping_details

  if (!customer?.name || !customer?.email) {
    console.error('[stripe-webhook] Missing customer details on session:', session.id)
    return NextResponse.json({ error: 'Missing customer details' }, { status: 400 })
  }

  const addr = shipping?.address ?? customer.address
  if (!addr?.line1 || !addr?.city || !addr?.postal_code || !addr?.country) {
    console.error('[stripe-webhook] Missing address on session:', session.id)
    return NextResponse.json({ error: 'Missing address' }, { status: 400 })
  }

  // Parse items from metadata
  let items: OrderItem[] = []
  try {
    items = JSON.parse(session.metadata?.items ?? '[]') as OrderItem[]
  } catch {
    console.error('[stripe-webhook] Failed to parse items metadata for session:', session.id)
    return NextResponse.json({ error: 'Invalid items metadata' }, { status: 400 })
  }

  const subtotal = parseFloat(session.metadata?.subtotal ?? '0')
  const shippingCost = parseFloat(session.metadata?.shipping ?? '0')
  const total = parseFloat(session.metadata?.total ?? '0')

  const order = await createOrder({
    status: 'paid',
    customerInfo: {
      name:  customer.name,
      email: customer.email,
      phone: customer.phone ?? undefined,
      address: {
        line1:      addr.line1,
        line2:      addr.line2 ?? undefined,
        city:       addr.city,
        state:      addr.state ?? '',
        postalCode: addr.postal_code,
        country:    addr.country,
      },
    },
    items,
    subtotal,
    shipping: shippingCost,
    total,
    stripePaymentIntentId: paymentIntentId,
  })

  // Fire-and-forget email
  sendOrderConfirmation(order).catch((err) =>
    console.error('[stripe-webhook] sendOrderConfirmation failed:', err)
  )

  console.log(`[stripe-webhook] Order ${order.orderNumber} created for session ${session.id}`)
  return NextResponse.json({ received: true })
}
