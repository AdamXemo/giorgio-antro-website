'use client'

import { useState, useCallback } from 'react'
import { useStripe, useElements, PaymentElement, AddressElement } from '@stripe/react-stripe-js'
import { Lock } from 'lucide-react'
import { FormField } from './FormField'

const ALLOWED_COUNTRIES: string[] = [
  'BE', 'NL', 'DE', 'FR', 'LU', 'IT', 'ES', 'AT', 'CH', 'GB', 'US', 'CA', 'AU',
]

interface FormState {
  email: string
  phone: string
}

interface FormErrors {
  email?: string
}

function validate(form: FormState): FormErrors {
  const e: FormErrors = {}
  if (!form.email.trim()) {
    e.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    e.email = 'Please enter a valid email'
  }
  return e
}

const inputBase =
  'w-full border rounded-[2px] bg-transparent px-3 py-2 text-[13px] font-sans ' +
  'text-black dark:text-white ' +
  'border-[#eaeaea] dark:border-white/10 ' +
  'placeholder:text-black/20 dark:placeholder:text-white/18 ' +
  'focus:outline-none focus:border-black dark:focus:border-white ' +
  'transition-colors duration-150'

const inputError = 'border-red-300 dark:border-red-500/70 focus:border-red-500 dark:focus:border-red-400'

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span className="text-[10px] tracking-[0.3em] text-black/25 dark:text-white/25 font-body tabular-nums">
        {number}
      </span>
      <span className="text-[10px] tracking-[0.3em] uppercase text-black dark:text-white">
        {title}
      </span>
      <div className="flex-1 h-px bg-black/8 dark:bg-white/8" />
    </div>
  )
}

function Divider() {
  return <div className="my-10" />
}

export function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()

  const [form, setForm] = useState<FormState>({ email: '', phone: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const field = useCallback(
    (key: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }))
        if (errors[key as keyof FormErrors]) {
          setErrors((prev) => ({ ...prev, [key]: undefined }))
        }
      },
    [errors]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      document.getElementById('field-email')?.focus()
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    const addressElement = elements.getElement('address')
    const addressResult = addressElement ? await addressElement.getValue() : null
    const name = addressResult?.value?.name ?? ''
    const addr = addressResult?.value?.address

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/success`,
        payment_method_data: {
          billing_details: {
            name,
            email: form.email.trim(),
            phone: form.phone.trim() || undefined,
            address: addr
              ? {
                  line1: addr.line1,
                  line2: addr.line2 || undefined,
                  city: addr.city,
                  state: addr.state || undefined,
                  postal_code: addr.postal_code,
                  country: addr.country,
                }
              : undefined,
          },
        },
        shipping: addr
          ? {
              name,
              phone: form.phone.trim() || undefined,
              address: {
                line1: addr.line1,
                line2: addr.line2 || undefined,
                city: addr.city,
                state: addr.state || undefined,
                postal_code: addr.postal_code,
                country: addr.country,
              },
            }
          : undefined,
      },
    })

    // Only reached if Stripe did NOT redirect (i.e. there was an error)
    if (error) {
      setSubmitError(error.message ?? 'Payment failed. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="animate-fade-in">

      {/* ── 01 CONTACT ─────────────────────────────────── */}
      <section>
        <SectionLabel number="01" title="Contact" />
        <div className="grid gap-3">
          <FormField label="Email address" error={errors.email}>
            <input
              id="field-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={field('email')}
              placeholder="you@example.com"
              className={`${inputBase} ${errors.email ? inputError : ''}`}
            />
          </FormField>
          <FormField label="Phone number (optional)">
            <input
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={field('phone')}
              placeholder="+32 ..."
              className={inputBase}
            />
          </FormField>
        </div>
      </section>

      <Divider />

      {/* ── 02 SHIPPING ────────────────────────────────── */}
      <section>
        <SectionLabel number="02" title="Shipping" />
        <AddressElement
          options={{
            mode: 'shipping',
            allowedCountries: ALLOWED_COUNTRIES,
            fields: { phone: 'never' },
            defaultValues: { address: { country: 'BE' } },
          }}
        />
      </section>

      <Divider />

      {/* ── 03 PAYMENT ─────────────────────────────────── */}
      <section>
        <SectionLabel number="03" title="Payment" />
        <PaymentElement
          options={{
            layout: {
              type: 'accordion',
              defaultCollapsed: false,
              radios: 'if_multiple',
              spacedAccordionItems: false,
            },
            // Digital wallets first — best for mobile UX
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
          }}
        />
      </section>

      {/* ── Error message ───────────────────────────────── */}
      {submitError && (
        <div className="mt-6 px-4 py-3 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <p className="text-[13px] text-red-600 dark:text-red-400">{submitError}</p>
        </div>
      )}

      {/* ── Submit ──────────────────────────────────────── */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={!stripe || !elements || isSubmitting}
          className={[
            'w-full py-3.5 border rounded-[2px]',
            'border-black dark:border-white',
            'bg-black dark:bg-white',
            'text-white dark:text-black',
            'text-[10px] tracking-[0.45em] font-light',
            'flex items-center justify-center gap-2.5',
            'transition-colors duration-500',
            'hover:bg-white hover:text-black dark:hover:bg-transparent dark:hover:text-white',
            'disabled:opacity-30 disabled:cursor-not-allowed',
          ].join(' ')}
        >
          {isSubmitting ? (
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Lock size={10} strokeWidth={1.5} />
              <span>PLACE ORDER</span>
            </>
          )}
        </button>

        <p className="mt-4 text-center text-[10px] tracking-[0.15em] text-black/22 dark:text-white/22">
          SECURED BY STRIPE · SSL ENCRYPTED
        </p>
      </div>
    </form>
  )
}
