'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, Mail } from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'

export default function OrderSuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear the cart whenever a completed session lands here
    clearCart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="pt-[73px]">
      <div className="max-w-sm mx-auto px-6 pt-12 pb-24 text-center">

        {/* Check icon */}
        <div className="flex items-center justify-center mb-10 animate-reveal-fade">
          <div className="w-12 h-12 rounded-full border border-black/12 dark:border-white/12 flex items-center justify-center">
            <CheckCircle size={18} strokeWidth={1} className="text-black/40 dark:text-white/40" />
          </div>
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
