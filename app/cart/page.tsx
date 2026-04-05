'use client'

import { useCart } from '@/components/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, Lock } from 'lucide-react'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-[73px] flex items-center justify-center px-6">
        <div className="text-center">
          <ShoppingBag size={36} strokeWidth={1} className="mx-auto mb-8 text-black/15" />
          <p className="text-[10px] tracking-[0.3em] text-black/35 mb-5">YOUR BAG</p>
          <h1 className="font-display font-light text-3xl mb-10">Nothing here yet.</h1>
          <Link href="/" className="btn-primary">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = cartTotal
  const shipping = subtotal >= 100 ? 0 : 10
  const total = subtotal + shipping

  return (
    <div className="min-h-screen pt-[73px]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-16">
        <p className="text-[10px] tracking-[0.3em] text-black/35 mb-3">YOUR BAG</p>
        <h1 className="font-display font-light text-4xl md:text-5xl mb-16">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* ── Cart Items ───────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="border-t border-black/10">
              {cart.map((item, idx) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-6 py-8 border-b border-black/10 animate-fade-in"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-[#f2f2f2] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium truncate">{item.name}</h3>
                        <p className="text-[10px] tracking-[0.15em] text-black/35 mt-1.5">
                          SIZE {item.size}
                        </p>
                      </div>
                      <p className="text-sm font-light tabular-nums flex-shrink-0">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 border border-black/20 hover:border-black text-sm transition-colors"
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 border border-black/20 hover:border-black text-sm transition-colors"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.15em] text-black/30 hover:text-black transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={11} strokeWidth={1.5} />
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Order Summary ────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="border-t border-black pt-8 lg:sticky lg:top-24">
              <p className="text-[10px] tracking-[0.3em] mb-8">ORDER SUMMARY</p>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-black/45">Subtotal</span>
                  <span className="tabular-nums">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black/45">Shipping</span>
                  <span className="tabular-nums font-medium">
                    {shipping === 0 ? 'FREE' : `€${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-black/10 pt-4 flex justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-sm tabular-nums font-medium">€{total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 100 && (
                <p className="text-[10px] tracking-[0.08em] text-black/35 mb-8 leading-loose">
                  Add €{(100 - subtotal).toFixed(2)} more for free shipping.
                </p>
              )}

              <Link
                href="/checkout"
                className="w-full bg-black text-white py-4 text-[10px] tracking-[0.25em] flex items-center justify-center gap-3 border border-black hover:bg-white hover:text-black transition-colors duration-300 mb-4"
              >
                <Lock size={11} strokeWidth={1.5} />
                PROCEED TO CHECKOUT
              </Link>

              <Link
                href="/"
                className="block text-center text-[10px] tracking-[0.15em] text-black/35 hover:text-black transition-colors"
              >
                CONTINUE SHOPPING
              </Link>

              <div className="mt-10 pt-8 border-t border-black/10 space-y-3">
                {[
                  'Secure checkout via Stripe',
                  'Free returns within 30 days',
                  'Free shipping over €100',
                ].map((text) => (
                  <p key={text} className="text-[10px] tracking-[0.08em] text-black/30">
                    — {text}
                  </p>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
