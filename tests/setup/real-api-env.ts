import { resolve } from 'node:path'
import { config } from 'dotenv'

/**
 * Loads the developer's real (test-mode) credentials for the sandbox suite.
 *
 * Vite and Next both deliberately skip `.env.local` when the mode is `test`, so
 * it has to be loaded explicitly here. `override` is left off: anything already
 * exported in the shell wins.
 */
config({ path: resolve(process.cwd(), '.env.local'), quiet: true })

const key = process.env.STRIPE_SECRET_KEY

// Hard stop: this suite creates real Stripe objects. In test mode that is free
// and disposable; against a live key it would not be.
if (key && !key.startsWith('sk_test_')) {
  throw new Error(
    '[real-api] STRIPE_SECRET_KEY is not a test-mode key (expected an "sk_test_" prefix). ' +
      'Refusing to run the sandbox suite against live Stripe.'
  )
}
