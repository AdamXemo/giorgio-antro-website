'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useCart } from '@/components/CartContext'
import { toast } from 'sonner'
import { Lock, ChevronLeft } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const inputClass =
  'w-full px-0 py-3.5 bg-transparent border-b border-black/15 focus:border-black outline-none text-sm transition-colors placeholder:text-black/25'

// ── Stripe Elements appearance ────────────────────────────────────────────────

const stripeAppearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#000000',
    colorBackground: '#ffffff',
    colorText: '#000000',
    colorDanger: '#cc0000',
    fontFamily: 'inherit',
    borderRadius: '0px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      border: 'none',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      padding: '14px 0',
      fontSize: '14px',
      boxShadow: 'none',
      backgroundColor: 'transparent',
    },
    '.Input:focus': {
      borderBottom: '1px solid #000000',
      boxShadow: 'none',
      outline: 'none',
    },
    '.Input--invalid': {
      borderBottom: '1px solid #cc0000',
      boxShadow: 'none',
    },
    '.Label': {
      fontSize: '10px',
      letterSpacing: '0.15em',
      color: 'rgba(0,0,0,0.35)',
      textTransform: 'uppercase',
      marginBottom: '6px',
    },
    '.Error': {
      fontSize: '11px',
      color: '#cc0000',
      marginTop: '6px',
    },
    '.Tab': {
      border: '1px solid rgba(0,0,0,0.15)',
      borderRadius: '0',
      boxShadow: 'none',
    },
    '.Tab--selected': {
      border: '1px solid #000000',
      boxShadow: 'none',
    },
    '.Tab:hover': {
      border: '1px solid rgba(0,0,0,0.35)',
      boxShadow: 'none',
    },
  },
}

// ── Inner form (must be inside <Elements>) ────────────────────────────────────

interface CheckoutFormProps {
  subtotal: number
  shipping: number
  total: number
}

function CheckoutForm({ subtotal, shipping, total }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { cart, clearCart } = useCart()

  const [processing, setProcessing] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'BE',
  })

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/success`,
        payment_method_data: {
          billing_details: {
            name:  form.name,
            email: form.email,
            phone: form.phone || undefined,
            address: {
              line1:       form.line1,
              line2:       form.line2 || undefined,
              city:        form.city,
              state:       form.state,
              postal_code: form.postalCode,
              country:     form.country,
            },
          },
        },
      },
    })

    // confirmPayment redirects on success; we only reach here on error
    if (error) {
      toast.error(error.message ?? 'Payment failed. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

      {/* ── Left: Form fields ─────────────────────────── */}
      <div className="lg:col-span-3 space-y-10">

        {/* Customer info */}
        <div>
          <p className="text-[10px] tracking-[0.3em] mb-8">CONTACT INFORMATION</p>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="sr-only">Full name</label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={set('name')}
                placeholder="Full name"
                autoComplete="name"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={set('email')}
                placeholder="Email address"
                autoComplete="email"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">Phone (optional)</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="Phone (optional)"
                autoComplete="tel"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div>
          <p className="text-[10px] tracking-[0.3em] mb-8">SHIPPING ADDRESS</p>
          <div className="space-y-6">
            <div>
              <label htmlFor="line1" className="sr-only">Address line 1</label>
              <input
                id="line1"
                type="text"
                required
                value={form.line1}
                onChange={set('line1')}
                placeholder="Address"
                autoComplete="address-line1"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="line2" className="sr-only">Address line 2 (optional)</label>
              <input
                id="line2"
                type="text"
                value={form.line2}
                onChange={set('line2')}
                placeholder="Apartment, suite, etc. (optional)"
                autoComplete="address-line2"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="sr-only">City</label>
                <input
                  id="city"
                  type="text"
                  required
                  value={form.city}
                  onChange={set('city')}
                  placeholder="City"
                  autoComplete="address-level2"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="state" className="sr-only">State / Province</label>
                <input
                  id="state"
                  type="text"
                  value={form.state}
                  onChange={set('state')}
                  placeholder="State / Province"
                  autoComplete="address-level1"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="postalCode" className="sr-only">Postal code</label>
                <input
                  id="postalCode"
                  type="text"
                  required
                  value={form.postalCode}
                  onChange={set('postalCode')}
                  placeholder="Postal code"
                  autoComplete="postal-code"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="country" className="sr-only">Country code</label>
                <input
                  id="country"
                  type="text"
                  required
                  value={form.country}
                  onChange={set('country')}
                  placeholder="Country (e.g. BE)"
                  autoComplete="country"
                  maxLength={2}
                  className={`${inputClass} uppercase`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div>
          <p className="text-[10px] tracking-[0.3em] mb-8">PAYMENT</p>
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!stripe || !elements || processing}
          className="w-full bg-black text-white py-4 text-[10px] tracking-[0.25em] flex items-center justify-center gap-3 border border-black hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white"
        >
          {processing ? (
            <>
              <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
              PROCESSING...
            </>
          ) : (
            <>
              <Lock size={11} strokeWidth={1.5} />
              PAY €{total.toFixed(2)}
            </>
          )}
        </button>
      </div>

      {/* ── Right: Order summary ──────────────────────── */}
      <div className="lg:col-span-2 order-first lg:order-last">
        <div className="border-t border-black pt-8 lg:sticky lg:top-24">
          <p className="text-[10px] tracking-[0.3em] mb-8">ORDER SUMMARY</p>

          <div className="space-y-6 mb-8 border-b border-black/10 pb-8">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4">
                <div className="relative w-16 h-16 flex-shrink-0 bg-[#f2f2f2] overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white text-[9px] flex items-center justify-center rounded-full tabular-nums">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex flex-1 justify-between min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-[10px] tracking-[0.1em] text-black/35 mt-1">SIZE {item.size}</p>
                  </div>
                  <p className="text-sm tabular-nums flex-shrink-0 ml-3">
                    €{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-black/45">Subtotal</span>
              <span className="tabular-nums">€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-black/45">Shipping</span>
              <span className="tabular-nums font-medium">
                {shipping === 0 ? 'FREE' : `€${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-black/10 pt-3 flex justify-between">
              <span className="text-sm font-medium">Total</span>
              <span className="text-sm tabular-nums font-medium">€{total.toFixed(2)}</span>
            </div>
          </div>

          {subtotal < 100 && (
            <p className="text-[10px] tracking-[0.08em] text-black/35 leading-loose">
              Add €{(100 - subtotal).toFixed(2)} more for free shipping.
            </p>
          )}
        </div>
      </div>

    </form>
  )
}

// ── Outer page — fetches clientSecret before rendering Elements ───────────────

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart()
  const router = useRouter()

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    if (cart.length === 0) {
      router.replace('/cart')
      return
    }

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setInitError(data.error ?? 'Failed to initialize checkout.')
        }
      })
      .catch(() => setInitError('Failed to initialize checkout. Please try again.'))
  }, [mounted]) // eslint-disable-line react-hooks/exhaustive-deps

  const subtotal = cartTotal
  const shipping = subtotal >= 100 ? 0 : 10
  const total = subtotal + shipping

  return (
    <div className="min-h-screen pt-[73px]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-16">

        <div className="mb-12">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.15em] text-black/35 hover:text-black transition-colors mb-8"
          >
            <ChevronLeft size={12} strokeWidth={1.5} />
            BACK TO CART
          </Link>
          <p className="text-[10px] tracking-[0.3em] text-black/35 mb-3">CHECKOUT</p>
          <h1 className="font-display font-light text-4xl md:text-5xl">Complete your order.</h1>
        </div>

        {initError ? (
          <div className="py-20 text-center">
            <p className="text-sm text-black/45 mb-6">{initError}</p>
            <Link href="/cart" className="btn-primary">
              RETURN TO CART
            </Link>
          </div>
        ) : !clientSecret ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-5 h-5 border border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance: stripeAppearance }}
          >
            <CheckoutForm subtotal={subtotal} shipping={shipping} total={total} />
          </Elements>
        )}

      </div>
    </div>
  )
}
