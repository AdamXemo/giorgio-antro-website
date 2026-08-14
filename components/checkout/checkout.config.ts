import type { Appearance, StripeAddressElementOptions, StripePaymentElementOptions } from '@stripe/stripe-js'

const BORDER = '1px solid #eaeaea'
const BORDER_FOCUS = '1px solid #000000'
const TEXT_MUTED = 'rgba(0,0,0,0.4)'
const PLACEHOLDER = 'rgba(0,0,0,0.20)'

/** Appearance for the Stripe Elements iframe, matched to the site's styling. */
export const checkoutAppearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#000000',
    colorBackground: '#ffffff',
    colorText: '#000000',
    colorTextSecondary: TEXT_MUTED,
    colorTextPlaceholder: PLACEHOLDER,
    colorDanger: '#dc2626',
    fontFamily: '"Inter", system-ui, sans-serif',
    borderRadius: '2px',
    spacingUnit: '3px',
    fontSizeBase: '13px',
  },
  rules: {
    '.Input': {
      border: BORDER,
      padding: '8px 12px',
      fontSize: '13px',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      outline: 'none',
      transition: 'border-color 0.15s ease',
    },
    '.Input:focus': {
      border: BORDER_FOCUS,
      boxShadow: 'none',
      outline: 'none',
    },
    '.Input--invalid': {
      border: '1px solid #dc2626',
      boxShadow: 'none',
    },
    '.Label': {
      fontSize: '10px',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: TEXT_MUTED,
      marginBottom: '6px',
    },
    '.Error': {
      fontSize: '11px',
      letterSpacing: '0.05em',
      marginTop: '4px',
    },
    '.Block': {
      border: BORDER,
      boxShadow: 'none',
      backgroundColor: 'transparent',
      borderRadius: '2px',
    },
    '.AccordionItem:first-child': { borderTop: BORDER },
    '.RadioInput': {
      border: BORDER,
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
    '.RadioInput--checked': {
      backgroundColor: '#000000',
      border: '1px solid #000000',
    },
    '.PickerItem': {
      border: 'none',
      boxShadow: 'none',
      backgroundColor: 'transparent',
    },
    '.PickerItem--selected': {
      border: 'none',
      backgroundColor: 'rgba(0,0,0,0.03)',
      boxShadow: 'none',
    },
  },
}

// TODO: identify which countries we actually ship to and only allow those
export const ALLOWED_COUNTRIES: string[] = [
  'BE', 'NL', 'DE', 'FR', 'LU', 'IT', 'ES', 'AT', 'CH', 'GB', 'US', 'CA', 'AU',
]

export const inputBase =
  'w-full border rounded-[2px] bg-transparent px-3 py-2 text-[13px] font-sans ' +
  'text-black ' +
  'border-[#eaeaea] ' +
  'placeholder:text-black/20 ' +
  'focus:outline-none focus:border-black ' +
  'transition-colors duration-150'

export const inputError =
  'border-red-300 focus:border-red-500'

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
