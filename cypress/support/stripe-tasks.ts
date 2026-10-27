import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

/**
 * Node-side tasks for the e2e suite.
 *
 * These run outside the browser, which is the only place they *can* run: they
 * need the secret key, the webhook signing secret and the Supabase service
 * role key. Nothing here is reachable from the spec's browser context.
 *
 * ⚠ Side effects — these are real writes against whatever `.env.local` points
 * at: a test-mode PaymentIntent and charge in Stripe, and an order row in
 * Supabase. Both are disposable, but do not run this against production.
 */

function env(name: string): string {
  const value = process.env[name]
  if (!value || !value.trim()) {
    throw new Error(
      `[cypress] Missing ${name}. The e2e suite reads it from .env.local — see the ` +
        '"Local Stripe testing" section of the README.'
    )
  }
  return value
}

function stripe(): Stripe {
  const key = env('STRIPE_SECRET_KEY')
  if (!key.startsWith('sk_test_')) {
    throw new Error('[cypress] Refusing to run e2e against a live Stripe key.')
  }
  return new Stripe(key)
}

/** The shipping/billing identity the simulated shopper pays with. */
const TEST_SHOPPER = {
  name: 'E2E Shopper',
  email: 'e2e@giorgioantro.test',
  phone: '+32470000000',
  address: {
    line1: 'Rue Neuve 1',
    city: 'Brussels',
    state: 'Brussels',
    postal_code: '1000',
    country: 'BE',
  },
}

export interface CompleteTestPaymentResult {
  status: string
  amount: number
}

/**
 * Confirms the PaymentIntent the app created, server-side, with Stripe's test
 * card token — the closest we can get to the browser flow without automating
 * Stripe's cross-origin iframe (which Stripe does not support).
 */
export async function completeTestPayment(args: {
  paymentIntentId: string
}): Promise<CompleteTestPaymentResult> {
  const client = stripe()

  const paymentMethod = await client.paymentMethods.create({
    type: 'card',
    card: { token: 'tok_visa' },
    billing_details: TEST_SHOPPER,
  })

  // The browser attaches shipping at confirm time; do the same here so the
  // webhook has an address to build the order from.
  await client.paymentIntents.update(args.paymentIntentId, {
    shipping: {
      name: TEST_SHOPPER.name,
      phone: TEST_SHOPPER.phone,
      address: TEST_SHOPPER.address,
    },
  })

  const paymentIntent = await client.paymentIntents.confirm(args.paymentIntentId, {
    payment_method: paymentMethod.id,
    return_url: 'http://localhost:3000/order/success',
  })

  return { status: paymentIntent.status, amount: paymentIntent.amount }
}

export interface DeliverWebhookResult {
  status: number
  body: string
}

/**
 * Signs a `payment_intent.succeeded` event for a real PaymentIntent and posts
 * it to the running dev server, exactly the way Stripe would.
 *
 * Works whether or not `stripe listen` is running: if it is, the CLI delivers
 * the genuine event too and one of the two deliveries is idempotently skipped.
 */
export async function deliverWebhook(args: {
  paymentIntentId: string
  baseUrl: string
}): Promise<DeliverWebhookResult> {
  const client = stripe()
  const paymentIntent = await client.paymentIntents.retrieve(args.paymentIntentId)

  const payload = JSON.stringify({
    id: `evt_e2e_${Date.now()}`,
    object: 'event',
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    pending_webhooks: 1,
    request: { id: null, idempotency_key: null },
    type: 'payment_intent.succeeded',
    data: { object: paymentIntent },
  })

  const signature = client.webhooks.generateTestHeaderString({
    payload,
    secret: env('STRIPE_WEBHOOK_SECRET'),
  } as Parameters<Stripe['webhooks']['generateTestHeaderString']>[0])

  const res = await fetch(`${args.baseUrl}/api/stripe-webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'stripe-signature': signature },
    body: payload,
  })

  return { status: res.status, body: await res.text() }
}

export interface OrderRow {
  order_number: string
  status: string
  total: number | string
  customer_email: string
  stripe_payment_intent_id: string
}

/** Reads the order the webhook should have written. */
export async function findOrderByPaymentIntent(paymentIntentId: string): Promise<OrderRow | null> {
  const db = createClient(env('NEXT_PUBLIC_SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false },
  })

  const { data, error } = await db
    .from('orders')
    .select('order_number, status, total, customer_email, stripe_payment_intent_id')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .maybeSingle()

  if (error) throw new Error(`[cypress] order lookup failed: ${error.message}`)
  return (data as OrderRow | null) ?? null
}
