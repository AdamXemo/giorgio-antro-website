'use client'

import { useCart } from '@/components/cart/CartContext'
import EmptyCartState from '@/components/cart/EmptyCartState'
import CartItem from '@/components/cart/CartItem'
import OrderSummary from '@/components/cart/OrderSummary'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart()

  if (cart.length === 0) {
    return <EmptyCartState />
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

          {/* ── Cart Items ── */}
          <div className="lg:col-span-2">
            <div className="border-t border-black/10">
              {cart.map((item, idx) => (
                <CartItem
                  key={`${item.id}-${item.size}`}
                  item={item}
                  index={idx}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
          </div>

        </div>
      </div>
    </div>
  )
}
