'use client'

import { useStripe, useElements, PaymentElement, AddressElement } from '@stripe/react-stripe-js'
import { Lock } from 'lucide-react'
import { FormField } from './FormField'
import { useCheckoutFlow } from './useCheckoutFlow'
import { inputBase, inputError, stripeAddressOptions, stripePaymentOptions } from './checkout.config'

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span className="text-[10px] tracking-[0.3em] text-black/25 font-body tabular-nums">
        {number}
      </span>
      <span className="text-[10px] tracking-[0.3em] uppercase text-black">
        {title}
      </span>
      <div className="flex-1 h-px bg-black/8" />
    </div>
  )
}

function Divider() {
  return <div className="my-10" />
}

export function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  
  const { errors, isSubmitting, submitError, handleSubmit } = useCheckoutFlow(stripe, elements)

  return (
    <form onSubmit={handleSubmit} noValidate className="animate-fade-in">

      {/* 01 CONTACT */}
      <section>
        <SectionLabel number="01" title="Contact" />
        <div className="grid gap-3">
          <FormField label="Email address" error={errors.email}>
            <input
              id="field-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`${inputBase} ${errors.email ? inputError : ''}`}
            />
          </FormField>
          <FormField label="Phone number (optional)" error={errors.phone}>
            <input
              id="field-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+32 ..."
              className={`${inputBase} ${errors.phone ? inputError : ''}`}
            />
          </FormField>
        </div>
      </section>

      <Divider />

      {/* 02 SHIPPING */}
      <section>
        <SectionLabel number="02" title="Shipping" />
        <AddressElement options={stripeAddressOptions} />
      </section>

      <Divider />

      {/* 03 PAYMENT */}
      <section>
        <SectionLabel number="03" title="Payment" />
        <PaymentElement options={stripePaymentOptions} />
      </section>

      {/* Submission-level errors only — card/validation errors are shown inline by Stripe */}
      {submitError && (
        <div className="mt-6 px-4 py-3 border border-red-200 bg-red-50">
          <p className="text-[13px] text-red-600">{submitError}</p>
        </div>
      )}

      {/* Submit */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={!stripe || !elements || isSubmitting}
          className={[
            'w-full py-3.5 border rounded-[2px]',
            'border-black',
            'bg-black',
            'text-white',
            'text-[10px] tracking-[0.3em] font-light',
            'flex items-center justify-center gap-2.5',
            'transition-colors duration-500',
            'hover:bg-white hover:text-black',
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

        <p className="mt-4 text-center text-[10px] tracking-[0.15em] text-black/22">
          SECURED BY STRIPE · SSL ENCRYPTED
        </p>
      </div>
    </form>
  )
}
