import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createOrder, getOrderByStripePaymentIntentId } from '@/lib/orders'
import { sendOrderConfirmation } from '@/lib/email'
import { CheckoutValidationError, parseOrderItemsFromMetadata } from '@/lib/checkout'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event
  try {
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET must be set.')
    }

    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      webhookSecret
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

  let items
  try {
    items = parseOrderItemsFromMetadata(session.metadata?.items)
  } catch (err) {
    const message =
      err instanceof CheckoutValidationError ? err.message : 'Invalid items metadata'
    console.error('[stripe-webhook] Failed to parse items metadata:', session.id, message)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const subtotal = (session.amount_subtotal ?? 0) / 100
  const shippingCost = (session.total_details?.amount_shipping ?? 0) / 100
  const total = (session.amount_total ?? 0) / 100

  let order
  try {
    order = await createOrder({
      status: 'paid',
      customerInfo: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone ?? undefined,
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
      stripePaymentIntentId: paymentIntentId,
    })
  } catch (err) {
    console.error('[stripe-webhook] Failed to persist order:', session.id, err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }

  // Fire-and-forget email
  sendOrderConfirmation(order).catch((err) =>
    console.error('[stripe-webhook] sendOrderConfirmation failed:', err)
  )

  console.log(`[stripe-webhook] Order ${order.orderNumber} created for session ${session.id}`)
  return NextResponse.json({ received: true })
}
