import { useState } from 'react'
import type { Stripe, StripeElements } from '@stripe/stripe-js'

export interface FormErrors {
  email?: string
  phone?: string
}

function validateContact(email: string, phone: string): FormErrors {
  const e: FormErrors = {}

  if (!email.trim()) {
    e.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    e.email = 'Please enter a valid email'
  }

  if (phone.trim() && !/^\+?[\d\s\-()]{7,20}$/.test(phone.trim())) {
    e.phone = 'Please enter a valid phone number'
  }

  return e
}

function validateAddress(addressResult: { complete: boolean } | null): string | null {
  if (!addressResult) {
    return 'Address system failed to load. Please refresh the page.'
  }
  if (!addressResult.complete) {
    return 'Please complete all required shipping fields.'
  }
  return null
}

export function useCheckoutFlow(stripe: Stripe | null, elements: StripeElements | null) {
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setErrors({})
    setSubmitError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string

    const validationErrors = validateContact(email, phone)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      if (validationErrors.email) document.getElementById('field-email')?.focus()
      else if (validationErrors.phone) document.getElementById('field-phone')?.focus()
      return
    }

    setIsSubmitting(true)

    // Must call elements.submit() before confirmPayment to trigger Stripe's native UI validation
    const { error: elementsError } = await elements.submit()
    if (elementsError) {
      setIsSubmitting(false)
      return
    }

    const addressElement = elements.getElement('address')
    const addressResult = addressElement ? await addressElement.getValue() : null

    const addressError = validateAddress(addressResult)
    if (addressError) {
      setSubmitError(addressError)
      setIsSubmitting(false)
      return
    }

    const name = addressResult?.value?.name ?? ''
    const addr = addressResult?.value?.address

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/success`,
        payment_method_data: {
          billing_details: {
            name,
            email: email.trim(),
            phone: phone.trim() || undefined,
            address: addr
              ? {
                  line1: addr.line1,
                  line2: addr.line2 ? addr.line2 : undefined,
                  city: addr.city,
                  state: addr.state ? addr.state : undefined,
                  postal_code: addr.postal_code,
                  country: addr.country,
                }
              : undefined,
          },
        },
        shipping: addr
          ? {
              name,
              phone: phone.trim() || undefined,
              address: {
                line1: addr.line1,
                line2: addr.line2 ? addr.line2 : undefined,
                city: addr.city,
                state: addr.state ? addr.state : undefined,
                postal_code: addr.postal_code,
                country: addr.country,
              },
            }
          : undefined,
      },
    })

    if (error) {
      // card_error and validation_error are shown inline by Stripe — suppress the banner to avoid duplication
      if (error.type !== 'card_error' && error.type !== 'validation_error') {
        setSubmitError(error.message ?? 'An unexpected error occurred. Please try again.')
      }
      setIsSubmitting(false)
    }
  }

  return { errors, isSubmitting, submitError, handleSubmit }
}
