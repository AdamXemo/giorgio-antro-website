import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'
import type Stripe from 'stripe'
import {
  asPaymentIntent,
  paymentIntentFixture,
  stripeEvent,
  stripeSigner,
  webhookRequest,
  type PaymentIntentFixture,
} from '../helpers/stripe'
import { createSupabaseStub, dbError, ok, orderRow, type SupabaseStub } from '../helpers/supabase'
import { UNIQUE_VIOLATION } from '@/lib/orders'

/**
 * Integration tests for POST /api/stripe-webhook.
 *
 * Real code under test: the route, `lib/orders.ts` and Stripe's own signature
 * verification. Only the edges are stubbed — the Supabase client, the Stripe
 * API call that re-retrieves the PaymentIntent, and Resend.
 *
 * Events are signed with `stripe.webhooks.generateTestHeaderString`, so
 * `constructEvent` runs for real against every payload below.
 */
const hoisted = vi.hoisted(() => ({
  db: null as SupabaseStub | null,
  retrieve: vi.fn(),
}))

vi.mock('@/lib/stripe', () => ({
  // Real `webhooks` object — signature verification is genuinely exercised.
  getStripe: () =>
    ({
      webhooks: stripeSigner.webhooks,
      paymentIntents: { retrieve: hoisted.retrieve },
    }) as unknown as Stripe,
}))

vi.mock('@/lib/db', () => ({
  getDb: () => {
    if (!hoisted.db) throw new Error('Supabase stub not initialised')
    return hoisted.db.client
  },
}))

vi.mock('@/lib/email', () => ({
  sendOrderConfirmation: vi.fn(async () => true),
}))

import { POST } from '@/app/api/stripe-webhook/route'
import { sendOrderConfirmation } from '@/lib/email'

let db: SupabaseStub
let consoleError: MockInstance
let consoleLog: MockInstance

/** Signs and delivers an event of `type`. */
function deliver(type: string, object: unknown) {
  return POST(webhookRequest(stripeEvent(type, object)))
}

/** Signs and delivers a `payment_intent.succeeded` event for `pi`. */
function deliverSucceeded(pi: PaymentIntentFixture) {
  return deliver('payment_intent.succeeded', { id: pi.id })
}

/** The row lib/orders tried to insert. */
function insertedRow(): Record<string, unknown> {
  expect(db.insert).toHaveBeenCalledTimes(1)
  return db.insert.mock.calls[0][0] as Record<string, unknown>
}

beforeEach(() => {
  db = createSupabaseStub()
  hoisted.db = db
  // No existing order, and every insert succeeds.
  db.maybeSingle.mockResolvedValue(ok(null))
  db.single.mockResolvedValue(ok(orderRow()))
  hoisted.retrieve.mockImplementation(async () => asPaymentIntent(paymentIntentFixture()))
  vi.mocked(sendOrderConfirmation).mockResolvedValue(true)
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
})

describe('signature verification', () => {
  it('rejects a payload whose signature does not match', async () => {
    const res = await POST(
      webhookRequest(stripeEvent('payment_intent.succeeded', { id: 'pi_test_123' }), {
        signature: 't=1,v1=deadbeef',
      })
    )

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'Invalid signature' })
    expect(hoisted.retrieve).not.toHaveBeenCalled()
    expect(db.insert).not.toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalled()
  })

  it('rejects a payload signed with the wrong secret', async () => {
    const res = await POST(
      webhookRequest(stripeEvent('payment_intent.succeeded', { id: 'pi_test_123' }), {
        secret: 'whsec_someone_elses_secret',
      })
    )

    expect(res.status).toBe(400)
    expect(db.insert).not.toHaveBeenCalled()
  })

  it('rejects a request with no signature header at all', async () => {
    const res = await POST(
      webhookRequest(stripeEvent('payment_intent.succeeded', { id: 'pi_test_123' }), {
        signature: '',
      })
    )

    expect(res.status).toBe(400)
  })
})

describe('event routing', () => {
  it('acknowledges event types it does not act on', async () => {
    const res = await deliver('payment_intent.payment_failed', { id: 'pi_test_failed' })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ received: true })
    expect(hoisted.retrieve).not.toHaveBeenCalled()
    expect(db.from).not.toHaveBeenCalled()
  })

  it('acknowledges unrelated event types', async () => {
    const res = await deliver('charge.refunded', { id: 'ch_test_1' })

    expect(res.status).toBe(200)
    expect(db.from).not.toHaveBeenCalled()
  })
})

describe('payment_intent.succeeded — happy path', () => {
  it('creates exactly one paid order', async () => {
    const res = await deliverSucceeded(paymentIntentFixture())

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ received: true })

    const row = insertedRow()
    expect(row).toMatchObject({
      status: 'paid',
      customer_name: 'Jean Dupont',
      customer_email: 'jean@example.com',
      customer_phone: '+32470000000',
      address_line1: 'Rue Neuve 1',
      address_line2: 'Bus 3',
      address_city: 'Brussels',
      address_state: 'Brussels',
      address_postal: '1000',
      address_country: 'BE',
      subtotal: 120,
      shipping: 0,
      total: 120,
      stripe_payment_intent_id: 'pi_test_123',
    })
  })

  it('re-retrieves the PaymentIntent with the charge expanded', async () => {
    await deliverSucceeded(paymentIntentFixture())

    expect(hoisted.retrieve).toHaveBeenCalledWith('pi_test_123', {
      expand: ['latest_charge'],
    })
  })

  it('checks for an existing order before inserting', async () => {
    await deliverSucceeded(paymentIntentFixture())

    expect(db.eq).toHaveBeenCalledWith('stripe_payment_intent_id', 'pi_test_123')
  })

  it('copies the cart out of the PaymentIntent metadata', async () => {
    await deliverSucceeded(paymentIntentFixture())

    expect(insertedRow().items).toEqual([
      {
        productId: 'antro-classic-hoodie',
        productName: 'Sailor Hooded Jacket',
        size: 'ONE SIZE',
        quantity: 1,
        price: 120,
      },
    ])
  })

  it('sends the confirmation email', async () => {
    await deliverSucceeded(paymentIntentFixture())

    expect(sendOrderConfirmation).toHaveBeenCalledTimes(1)
    expect(vi.mocked(sendOrderConfirmation).mock.calls[0][0]).toMatchObject({
      orderNumber: 'ANTRO-12345678901',
      total: 120,
    })
  })

  it('still acknowledges when the confirmation email fails', async () => {
    vi.mocked(sendOrderConfirmation).mockRejectedValue(new Error('resend down'))

    const res = await deliverSucceeded(paymentIntentFixture())

    expect(res.status).toBe(200)
    expect(db.insert).toHaveBeenCalledTimes(1)
  })

  it('logs the created order number', async () => {
    await deliverSucceeded(paymentIntentFixture())

    expect(consoleLog).toHaveBeenCalledWith(expect.stringContaining('ANTRO-12345678901'))
  })
})

describe('idempotency', () => {
  it('does not create a second order for a repeated event', async () => {
    await deliverSucceeded(paymentIntentFixture())
    expect(db.insert).toHaveBeenCalledTimes(1)

    // Stripe redelivers the same event; the order now exists.
    db.maybeSingle.mockResolvedValue(ok(orderRow()))

    const res = await deliverSucceeded(paymentIntentFixture())

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ received: true })
    expect(db.insert).toHaveBeenCalledTimes(1)
    expect(sendOrderConfirmation).toHaveBeenCalledTimes(1)
  })

  it('short-circuits before re-retrieving the PaymentIntent', async () => {
    db.maybeSingle.mockResolvedValue(ok(orderRow()))

    await deliverSucceeded(paymentIntentFixture())

    expect(hoisted.retrieve).not.toHaveBeenCalled()
    expect(db.insert).not.toHaveBeenCalled()
  })
})

describe('customer and address fallbacks', () => {
  it('falls back to the shipping name when billing has none', async () => {
    hoisted.retrieve.mockResolvedValue(
      asPaymentIntent(
        paymentIntentFixture({
          latest_charge: {
            billing_details: { name: null, email: 'jean@example.com', phone: null },
          },
        })
      )
    )

    await deliverSucceeded(paymentIntentFixture())

    expect(insertedRow()).toMatchObject({
      customer_name: 'Jean Dupont',
      customer_phone: '+32470000000',
    })
  })

  it('stores an empty string when the address has no state', async () => {
    const pi = paymentIntentFixture()
    hoisted.retrieve.mockResolvedValue(
      asPaymentIntent(
        paymentIntentFixture({
          shipping: {
            name: 'Jean Dupont',
            address: {
              line1: 'Rue Neuve 1',
              city: 'Brussels',
              state: null,
              postal_code: '1000',
              country: 'BE',
            },
          },
        })
      )
    )

    await deliverSucceeded(pi)

    expect(insertedRow()).toMatchObject({ address_state: '', address_line2: null })
  })
})

describe('permanently invalid payloads are acknowledged, never retried', () => {
  /**
   * Behaviour change (Phase 2): these used to answer 400, which made Stripe
   * redeliver — for three days — a payload that could never succeed. They now
   * answer 200 with a structured `console.error`, so the endpoint stays healthy
   * and the reason is greppable in the logs.
   */
  async function expectAcknowledgedAs(res: Response, reason: string) {
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ received: true, ignored: reason })
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('Unprocessable event'),
      expect.stringContaining(reason)
    )
    expect(db.insert).not.toHaveBeenCalled()
  }

  it('acks when the charge carries no customer email', async () => {
    hoisted.retrieve.mockResolvedValue(
      asPaymentIntent(
        paymentIntentFixture({
          latest_charge: { billing_details: { name: 'Jean Dupont', email: null, phone: null } },
        })
      )
    )

    await expectAcknowledgedAs(
      await deliverSucceeded(paymentIntentFixture()),
      'missing_customer_details'
    )
  })

  it('acks when there is no charge at all', async () => {
    hoisted.retrieve.mockResolvedValue(
      asPaymentIntent(paymentIntentFixture({ latest_charge: null }))
    )

    await expectAcknowledgedAs(
      await deliverSucceeded(paymentIntentFixture()),
      'missing_customer_details'
    )
  })

  it('acks when the shipping address is incomplete', async () => {
    hoisted.retrieve.mockResolvedValue(
      asPaymentIntent(
        paymentIntentFixture({
          shipping: {
            name: 'Jean Dupont',
            address: { line1: null, city: 'Brussels', postal_code: '1000', country: 'BE' },
          },
        })
      )
    )

    await expectAcknowledgedAs(
      await deliverSucceeded(paymentIntentFixture()),
      'missing_shipping_address'
    )
  })

  it('acks when the items metadata is not valid JSON', async () => {
    const pi = paymentIntentFixture()
    hoisted.retrieve.mockResolvedValue(
      asPaymentIntent(
        paymentIntentFixture({
          metadata: { ...pi.metadata, items: '{not json' },
        })
      )
    )

    await expectAcknowledgedAs(await deliverSucceeded(pi), 'invalid_items_metadata')
  })

  it('logs the event and payment intent ids alongside the reason', async () => {
    hoisted.retrieve.mockResolvedValue(
      asPaymentIntent(paymentIntentFixture({ latest_charge: null }))
    )

    await deliverSucceeded(paymentIntentFixture())

    const logged = JSON.parse(String(consoleError.mock.calls[0][1]))
    expect(logged).toEqual({
      reason: 'missing_customer_details',
      eventId: expect.stringMatching(/^evt_test_/),
      paymentIntentId: 'pi_test_123',
    })
  })

  it('accepts an order with no metadata at all, defaulting the totals to zero', async () => {
    hoisted.retrieve.mockResolvedValue(asPaymentIntent(paymentIntentFixture({ metadata: {} })))

    const res = await deliverSucceeded(paymentIntentFixture())

    expect(res.status).toBe(200)
    expect(insertedRow()).toMatchObject({ items: [], subtotal: 0, shipping: 0, total: 0 })
  })

  it('does not validate the *shape* of parsed items metadata', async () => {
    // Documented gap: valid JSON that is not a line-item array is stored as-is.
    const pi = paymentIntentFixture()
    hoisted.retrieve.mockResolvedValue(
      asPaymentIntent(paymentIntentFixture({ metadata: { ...pi.metadata, items: '"oops"' } }))
    )

    const res = await deliverSucceeded(pi)

    expect(res.status).toBe(200)
    expect(insertedRow().items).toBe('oops')
  })
})

describe('transient failures ask Stripe to retry', () => {
  /**
   * Behaviour change (Phase 2): these used to throw out of the handler, which
   * Next turns into an opaque 500 with an unhandled rejection in the logs. They
   * now return a deliberate 500 — same retry semantics, traceable reason.
   */
  async function expectRetryRequested(res: Response) {
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({ error: 'processing_failed' })
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('Transient failure'),
      expect.stringContaining('processing_failed'),
      expect.anything()
    )
  }

  it('returns 500 when the existence check fails', async () => {
    db.maybeSingle.mockResolvedValue(dbError('connection reset'))

    await expectRetryRequested(await deliverSucceeded(paymentIntentFixture()))
    expect(db.insert).not.toHaveBeenCalled()
  })

  it('returns 500 when the insert fails', async () => {
    db.single.mockResolvedValue(dbError('connection reset'))

    await expectRetryRequested(await deliverSucceeded(paymentIntentFixture()))
  })

  it('returns 500 when Stripe is unreachable', async () => {
    hoisted.retrieve.mockRejectedValue(new Error('stripe unavailable'))

    await expectRetryRequested(await deliverSucceeded(paymentIntentFixture()))
  })

  it('returns 500 when the webhook secret is not configured', async () => {
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', undefined)

    const res = await deliverSucceeded(paymentIntentFixture())

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({ error: 'Webhook not configured' })
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('misconfigured'),
      expect.anything()
    )
  })
})

describe('idempotency race', () => {
  /**
   * Two deliveries of the same event can both pass the existence check and race
   * into the insert. The UNIQUE index on stripe_payment_intent_id decides the
   * winner; the loser must treat the rejection as success, not as a 500 that
   * drags Stripe into retrying forever.
   */
  it('treats a unique violation on insert as success', async () => {
    db.single.mockResolvedValue(
      dbError(
        'duplicate key value violates unique constraint "orders_stripe_payment_intent_id_key"',
        UNIQUE_VIOLATION,
        'Key (stripe_payment_intent_id)=(pi_test_123) already exists.'
      )
    )

    const res = await deliverSucceeded(paymentIntentFixture())

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ received: true })
    expect(consoleLog).toHaveBeenCalledWith(expect.stringContaining('lost the race'))
  })

  it('does not send a second confirmation email for the losing delivery', async () => {
    db.single.mockResolvedValue(dbError('duplicate key value', UNIQUE_VIOLATION))

    await deliverSucceeded(paymentIntentFixture())

    expect(sendOrderConfirmation).not.toHaveBeenCalled()
  })

  it('still asks for a retry when the insert fails for any other reason', async () => {
    db.single.mockResolvedValue(dbError('deadlock detected', '40P01'))

    const res = await deliverSucceeded(paymentIntentFixture())

    expect(res.status).toBe(500)
  })
})
