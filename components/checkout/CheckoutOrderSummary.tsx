'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import type { CartItem } from '@/types/cart'

interface Props {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
}

function ItemList({ items }: { items: CartItem[] }) {
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div key={`${item.id}-${item.size}`} className="flex gap-4">
          <div className="relative w-[60px] h-[75px] flex-shrink-0 bg-[#f0f0f0] dark:bg-[#1c1c1c] overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="60px"
            />
            {item.quantity > 1 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black text-[9px] flex items-center justify-center font-medium tabular-nums">
                {item.quantity}
              </span>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
            <div>
              <p className="text-sm text-black dark:text-white leading-tight truncate">{item.name}</p>
              <p className="text-[11px] text-black/40 dark:text-white/40 mt-0.5 tracking-wide uppercase">
                {item.size}
              </p>
            </div>
            <p className="text-sm text-black dark:text-white tabular-nums">
              €{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function Totals({
  subtotal,
  shipping,
  total,
}: {
  subtotal: number
  shipping: number
  total: number
}) {
  return (
    <>
      <div className="space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-black/45 dark:text-white/45">Subtotal</span>
          <span className="tabular-nums">€{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-black/45 dark:text-white/45">Shipping</span>
          <span className="tabular-nums">
            {shipping === 0 ? (
              <span className="text-black/35 dark:text-white/35">Free</span>
            ) : (
              `€${shipping.toFixed(2)}`
            )}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-black/8 dark:border-white/8 flex justify-between items-center">
        <span className="text-[10px] tracking-[0.25em] uppercase">Total</span>
        <span className="text-sm tabular-nums font-medium">€{total.toFixed(2)}</span>
      </div>

      {shipping > 0 && (
        <p className="mt-4 text-[10px] text-black/30 dark:text-white/30 leading-relaxed">
          Add €{(100 - subtotal).toFixed(2)} more for free shipping
        </p>
      )}
    </>
  )
}

export function CheckoutOrderSummary({ items, subtotal, shipping, total }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile collapsible strip */}
      <div className="lg:hidden border-b border-black/8 dark:border-white/8">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="w-full px-6 py-4 flex items-center justify-between"
        >
          <span className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-black dark:text-white">
            <span>Order summary</span>
            <ChevronDown
              size={12}
              strokeWidth={1.5}
              className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </span>
          <span className="text-sm tabular-nums">€{total.toFixed(2)}</span>
        </button>

        {isOpen && (
          <div className="px-6 pb-6 space-y-5 border-t border-black/6 dark:border-white/6 pt-5">
            <ItemList items={items} />
            <div className="pt-4 border-t border-black/8 dark:border-white/8">
              <Totals subtotal={subtotal} shipping={shipping} total={total} />
            </div>
          </div>
        )}
      </div>

      {/* Desktop summary panel */}
      <div className="hidden lg:block">
        <p className="text-[10px] tracking-[0.3em] uppercase text-black/35 dark:text-white/35 mb-7">
          Order Summary
        </p>

        <ItemList items={items} />

        <div className="mt-6 pt-6 border-t border-black/8 dark:border-white/8">
          <Totals subtotal={subtotal} shipping={shipping} total={total} />
        </div>
      </div>
    </>
  )
}
