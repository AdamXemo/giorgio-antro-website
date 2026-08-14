import { beforeEach, describe, expect, it, vi } from 'vitest'
import Stripe from 'stripe'

/**
 * The Stripe client is a module-level singleton, so every test re-imports it
 * from a fresh module registry.
 */
beforeEach(() => {
  vi.resetModules()
})

describe('getStripe', () => {
  it('pins the API version explicitly', async () => {
    const { getStripe, STRIPE_API_VERSION } = await import('@/lib/stripe')

    expect(getStripe().getApiField('version')).toBe(STRIPE_API_VERSION)
  })

  it('pins exactly the version the installed SDK targets', async () => {
    const { STRIPE_API_VERSION } = await import('@/lib/stripe')

    // A client with no explicit apiVersion falls back to the SDK's own pinned
    // default — the only version its TypeScript types describe. If a `stripe`
    // upgrade moves that default, this fails and the pin must be updated with it.
    const sdkDefault = new Stripe('sk_test_hermetic').getApiField('version')

    expect(STRIPE_API_VERSION).toBe(sdkDefault)
  })

  it('reuses one client across calls', async () => {
    const { getStripe } = await import('@/lib/stripe')

    expect(getStripe()).toBe(getStripe())
  })

  it('fails fast and by name when the secret key is missing', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', undefined)
    const { getStripe } = await import('@/lib/stripe')

    expect(() => getStripe()).toThrow(/STRIPE_SECRET_KEY/)
  })
})
