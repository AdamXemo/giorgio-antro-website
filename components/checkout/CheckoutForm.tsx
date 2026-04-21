'use client'

import { useState, useCallback } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Lock } from 'lucide-react'
import { FormField } from './FormField'

const COUNTRIES = [
  { code: 'BE', name: 'Belgium' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'AT', name: 'Austria' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
]

interface FormState {
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string
  address2: string
  city: string
  postalCode: string
  country: string
}

interface FormErrors {
  email?: string
  firstName?: string
  lastName?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
}

function validate(form: FormState): FormErrors {
  const e: FormErrors = {}
  if (!form.email.trim()) {
    e.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    e.email = 'Please enter a valid email'
  }
  if (!form.firstName.trim()) e.firstName = 'First name is required'
  if (!form.lastName.trim()) e.lastName = 'Last name is required'
  if (!form.address.trim()) e.address = 'Address is required'
  if (!form.city.trim()) e.city = 'City is required'
  if (!form.postalCode.trim()) e.postalCode = 'Postal code is required'
  if (!form.country) e.country = 'Country is required'
  return e
}

const inputBase =
  'w-full border bg-transparent px-3 py-3 text-sm font-sans ' +
  'text-black dark:text-white ' +
  'border-black/12 dark:border-white/15 ' +
  'placeholder:text-black/22 dark:placeholder:text-white/22 ' +
  'focus:outline-none focus:border-black/55 dark:focus:border-white/55 ' +
  'transition-colors duration-150'

const inputError = 'border-red-400 dark:border-red-500 focus:border-red-500 dark:focus:border-red-400'

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
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
  return <div className="my-8 h-px bg-black/8 dark:bg-white/8" />
}

export function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()

  const [form, setForm] = useState<FormState>({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    postalCode: '',
    country: 'BE',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const field = useCallback(
    (key: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const firstErrorKey = Object.keys(validationErrors)[0]
      document.getElementById(`field-${firstErrorKey}`)?.focus()
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/success`,
        payment_method_data: {
          billing_details: {
            name: fullName,
            email: form.email.trim(),
            phone: form.phone.trim() || undefined,
            address: {
              line1: form.address.trim(),
              line2: form.address2.trim() || undefined,
              city: form.city.trim(),
              postal_code: form.postalCode.trim(),
              country: form.country,
            },
          },
        },
        shipping: {
          name: fullName,
          phone: form.phone.trim() || undefined,
          address: {
            line1: form.address.trim(),
            line2: form.address2.trim() || undefined,
            city: form.city.trim(),
            postal_code: form.postalCode.trim(),
            country: form.country,
          },
        },
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
        <div className="grid gap-4">
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
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First name" error={errors.firstName}>
              <input
                id="field-firstName"
                type="text"
                autoComplete="given-name"
                value={form.firstName}
                onChange={field('firstName')}
                className={`${inputBase} ${errors.firstName ? inputError : ''}`}
              />
            </FormField>
            <FormField label="Last name" error={errors.lastName}>
              <input
                id="field-lastName"
                type="text"
                autoComplete="family-name"
                value={form.lastName}
                onChange={field('lastName')}
                className={`${inputBase} ${errors.lastName ? inputError : ''}`}
              />
            </FormField>
          </div>

          <FormField label="Address" error={errors.address}>
            <input
              id="field-address"
              type="text"
              autoComplete="address-line1"
              value={form.address}
              onChange={field('address')}
              placeholder="Street and number"
              className={`${inputBase} ${errors.address ? inputError : ''}`}
            />
          </FormField>

          <FormField label="Apartment, suite, etc. (optional)">
            <input
              type="text"
              autoComplete="address-line2"
              value={form.address2}
              onChange={field('address2')}
              placeholder="Apt, suite, floor..."
              className={inputBase}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="City" error={errors.city}>
              <input
                id="field-city"
                type="text"
                autoComplete="address-level2"
                value={form.city}
                onChange={field('city')}
                className={`${inputBase} ${errors.city ? inputError : ''}`}
              />
            </FormField>
            <FormField label="Postal code" error={errors.postalCode}>
              <input
                id="field-postalCode"
                type="text"
                autoComplete="postal-code"
                value={form.postalCode}
                onChange={field('postalCode')}
                className={`${inputBase} ${errors.postalCode ? inputError : ''}`}
              />
            </FormField>
          </div>

          <FormField label="Country" error={errors.country}>
            <div className="relative">
              <select
                id="field-country"
                autoComplete="country"
                value={form.country}
                onChange={field('country')}
                className={`${inputBase} ${errors.country ? inputError : ''} appearance-none cursor-pointer pr-8`}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  className="text-black/35 dark:text-white/35"
                >
                  <path
                    d="M1 1l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </FormField>
        </div>
      </section>

      <Divider />

      {/* ── 03 PAYMENT ─────────────────────────────────── */}
      <section>
        <SectionLabel number="03" title="Payment" />
        <PaymentElement
          options={{
            layout: 'tabs',
            fields: {
              billingDetails: {
                name: 'never',
                email: 'never',
                phone: 'never',
                address: {
                  line1: 'never',
                  line2: 'never',
                  city: 'never',
                  state: 'never',
                  postalCode: 'never',
                  country: 'never',
                },
              },
            },
            terms: { card: 'never' },
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
          className="btn-primary block w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2.5">
            {isSubmitting ? (
              <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock size={11} strokeWidth={1.5} />
                <span>PLACE ORDER</span>
              </>
            )}
          </span>
        </button>

        <p className="mt-4 text-center text-[10px] tracking-[0.15em] text-black/25 dark:text-white/25">
          SECURED BY STRIPE · SSL ENCRYPTED
        </p>
      </div>
    </form>
  )
}
