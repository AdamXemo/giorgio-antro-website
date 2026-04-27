import type { StripeAddressElementOptions, StripePaymentElementOptions } from '@stripe/stripe-js'

// TODO: identify which countries we actually ship to and only allow those
export const ALLOWED_COUNTRIES: string[] = [
  'BE', 'NL', 'DE', 'FR', 'LU', 'IT', 'ES', 'AT', 'CH', 'GB', 'US', 'CA', 'AU',
]

export const inputBase =
  'w-full border rounded-[2px] bg-transparent px-3 py-2 text-[13px] font-sans ' +
  'text-black dark:text-white ' +
  'border-[#eaeaea] dark:border-white/10 ' +
  'placeholder:text-black/20 dark:placeholder:text-white/18 ' +
  'focus:outline-none focus:border-black dark:focus:border-white ' +
  'transition-colors duration-150'

export const inputError =
  'border-red-300 dark:border-red-500/70 focus:border-red-500 dark:focus:border-red-400'

export const stripeAddressOptions = {
  mode: 'shipping',
  allowedCountries: ALLOWED_COUNTRIES,
  fields: { phone: 'never' },
  defaultValues: { address: { country: 'BE' } },
} satisfies StripeAddressElementOptions

export const stripePaymentOptions = {
  layout: {
    type: 'accordion',
    defaultCollapsed: false,
    radios: 'if_multiple',
    spacedAccordionItems: false,
  },
  paymentMethodOrder: [
    'apple_pay',
    'google_pay',
    'paypal',
    'card',
    'bancontact',
    'ideal',
    'klarna',
  ],
  wallets: {
    applePay: 'auto',
    googlePay: 'auto',
    link: 'never',
  },
  fields: {
    billingDetails: {
      name: 'never',
      email: 'never',
      phone: 'auto',
      address: {
        line1: 'never',
        line2: 'never',
        city: 'never',
        state: 'auto',
        postalCode: 'never',
        country: 'never',
      },
    },
  },
  terms: {
    card: 'never',
    applePay: 'never',
    googlePay: 'never',
    paypal: 'never',
    klarna: 'never',
  },
} satisfies StripePaymentElementOptions
