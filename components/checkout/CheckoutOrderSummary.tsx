'use client'

import Image from 'next/image'
import type { CartItem } from '@/types/cart'

interface Props {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
}

export function ItemList({ items }: { items: CartItem[] }) {
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div key={`${item.id}-${item.size}`} className="flex gap-4">
          <div className="relative w-[60px] h-[75px] flex-shrink-0 bg-[#f0f0f0] overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="60px"
            />
          </div>
          <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
            <div>
              <p className="text-sm text-black leading-tight truncate">{item.name}</p>
              <p className="text-[11px] text-black/40 mt-0.5 tracking-wide uppercase">
                {item.size}
              </p>
            </div>
            <p className="text-sm text-black tabular-nums">
              {item.quantity > 1
                ? `${item.quantity} × €${item.price.toFixed(2)}`
                : `€${item.price.toFixed(2)}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Totals({
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
          <span className="text-black/45">Subtotal</span>
          <span className="tabular-nums">€{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-black/45">Shipping</span>
          <span className="tabular-nums">
            {shipping === 0 ? (
              <span className="text-black/35">Free</span>
            ) : (
              `€${shipping.toFixed(2)}`
            )}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-black/8 flex justify-between items-center">
        <span className="text-[10px] tracking-[0.25em] uppercase">Total</span>
        <span className="text-sm tabular-nums font-medium">€{total.toFixed(2)}</span>
      </div>

      {shipping > 0 && (
        <p className="mt-4 text-[10px] text-black/30 leading-relaxed">
          Add €{(100 - subtotal).toFixed(2)} more for free shipping
        </p>
      )}
    </>
  )
}

export function CheckoutOrderSummary({ items, subtotal, shipping, total }: Props) {
  return (
    <div className="hidden lg:block">
      <p className="text-[10px] tracking-[0.3em] uppercase text-black/35 mb-7">
        Order Summary
      </p>

      <ItemList items={items} />

      <div className="mt-6 pt-6 border-t border-black/8">
        <Totals subtotal={subtotal} shipping={shipping} total={total} />
      </div>
    </div>
  )
}
