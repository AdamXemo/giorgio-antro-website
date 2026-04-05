import Link from 'next/link'
import { CheckCircle, Package, Mail } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Confirmed — ANTRO',
  description: 'Your order has been confirmed.',
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen pt-[73px] flex items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full">

        <CheckCircle size={28} strokeWidth={1} className="mb-10" />

        <p className="text-[10px] tracking-[0.3em] text-black/35 mb-4">ORDER CONFIRMED</p>
        <h1 className="font-display font-light text-4xl md:text-5xl leading-tight mb-6">
          Thank you for<br />your purchase.
        </h1>
        <p className="text-sm text-black/45 leading-loose">
          Your ANTRO order has been received and is being prepared with care.
        </p>

        <div className="border-t border-black/10 mt-10 py-8 space-y-5">
          <div className="flex gap-4 text-sm text-black/55">
            <Mail size={15} strokeWidth={1.5} className="flex-shrink-0 mt-0.5 text-black/25" />
            <p>You will receive a confirmation email with your order details shortly.</p>
          </div>
          <div className="flex gap-4 text-sm text-black/55">
            <Package size={15} strokeWidth={1.5} className="flex-shrink-0 mt-0.5 text-black/25" />
            <p>Your order will be processed and shipped within 1–2 business days.</p>
          </div>
        </div>

        <div className="border-t border-black/10 py-10">
          <p className="text-[10px] tracking-[0.25em] text-black/35 mb-8">WHAT HAPPENS NEXT</p>
          <div className="space-y-0">
            {[
              { n: '01', label: 'Processing', body: "We'll prepare your order with care." },
              { n: '02', label: 'Shipping',   body: "You'll receive tracking information by email." },
              { n: '03', label: 'Delivery',   body: 'Your ANTRO piece arrives in 3–5 days.' },
            ].map(({ n, label, body }) => (
              <div key={n} className="flex gap-5 py-4 border-b border-black/[0.07]">
                <span className="text-[10px] text-black/22 tabular-nums flex-shrink-0 mt-0.5">{n}</span>
                <div>
                  <p className="text-sm font-medium mb-1">{label}</p>
                  <p className="text-xs text-black/45">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/" className="btn-primary flex-1 text-center">
            CONTINUE SHOPPING
          </Link>
          <Link href="/contact" className="btn-ghost flex-1 text-center">
            CONTACT US
          </Link>
        </div>

      </div>
    </div>
  )
}
