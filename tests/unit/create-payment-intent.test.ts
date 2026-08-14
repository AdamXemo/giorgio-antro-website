import { beforeEach, describe, expect, it, vi } from 'vitest'
import type Stripe from 'stripe'
import type { Product } from '@/data/products'

/**
 * Characterization tests for POST /api/create-payment-intent.
 *
 * Stripe is mocked — the point here is the *pricing and validation* the route
 * performs before it ever talks to Stripe. The catalog holds a single €120
 * product, so synthetic products are registered for the price points the real
 * catalog cannot reach (notably the €100 free-shipping threshold).
 */
const { stripeMock, productOverrides } = vi.hoisted(() => ({
  stripeMock: { paymentIntents: { create: vi.fn() } },
  productOverrides: new Map<string, Product>(),
}))

vi.mock('@/lib/stripe', () => ({
  getStripe: () => stripeMock as unknown as Stripe,
}))

vi.mock('@/data/products', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/data/products')>()
  return {
    ...actual,
    getProductById: (id: string) => productOverrides.get(id) ?? actual.getProductById(id),
  }
})

import { POST } from '@/app/api/create-payment-intent/route'
import { mainProduct } from '@/data/products'
import { paymentIntentRequest } from '../helpers/stripe'

function fakeProduct(price: number, id = 'test-product'): Product {
  return { ...mainProduct, id, name: `Test ${id}`, price }
}

/** Registers a synthetic product and returns its id. */
function register(price: number, id = 'test-product'): string {
  productOverrides.set(id, fakeProduct(price, id))
  return id
}

/** The arguments the route passed to `stripe.paymentIntents.create`. */
function createArgs(): Stripe.PaymentIntentCreateParams {
  expect(stripeMock.paymentIntents.create).toHaveBeenCalledTimes(1)
  return stripeMock.paymentIntents.create.mock.calls[0][0] as Stripe.PaymentIntentCreateParams
}

beforeEach(() => {
  productOverrides.clear()
  stripeMock.paymentIntents.create.mockResolvedValue({
    id: 'pi_test_123',
    client_secret: 'pi_test_123_secret_abc',
  })
})

describe('totals', () => {
  it('charges the catalog price for a single item', async () => {
    const res = await POST(paymentIntentRequest({ items: [{ id: mainProduct.id, quantity: 1 }] }))

    expect(res.status).toBe(200)
    expect(createArgs()).toMatchObject({ amount: 12000, currency: 'eur' })
  })

  it('multiplies by quantity', async () => {
    await POST(paymentIntentRequest({ items: [{ id: mainProduct.id, quantity: 3 }] }))

    expect(createArgs().amount).toBe(36000)
  })

  it('sums multiple line items', async () => {
    const cheap = register(40, 'cheap')
    await POST(
      paymentIntentRequest({
        items: [
          { id: mainProduct.id, quantity: 1 },
          { id: cheap, quantity: 2 },
        ],
      })
    )

    // 12000 + 2 × 4000 = 20000, free shipping
    expect(createArgs().amount).toBe(20000)
  })

  it('returns the client secret and payment intent id', async () => {
    const res = await POST(paymentIntentRequest({ items: [{ id: mainProduct.id, quantity: 1 }] }))

    await expect(res.json()).resolves.toEqual({
      clientSecret: 'pi_test_123_secret_abc',
      paymentIntentId: 'pi_test_123',
    })
  })
})

describe('shipping threshold', () => {
  it('adds €10 shipping below €100', async () => {
    const id = register(40)
    await POST(paymentIntentRequest({ items: [{ id, quantity: 1 }] }))

    const args = createArgs()
    expect(args.amount).toBe(5000) // 4000 + 1000
    expect(args.metadata).toMatchObject({ shipping: '10.00', subtotal: '40.00', total: '50.00' })
  })

  it('ships free at exactly €100', async () => {
    const id = register(100)
    await POST(paymentIntentRequest({ items: [{ id, quantity: 1 }] }))

    const args = createArgs()
    expect(args.amount).toBe(10000)
    expect(args.metadata).toMatchObject({ shipping: '0.00', total: '100.00' })
  })

  it('still charges shipping one cent below the threshold', async () => {
    const id = register(99.99)
    await POST(paymentIntentRequest({ items: [{ id, quantity: 1 }] }))

    expect(createArgs().amount).toBe(10999) // 9999 + 1000
  })

  it('applies the threshold to the subtotal, not the per-item price', async () => {
    const id = register(40)
    await POST(paymentIntentRequest({ items: [{ id, quantity: 3 }] }))

    expect(createArgs().amount).toBe(12000) // 3 × 4000, free shipping
  })
})

describe('cents rounding', () => {
  it('converts decimal prices without float drift', async () => {
    const id = register(19.99)
    await POST(paymentIntentRequest({ items: [{ id, quantity: 3 }] }))

    const args = createArgs()
    expect(args.amount).toBe(6997) // 3 × 1999 + 1000 shipping
    expect(args.metadata).toMatchObject({ subtotal: '59.97', total: '69.97' })
  })

  it('rounds a half cent up', async () => {
    const id = register(12.345)
    await POST(paymentIntentRequest({ items: [{ id, quantity: 1 }] }))

    // Math.round(1234.5) === 1235
    expect(createArgs().amount).toBe(2235) // 1235 + 1000 shipping
  })

  it('reports the rounded unit price in metadata, not the raw one', async () => {
    const id = register(12.345)
    await POST(paymentIntentRequest({ items: [{ id, quantity: 1 }] }))

    const items = JSON.parse(String(createArgs().metadata?.items))
    expect(items[0].price).toBe(12.35)
  })
})

describe('metadata', () => {
  it('carries the full line item shape the webhook depends on', async () => {
    await POST(paymentIntentRequest({ items: [{ id: mainProduct.id, quantity: 2 }] }))

    const metadata = createArgs().metadata
    expect(metadata).toEqual({
      items: expect.any(String),
      subtotal: '240.00',
      shipping: '0.00',
      total: '240.00',
    })
    expect(JSON.parse(String(metadata?.items))).toEqual([
      {
        productId: mainProduct.id,
        productName: mainProduct.name,
        size: 'ONE SIZE',
        quantity: 2,
        price: 120,
      },
    ])
  })

  it('falls back to ONE SIZE when a product has no sizes', async () => {
    productOverrides.set('sizeless', { ...fakeProduct(50, 'sizeless'), sizes: [] })
    await POST(paymentIntentRequest({ items: [{ id: 'sizeless', quantity: 1 }] }))

    const items = JSON.parse(String(createArgs().metadata?.items))
    expect(items[0].size).toBe('ONE SIZE')
  })
})

describe('Stripe metadata size guard', () => {
  /**
   * Added in Phase 2. `metadata.items` is the only record of what was bought —
   * the webhook rebuilds the order from it — and Stripe caps a metadata value
   * at 500 characters. An oversized cart must fail here, loudly, rather than at
   * the Stripe API with an opaque error.
   */
  function bulkCart(lineItems: number) {
    return Array.from({ length: lineItems }, (_, i) => ({
      id: register(20, `bulk-${i}`),
      quantity: 1,
    }))
  }

  it('rejects a cart whose serialised items exceed 500 characters', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const res = await POST(paymentIntentRequest({ items: bulkCart(8) }))

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'Cart is too large to process' })
    expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('exceeds the Stripe limit'),
      expect.stringContaining('"limit":500')
    )
  })

  it('measures serialised length, not line item count', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    productOverrides.set('verbose', {
      ...fakeProduct(50, 'verbose'),
      name: 'A'.repeat(600),
    })

    const res = await POST(paymentIntentRequest({ items: [{ id: 'verbose', quantity: 1 }] }))

    expect(res.status).toBe(400)
    expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
  })

  it('lets a cart that fits through', async () => {
    const res = await POST(paymentIntentRequest({ items: bulkCart(4) }))

    expect(res.status).toBe(200)
    const items = String(createArgs().metadata?.items)
    expect(items.length).toBeLessThanOrEqual(500)
  })
})

describe('input validation', () => {
  it('rejects an empty items array', async () => {
    const res = await POST(paymentIntentRequest({ items: [] }))

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'No items provided' })
    expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
  })

  it('rejects a body with no items key', async () => {
    const res = await POST(paymentIntentRequest({}))

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'No items provided' })
  })

  it.each([
    ['zero', 0],
    ['negative', -1],
    ['fractional', 1.5],
    ['not a number', 'two'],
  ])('rejects a %s quantity', async (_label, quantity) => {
    const res = await POST(paymentIntentRequest({ items: [{ id: mainProduct.id, quantity }] }))

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'Invalid quantity' })
    expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
  })

  it('rejects an unknown product id', async () => {
    const res = await POST(paymentIntentRequest({ items: [{ id: 'does-not-exist', quantity: 1 }] }))

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'Unknown product: does-not-exist' })
    expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
  })

  it('rejects the whole request when one line item is invalid', async () => {
    const res = await POST(
      paymentIntentRequest({
        items: [
          { id: mainProduct.id, quantity: 1 },
          { id: 'does-not-exist', quantity: 1 },
        ],
      })
    )

    expect(res.status).toBe(400)
    expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
  })
})

describe('failure handling', () => {
  it('returns 500 when Stripe rejects the request', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    stripeMock.paymentIntents.create.mockRejectedValue(new Error('stripe is down'))

    const res = await POST(paymentIntentRequest({ items: [{ id: mainProduct.id, quantity: 1 }] }))

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({ error: 'Failed to create payment intent' })
    expect(consoleError).toHaveBeenCalled()
  })
})
