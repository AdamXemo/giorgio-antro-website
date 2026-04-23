'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import type { Appearance } from '@stripe/stripe-js'
import { ChevronLeft } from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { CheckoutOrderSummary } from '@/components/checkout/CheckoutOrderSummary'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function buildAppearance(isDark: boolean): Appearance {
  const border = isDark ? '1px solid rgba(240,240,240,0.10)' : '1px solid #eaeaea'
  const borderFocus = isDark ? '1px solid rgba(240,240,240,0.80)' : '1px solid #000000'
  const borderSelected = isDark ? '1px solid rgba(240,240,240,0.7)' : '1px solid #000000'
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

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal } = useCart()

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [initError, setInitError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

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
        if (data.clientSecret) setClientSecret(data.clientSecret)
        else setInitError(data.error ?? 'Failed to initialize checkout.')
      })
      .catch(() => setInitError('Failed to initialize checkout. Please try again.'))
  }, [mounted]) // eslint-disable-line react-hooks/exhaustive-deps

  const shipping = cartTotal >= 100 ? 0 : 10
  const total = cartTotal + shipping

  const appearance = useMemo(() => buildAppearance(isDark), [isDark])
  const elementsOptions = useMemo(
    () => (clientSecret ? { clientSecret, appearance, loader: 'auto' as const } : null),
    [clientSecret, appearance]
  )

  return (
    <div className="min-h-screen pt-[73px]">

      {/* ── Page header ─────────────────────────────────── */}
      <div className="px-6 md:px-12 py-5 flex items-center justify-between border-b border-black/8 dark:border-white/8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors group"
          aria-label="Back to cart"
        >
          <ChevronLeft
            size={14}
            strokeWidth={1.5}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span className="text-[10px] tracking-[0.2em]">CART</span>
        </Link>
        <span className="text-[10px] tracking-[0.3em] text-black/25 dark:text-white/25">
          ANTRO — CHECKOUT
        </span>
      </div>

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

            {/* Mobile summary strip — visible below lg */}
            <div className="lg:hidden border-b border-black/8 dark:border-white/8">
              <CheckoutOrderSummary
                items={cart}
                subtotal={cartTotal}
                shipping={shipping}
                total={total}
              />
            </div>

            {/* Two-column grid */}
            <div className="grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">

              {/* Left: form */}
              <div className="px-6 md:px-12 py-10 lg:border-r border-black/8 dark:border-white/8">
                <CheckoutForm />
              </div>

              {/* Right: summary — desktop only */}
              <div className="hidden lg:block px-8 xl:px-12 py-10">
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
