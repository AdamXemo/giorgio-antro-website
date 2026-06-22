'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useCart } from '@/components/cart/CartContext'
import { useTheme } from '@/components/theme/ThemeProvider'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { CheckoutOrderSummary } from '@/components/checkout/CheckoutOrderSummary'
import { buildAppearance } from '@/components/checkout/checkout.config'
import { useCheckoutSummary } from '@/components/checkout/CheckoutSummaryContext'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutContent() {
  const router = useRouter()
  const { cart, cartTotal } = useCart()
  const { theme } = useTheme()
  const { setSummary } = useCheckoutSummary()

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [initError, setInitError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional SSR guard: forces re-render after CartProvider hydrates from localStorage
    setMounted(true)
  }, [])

  // Clear summary from header when leaving checkout
  useEffect(() => {
    return () => setSummary(null)
  }, [setSummary])

  const isDark = theme === 'dark'

  // Stable string that changes only when cart contents actually change
  const cartKey = useMemo(
    () => cart.map((i) => `${i.id}:${i.size}:${i.quantity}`).join(','),
    [cart]
  )

  useEffect(() => {
    if (!mounted) return
    if (!cartKey) {
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
        if (data.clientSecret) setClientSecret(data.clientSecret)
        else setInitError(data.error ?? 'Failed to initialize checkout.')
      })
      .catch(() => setInitError('Failed to initialize checkout. Please try again.'))
  }, [mounted, cartKey, router]) // eslint-disable-line react-hooks/exhaustive-deps -- `cart` intentionally omitted; `cartKey` captures its identity

  const shipping = cartTotal >= 100 ? 0 : 10
  const total = cartTotal + shipping

  const appearance = useMemo(() => buildAppearance(isDark), [isDark])
  const elementsOptions = useMemo(
    () => (clientSecret ? { clientSecret, appearance, loader: 'auto' as const } : null),
    [clientSecret, appearance]
  )

  // Register summary into the header context once Stripe is ready
  useEffect(() => {
    if (!elementsOptions) return
    setSummary({ items: cart, subtotal: cartTotal, shipping, total })
  }, [elementsOptions, cart, cartTotal, shipping, total, setSummary])

  return (
    <div className="min-h-screen pt-[73px]">

      {/* ── Error state ─────────────────────────────────── */}
      {initError && (
        <div className="max-w-screen-md mx-auto px-6 md:px-12 py-20 text-center">
          <p className="text-sm text-black/45 dark:text-white/45 mb-6">{initError}</p>
          <Link href="/cart" className="btn-primary">
            <span className="relative z-10">RETURN TO CART</span>
          </Link>
        </div>
      )}

      {/* ── Loading state ───────────────────────────────── */}
      {!initError && !clientSecret && mounted && (
        <div className="flex items-center justify-center py-32">
          <div className="w-5 h-5 border border-black dark:border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ── Main layout (only when Stripe is ready) ─────── */}
      {elementsOptions && (
        <Elements stripe={stripePromise} options={elementsOptions}>
          <div className="max-w-screen-lg mx-auto">

            {/* Two-column grid */}
            <div className="grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">

              {/* Left: form */}
              <div className="px-6 md:px-12 pt-2 pb-12 lg:border-r border-black/8 dark:border-white/8">
                <CheckoutForm />
              </div>

              {/* Right: summary — desktop only */}
              <div className="hidden lg:block px-8 xl:px-12 pt-2 pb-12 lg:sticky lg:top-[88px] self-start">
                <CheckoutOrderSummary
                  items={cart}
                  subtotal={cartTotal}
                  shipping={shipping}
                  total={total}
                />
              </div>

            </div>
          </div>
        </Elements>
      )}

    </div>
  )
}

function CheckoutFallback() {
  return (
    <div className="min-h-screen pt-[73px] flex items-center justify-center">
      <div className="w-5 h-5 border border-black dark:border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  )
}
