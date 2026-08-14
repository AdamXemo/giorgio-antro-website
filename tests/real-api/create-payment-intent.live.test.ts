import { describe, expect, it } from 'vitest'
import { POST } from '@/app/api/create-payment-intent/route'
import { mainProduct } from '@/data/products'
import { getStripe } from '@/lib/stripe'
import { paymentIntentRequest } from '../helpers/stripe'

/**
 * The only tests in this repo that touch the network.
 *
 * Everything else mocks Stripe; these two prove the route actually works
 * against the real API with the sandbox key — that the amount we compute is
 * accepted, that the client secret we hand the browser is genuine, and that
 * validation still rejects bad input before a PaymentIntent is ever created.
 *
 * Run with: npm run test:real-api   (requires STRIPE_SECRET_KEY in .env.local)
 */
const sandboxKeyPresent = Boolean(process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'))

describe.skipIf(!sandboxKeyPresent)('create-payment-intent against the Stripe sandbox', () => {
  it('creates a real PaymentIntent and returns a usable client secret', async () => {
    const res = await POST(paymentIntentRequest({ items: [{ id: mainProduct.id, quantity: 1 }] }))

    expect(res.status).toBe(200)
    const body = (await res.json()) as { clientSecret: string; paymentIntentId: string }

    expect(body.paymentIntentId).toMatch(/^pi_/)
    expect(body.clientSecret).toMatch(/^pi_[^_]+_secret_/)
    expect(body.clientSecret.startsWith(body.paymentIntentId)).toBe(true)

    // Read it back from Stripe: the amount, currency and cart metadata the
    // webhook will later rely on must all be there.
    const pi = await getStripe().paymentIntents.retrieve(body.paymentIntentId)

    expect(pi.livemode).toBe(false)
    expect(pi.amount).toBe(Math.round(mainProduct.price * 100))
    expect(pi.currency).toBe('eur')
    expect(pi.status).toBe('requires_payment_method')
    expect(JSON.parse(pi.metadata.items)).toEqual([
      {
        productId: mainProduct.id,
        productName: mainProduct.name,
        size: mainProduct.sizes[0],
        quantity: 1,
        price: mainProduct.price,
      },
    ])
  })

  it('rejects invalid input without creating anything at Stripe', async () => {
    const unknownProduct = await POST(
      paymentIntentRequest({ items: [{ id: 'not-a-real-product', quantity: 1 }] })
    )
    expect(unknownProduct.status).toBe(400)
    await expect(unknownProduct.json()).resolves.toEqual({
      error: 'Unknown product: not-a-real-product',
    })

    const badQuantity = await POST(
      paymentIntentRequest({ items: [{ id: mainProduct.id, quantity: 0 }] })
    )
    expect(badQuantity.status).toBe(400)
    await expect(badQuantity.json()).resolves.toEqual({ error: 'Invalid quantity' })
  })
})

describe.skipIf(sandboxKeyPresent)('create-payment-intent against the Stripe sandbox', () => {
  it.skip('sandbox suite — set a sk_test_ key in .env.local to enable', () => {})
})
