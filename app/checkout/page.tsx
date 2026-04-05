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
      <div className="max-w-screen-md mx-auto px-6 md:px-12 pt-6 pb-16">

        {/* Slim back link */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-black/30 hover:text-black transition-colors mb-6 group"
          aria-label="Back to cart"
        >
          <ChevronLeft size={16} strokeWidth={1.5} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-[10px] tracking-[0.2em]">CART</span>
        </Link>

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
