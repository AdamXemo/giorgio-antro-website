import Stripe from 'stripe'

let instance: Stripe | null = null

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('[lib/stripe.ts] STRIPE_SECRET_KEY must be set.')
  }
  if (!instance) {
    instance = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return instance
}
