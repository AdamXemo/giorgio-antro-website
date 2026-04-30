'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Mail, AlertCircle } from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'

function OrderSuccessContent() {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()

  const paymentIntent = searchParams.get('payment_intent')
  const redirectStatus = searchParams.get('redirect_status')

  useEffect(() => {
    if (!paymentIntent) {
      router.replace('/')
      return
    }
    if (redirectStatus === 'succeeded') {
      clearCart()
    }
  }, [paymentIntent, redirectStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!paymentIntent) return null

  if (redirectStatus === 'failed' || redirectStatus === 'requires_action') {
    return (
      <div className="pt-[73px] min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
        <div className="max-w-sm w-full px-6 py-12 text-center">
          <div className="flex items-center justify-center mb-10 animate-reveal-fade">
            <AlertCircle size={48} strokeWidth={0.75} className="text-black/30 dark:text-white/30" />
          </div>
          <p className="text-[9px] tracking-[0.35em] text-black/28 dark:text-white/28 mb-4 animate-reveal-fade animate-delay-100">PAYMENT {redirectStatus === 'failed' ? 'FAILED' : 'INCOMPLETE'}</p>
          <h1 className="font-display font-light text-4xl md:text-5xl leading-[1.1] mb-5 animate-reveal-up animate-delay-200">
            {redirectStatus === 'failed' ? 'Payment could not be processed.' : 'Additional action required.'}
          </h1>
          <div className="w-6 h-px bg-black/18 dark:bg-white/18 mx-auto mb-5 animate-reveal-fade animate-delay-300" />
          <p className="text-sm text-black/40 dark:text-white/40 leading-relaxed animate-reveal-fade animate-delay-300">
            {redirectStatus === 'failed'
              ? 'Your card was declined. Please try again with a different payment method.'
              : 'Your payment requires additional verification. Please return and complete the process.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-10 animate-reveal-fade animate-delay-400">
            <Link href="/checkout" className="btn-primary flex-1 text-center">
              <span>TRY AGAIN</span>
            </Link>
            <Link href="/contact" className="btn-ghost flex-1 text-center">
              <span>CONTACT US</span>
            </Link>
          </div>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-[73px]">
      <div className="max-w-sm mx-auto px-6 pt-12 pb-24 text-center">

        {/* Check icon — circle fades in, checkmark draws itself after a short delay */}
        <div className="flex items-center justify-center mb-10 animate-reveal-fade">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle
              cx="24" cy="24" r="22"
              stroke="currentColor" strokeWidth="0.75"
              className="text-black/12 dark:text-white/12"
            />
            <path
              d="M 15 24 L 21 30 L 33 18"
              stroke="currentColor" strokeWidth="1"
              strokeLinecap="round" strokeLinejoin="round"
              className="text-black/40 dark:text-white/40 animate-draw-check animate-delay-300"
            />
          </svg>
        </div>

        <p className="text-[9px] tracking-[0.35em] text-black/28 dark:text-white/28 mb-4 animate-reveal-fade animate-delay-100">ORDER CONFIRMED</p>
        <h1 className="font-display font-light text-4xl md:text-5xl leading-[1.1] mb-5 animate-reveal-up animate-delay-200">
          Thank you for<br />your purchase.
        </h1>
        <div className="w-6 h-px bg-black/18 dark:bg-white/18 mx-auto mb-5 animate-reveal-fade animate-delay-300" />
        <p className="text-sm text-black/40 dark:text-white/40 leading-relaxed animate-reveal-fade animate-delay-300">
          Your ANTRO order has been received<br className="hidden sm:block" /> and is being prepared with care.
        </p>

        {/* Info rows */}
        <div className="mt-8 pt-8 border-t border-black/[0.07] dark:border-white/[0.07] space-y-4 text-left animate-reveal-fade animate-delay-400">
          <div className="flex items-start gap-3 text-sm text-black/45 dark:text-white/45">
            <Mail size={13} strokeWidth={1.5} className="flex-shrink-0 mt-[3px] text-black/22 dark:text-white/22" />
            <p>A confirmation email with your order details is on its way.</p>
          </div>
          <div className="flex items-start gap-3 text-sm text-black/45 dark:text-white/45">
            <Package size={13} strokeWidth={1.5} className="flex-shrink-0 mt-[3px] text-black/22 dark:text-white/22" />
            <p>Processed and shipped within 1–2 business days.</p>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-8 pt-8 border-t border-black/[0.07] dark:border-white/[0.07] animate-reveal-fade animate-delay-500">
          <p className="text-[9px] tracking-[0.3em] text-black/22 dark:text-white/22 mb-6">WHAT HAPPENS NEXT</p>
          <div className="space-y-0">
            {[
              { n: '01', label: 'Processing', body: "We prepare your order with care." },
              { n: '02', label: 'Shipping',   body: "Tracking information sent by email." },
              { n: '03', label: 'Delivery',   body: 'Your piece arrives in 3–5 days.' },
            ].map(({ n, label, body }) => (
              <div key={n} className="flex items-baseline gap-4 py-3 border-b border-black/[0.06] dark:border-white/[0.06] last:border-0 text-left">
                <span className="text-[9px] text-black/18 dark:text-white/18 tabular-nums w-5 flex-shrink-0">{n}</span>
                <span className="text-xs font-medium w-20 flex-shrink-0">{label}</span>
                <span className="text-xs text-black/38 dark:text-white/38">{body}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-10 animate-reveal-fade animate-delay-600">
          <Link href="/" className="btn-primary flex-1 text-center">
            <span>CONTINUE SHOPPING</span>
          </Link>
          <Link href="/contact" className="btn-ghost flex-1 text-center">
            <span>CONTACT US</span>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  )
}
