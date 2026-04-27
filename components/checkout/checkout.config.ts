import type { Appearance, StripeAddressElementOptions, StripePaymentElementOptions } from '@stripe/stripe-js'

export function buildAppearance(isDark: boolean): Appearance {
  const border = isDark ? '1px solid rgba(240,240,240,0.10)' : '1px solid #eaeaea'
  const borderFocus = isDark ? '1px solid rgba(240,240,240,0.80)' : '1px solid #000000'
  const textMuted = isDark ? 'rgba(240,240,240,0.4)' : 'rgba(0,0,0,0.4)'
  const placeholder = isDark ? 'rgba(240,240,240,0.18)' : 'rgba(0,0,0,0.20)'

  return {
    theme: 'stripe',
    variables: {
      colorPrimary: isDark ? '#f0f0f0' : '#000000',
      colorBackground: isDark ? '#0f0f0f' : '#ffffff',
      colorText: isDark ? '#f0f0f0' : '#000000',
      colorTextSecondary: textMuted,
      colorTextPlaceholder: placeholder,
      colorDanger: isDark ? '#f87171' : '#dc2626',
      fontFamily: '"Inter", system-ui, sans-serif',
      borderRadius: '2px',
      spacingUnit: '3px',
      fontSizeBase: '13px',
    },
    rules: {
      '.Input': {
        border,
        padding: '8px 12px',
        fontSize: '13px',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        outline: 'none',
        transition: 'border-color 0.15s ease',
      },
      '.Input:focus': {
        border: borderFocus,
        boxShadow: 'none',
        outline: 'none',
      },
      '.Input--invalid': {
        border: isDark ? '1px solid #f87171' : '1px solid #dc2626',
        boxShadow: 'none',
      },
      '.Label': {
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: textMuted,
        marginBottom: '6px',
      },
      '.Error': {
        fontSize: '11px',
        letterSpacing: '0.05em',
        marginTop: '4px',
      },
      '.Block': {
        border,
        boxShadow: 'none',
        backgroundColor: 'transparent',
        borderRadius: '2px',
      },
      '.AccordionItem:first-child': { borderTop: border },
      '.RadioInput': {
        border,
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
      '.RadioInput--checked': {
        backgroundColor: isDark ? '#f0f0f0' : '#000000',
        border: isDark ? '1px solid #f0f0f0' : '1px solid #000000',
      },
      '.PickerItem': {
        border: 'none',
        boxShadow: 'none',
        backgroundColor: 'transparent',
      },
      '.PickerItem--selected': {
        border: 'none',
        backgroundColor: isDark ? 'rgba(240,240,240,0.04)' : 'rgba(0,0,0,0.03)',
        boxShadow: 'none',
      },
    },
  }
}

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
