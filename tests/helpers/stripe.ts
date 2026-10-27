import Stripe from 'stripe'
import { NextRequest } from 'next/server'

/** Must match STRIPE_WEBHOOK_SECRET in tests/setup/test-env.ts. */
export const TEST_WEBHOOK_SECRET = 'whsec_hermetic_test_secret'

/**
 * A real Stripe SDK instance used purely for its crypto helpers — signing test
 * payloads and verifying them. No network call is ever made through it, and the
 * key is a dummy: `webhooks.generateTestHeaderString` / `webhooks.constructEvent`
 * are local HMAC operations.
 */
export const stripeSigner = new Stripe('sk_test_hermetic')

type TestHeaderOptions = Parameters<Stripe['webhooks']['generateTestHeaderString']>[0]

/**
 * Signs a payload exactly the way Stripe signs a real webhook delivery.
 *
 * The SDK types mark every option as required, but only `payload` and `secret`
 * are meaningful here — `timestamp`, `scheme` and `signature` are derived
 * internally, which is precisely what we want to reproduce.
 */
export function signPayload(payload: string, secret: string = TEST_WEBHOOK_SECRET): string {
  return stripeSigner.webhooks.generateTestHeaderString({ payload, secret } as TestHeaderOptions)
}

export interface PaymentIntentFixture {
  id: string
  object: 'payment_intent'
  amount: number
  currency: string
  status: string
  metadata: Record<string, string>
  shipping: unknown
  latest_charge: unknown
}

export interface OrderMetadataItem {
  productId: string
  productName: string
  size: string
  quantity: number
  price: number
}

export const DEFAULT_METADATA_ITEMS: OrderMetadataItem[] = [
  {
    productId: 'antro-classic-hoodie',
    productName: 'Sailor Hooded Jacket',
    size: 'ONE SIZE',
    quantity: 1,
    price: 120,
  },
]

/**
 * A PaymentIntent as the webhook route sees it after
 * `paymentIntents.retrieve(id, { expand: ['latest_charge'] })`.
 */
export function paymentIntentFixture(
  overrides: Partial<PaymentIntentFixture> = {}
): PaymentIntentFixture {
  return {
    id: 'pi_test_123',
    object: 'payment_intent',
    amount: 12000,
    currency: 'eur',
    status: 'succeeded',
    metadata: {
      items: JSON.stringify(DEFAULT_METADATA_ITEMS),
      subtotal: '120.00',
      shipping: '0.00',
      total: '120.00',
    },
    shipping: {
      name: 'Jean Dupont',
      phone: '+32470000000',
      address: {
        line1: 'Rue Neuve 1',
        line2: 'Bus 3',
        city: 'Brussels',
        state: 'Brussels',
        postal_code: '1000',
        country: 'BE',
      },
    },
    latest_charge: {
      id: 'ch_test_123',
      object: 'charge',
      billing_details: {
        name: 'Jean Dupont',
        email: 'jean@example.com',
        phone: '+32470000000',
        address: {
          line1: 'Rue Neuve 1',
          line2: 'Bus 3',
          city: 'Brussels',
          state: 'Brussels',
          postal_code: '1000',
          country: 'BE',
        },
      },
    },
    ...overrides,
  }
}

/** Casts a fixture to the SDK type at the mock boundary. */
export function asPaymentIntent(fixture: PaymentIntentFixture): Stripe.PaymentIntent {
  return fixture as unknown as Stripe.PaymentIntent
}

export function stripeEvent(
  type: string,
  dataObject: unknown,
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    id: `evt_test_${Math.random().toString(36).slice(2, 10)}`,
    object: 'event',
    api_version: '2026-03-25.dahlia',
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    pending_webhooks: 1,
    request: { id: null, idempotency_key: null },
    type,
    data: { object: dataObject },
    ...overrides,
  }
}

/** Builds a POST request to /api/stripe-webhook carrying a signed payload. */
export function webhookRequest(
  event: Record<string, unknown>,
  options: { secret?: string; signature?: string } = {}
): NextRequest {
  const payload = JSON.stringify(event)
  const signature = options.signature ?? signPayload(payload, options.secret)

  return new NextRequest('http://localhost:3000/api/stripe-webhook', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'stripe-signature': signature,
    },
    body: payload,
  })
}

/** Builds a POST request to /api/create-payment-intent. */
export function paymentIntentRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/create-payment-intent', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}
