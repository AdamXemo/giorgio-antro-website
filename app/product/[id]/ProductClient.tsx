'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/components/CartContext'
import type { Product } from '@/data/products'
import ProductImageSlider from '@/components/product/ProductImageSlider'
import QuantitySelector from '@/components/ui/QuantitySelector'
import TrustIndicators from '@/components/product/TrustIndicators'
import FeaturesList from '@/components/product/FeaturesList'

export default function ProductClient({ product }: { product: Product }) {
  const router = useRouter()
  const { addToCart } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const decrement = useCallback(() => setQuantity(q => Math.max(1, q - 1)), [])
  const increment = useCallback(() => setQuantity(q => q + 1), [])

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: 'ONE SIZE',
      quantity,
      image: product.images[0],
    })

    setAddedToCart(true)
    toast.success(`${product.name} added to cart`)
    setTimeout(() => {
      setAddedToCart(false)
      router.push('/cart')
    }, 1500)
  }

  return (
    <div className="pt-[73px]">
      <div className="pt-8 pb-24 md:pb-36 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* ── Left: Image Slider ── */}
            <ProductImageSlider images={product.images} productName={product.name} />

            {/* ── Right: Product Info ── */}
            <div className="lg:sticky lg:top-28 space-y-10">

              {/* Name & Price */}
              <div>
                <h1 className="font-display font-light text-4xl md:text-5xl leading-tight mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl font-light tabular-nums">€{product.price.toFixed(2)}</p>
              </div>

              {/* Description */}
              <p className="font-body text-sm leading-loose text-black/55 dark:text-white/55">
                {product.description}
              </p>

              {/* Size */}
              <p className="text-[10px] tracking-[0.25em] text-black/40 dark:text-white/40">
                ONE SIZE — FITS ALL
              </p>

              {/* Quantity */}
              <div>
                <p className="text-[10px] tracking-[0.25em] mb-4">QUANTITY</p>
                <QuantitySelector
                  value={quantity}
                  onDecrement={decrement}
                  onIncrement={increment}
                />
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || addedToCart}
                className={`w-full py-4 text-[10px] tracking-[0.28em] flex items-center justify-center gap-3 border transition-colors duration-300 ${
                  !product.inStock
                    ? 'border-black/15 text-black/25 dark:border-white/15 dark:text-white/25 cursor-not-allowed'
                    : addedToCart
                      ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                      : 'bg-black text-white border-black hover:bg-white hover:text-black dark:bg-white dark:text-black dark:border-white dark:hover:bg-transparent dark:hover:text-white'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check size={13} strokeWidth={2} />
                    ADDED TO CART
                  </>
                ) : (
                  product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'
                )}
              </button>

              <TrustIndicators />

              {/* Details */}
              <div>
                <p className="text-[10px] tracking-[0.25em] mb-4">DETAILS</p>
                <FeaturesList features={product.features} />
              </div>

              {/* Shipping */}
              <div>
                <p className="text-[10px] tracking-[0.25em] mb-3">SHIPPING</p>
                <p className="text-sm text-black/55 dark:text-white/55 leading-relaxed">
                  {product.shippingInfo}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
