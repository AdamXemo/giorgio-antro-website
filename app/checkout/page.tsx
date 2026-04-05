'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { useCart } from '@/components/CartContext'
import { ChevronLeft } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { cart } = useCart()
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

    fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret)
        else setInitError(data.error ?? 'Failed to initialize checkout.')
      })
      .catch(() => setInitError('Failed to initialize checkout. Please try again.'))
  }, [mounted]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen pt-[73px]">
      <div className="max-w-screen-lg mx-auto px-6 md:px-12 py-16">

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
            <Link href="/cart" className="btn-primary">RETURN TO CART</Link>
          </div>
        ) : !clientSecret ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-5 h-5 border border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}

      </div>
    </div>
  )
}
