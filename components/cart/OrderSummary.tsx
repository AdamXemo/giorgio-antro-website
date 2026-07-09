import Link from 'next/link'
import { Lock } from 'lucide-react'

// Hoisted outside component — static content
const TRUST_NOTES = [
  'Secure checkout via Stripe',
  'Free returns within 30 days',
  'Free shipping over €100',
]

interface OrderSummaryProps {
  subtotal: number
  shipping: number
  total: number
}

export default function OrderSummary({ subtotal, shipping, total }: OrderSummaryProps) {
  return (
    <div className="border-t border-black dark:border-white/20 pt-8 lg:sticky lg:top-24">
      <p className="text-[10px] tracking-[0.3em] mb-8">ORDER SUMMARY</p>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-black/45 dark:text-white/45">Subtotal</span>
          <span className="tabular-nums">€{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-black/45 dark:text-white/45">Shipping</span>
          <span className="tabular-nums font-medium">
            {shipping === 0 ? 'FREE' : `€${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="border-t border-black/10 dark:border-white/10 pt-5 flex justify-between items-baseline">
          <span className="text-[13px] tracking-wide font-medium">Total</span>
          <span className="text-base tabular-nums font-medium">€{total.toFixed(2)}</span>
        </div>
      </div>

      {subtotal < 100 && (
        <p className="text-[10px] tracking-[0.08em] text-black/35 dark:text-white/35 mb-8 leading-loose">
          Add €{(100 - subtotal).toFixed(2)} more for free shipping.
        </p>
      )}

      <Link
        href="/checkout"
        className="w-full bg-black text-white py-4 text-[10px] tracking-[0.3em] font-light flex items-center justify-center gap-3 border border-black hover:bg-white hover:text-black dark:bg-white dark:text-black dark:border-white dark:hover:bg-transparent dark:hover:text-white transition-colors duration-300 mb-4"
      >
        <Lock size={11} strokeWidth={1.5} />
        PROCEED TO CHECKOUT
      </Link>

      <Link
        href="/"
        className="block text-center text-[10px] tracking-[0.15em] text-black/35 dark:text-white/35 hover:text-black dark:hover:text-white transition-colors"
      >
        CONTINUE SHOPPING
      </Link>

      <div className="mt-10 pt-8 border-t border-black/10 dark:border-white/10 space-y-3">
        {TRUST_NOTES.map(text => (
          <p key={text} className="text-[10px] tracking-[0.08em] text-black/30 dark:text-white/30">
            — {text}
          </p>
        ))}
      </div>
    </div>
  )
}
