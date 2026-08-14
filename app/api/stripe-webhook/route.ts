import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createOrder, getOrderByStripePaymentIntentId, isUniqueViolation } from '@/lib/orders'
import { sendOrderConfirmation } from '@/lib/email'
import { requireEnv } from '@/lib/env'
import type { OrderItem } from '@/lib/orders'

export const runtime = 'nodejs'

/**
 * Stripe retries every non-2xx response with backoff for up to 3 days, so the
 * status code is a *routing decision*, not a description of the payload:
 *
 *   400 — signature verification failed. Not from Stripe, or misrouted; a
 *         retry can never help and we do not want one.
 *   200 — handled, deliberately ignored, or permanently unprocessable. A
 *         payload that is missing customer details will still be missing them
 *         on the tenth delivery, so it is acknowledged and logged instead of
 *         piling up in the dashboard as a failing endpoint.
 *   5xx — transient failure (database down, Stripe API unreachable). Here a
 *         retry is exactly what we want.
 */

interface EventContext {
  eventId?: string
  paymentIntentId?: string
}

/** Ack an event that can never be processed, loudly enough to be alerted on. */
function ackPermanentFailure(reason: string, context: EventContext) {
  console.error(
    '[stripe-webhook] Unprocessable event, acknowledged without retry:',
    JSON.stringify({ reason, ...context })
  )
  return NextResponse.json({ received: true, ignored: reason })
}

/** Ask Stripe to redeliver later. */
function requestRetry(reason: string, context: EventContext, err: unknown) {
  console.error(
    '[stripe-webhook] Transient failure, asking Stripe to retry:',
    JSON.stringify({ reason, ...context }),
    err
  )
  return NextResponse.json({ error: reason }, { status: 500 })
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let stripe: Stripe
  let webhookSecret: string
  try {
    stripe = getStripe()
    webhookSecret = requireEnv('STRIPE_WEBHOOK_SECRET')
  } catch (err) {
    // Missing credentials — a deploy problem, not an event problem. 500 so the
    // events are redelivered once the environment is fixed.
    console.error('[stripe-webhook] Server misconfigured:', err)
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // FOLLOW-UP: `payment_intent.payment_failed` and every other event type are
  // intentionally acknowledged with no action for now — Stripe Elements shows
  // failures to the customer inline at checkout, and there is no order row yet
  // to update. Add handling here if we start recording abandoned attempts.
  if (event.type !== 'payment_intent.succeeded') {
    return NextResponse.json({ received: true })
  }

  const piEvent = event.data.object as Stripe.PaymentIntent
  const context: EventContext = { eventId: event.id, paymentIntentId: piEvent.id }

  try {
    // Idempotency, first line of defence: skip if we already created this order.
    const existing = await getOrderByStripePaymentIntentId(piEvent.id)
    if (existing) {
      console.log(`[stripe-webhook] Order already exists for PI ${piEvent.id}, skipping`)
      return NextResponse.json({ received: true })
    }

    // Re-retrieve the PI with the charge expanded so we get billing details
    const pi = await stripe.paymentIntents.retrieve(piEvent.id, {
      expand: ['latest_charge'],
    })

    const charge = pi.latest_charge as Stripe.Charge | null
    const billing = charge?.billing_details

    const customerName = billing?.name ?? pi.shipping?.name ?? null
    const customerEmail = billing?.email ?? null
    const customerPhone = billing?.phone ?? pi.shipping?.phone ?? null

    if (!customerName || !customerEmail) {
      return ackPermanentFailure('missing_customer_details', context)
    }

    const addr = pi.shipping?.address
    if (!addr?.line1 || !addr?.city || !addr?.postal_code || !addr?.country) {
      return ackPermanentFailure('missing_shipping_address', context)
    }

    let items: OrderItem[] = []
    try {
      items = JSON.parse(pi.metadata?.items ?? '[]') as OrderItem[]
    } catch {
      return ackPermanentFailure('invalid_items_metadata', context)
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
  } catch (err) {
    // Idempotency, second line of defence: two deliveries of the same event can
    // both pass the existence check above and race into the insert. The unique
    // index on stripe_payment_intent_id settles it — the loser sees a unique
    // violation, which means the order exists, which is success.
    if (isUniqueViolation(err)) {
      console.log(
        `[stripe-webhook] Concurrent delivery lost the race for PI ${piEvent.id}, order already created`
      )
      return NextResponse.json({ received: true })
    }

    return requestRetry('processing_failed', context, err)
  }
}
