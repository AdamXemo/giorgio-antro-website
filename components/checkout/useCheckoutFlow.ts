import { useState, useCallback } from 'react'
import type { Stripe, StripeElements } from '@stripe/stripe-js'

interface FormState {
  email: string
  phone: string
}

export interface FormErrors {
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

export function useCheckoutFlow(stripe: Stripe | null, elements: StripeElements | null) {
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

    // Only reached if Stripe did NOT redirect
    if (error) {
      setSubmitError(error.message ?? 'Payment failed. Please try again.')
      setIsSubmitting(false)
    }
  }

  return { form, errors, isSubmitting, submitError, field, handleSubmit }
}
