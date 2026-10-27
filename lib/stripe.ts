import Stripe from 'stripe'
import { requireEnv } from './env'

/**
 * Pinned API version.
 *
 * This is the version the installed SDK is generated against — its TypeScript
 * types describe this version and no other. Pinning explicitly means a change
 * to the account's default API version in the Stripe dashboard cannot silently
 * alter the shape of the objects this app receives.
 *
 * Bump it together with the `stripe` package, never ahead of it. The value must
 * stay equal to the SDK's own default (asserted in tests/unit/stripe-client.test.ts).
 */
export const STRIPE_API_VERSION = '2026-03-25.dahlia'

let instance: Stripe | null = null

export function getStripe(): Stripe {
  if (!instance) {
    instance = new Stripe(requireEnv('STRIPE_SECRET_KEY'), {
      apiVersion: STRIPE_API_VERSION,
    })
  }
  return instance
}
