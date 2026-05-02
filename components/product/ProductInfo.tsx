'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import type { Product } from '@/data/products'
import ProductDetailsContent from './ProductDetailsContent'

export type DrawerType = 'details' | 'shipping'

interface ProductInfoProps {
  product: Product
  addedToCart: boolean
  onAddToCart: () => void
  onOpenDrawer?: (type: DrawerType) => void
}

export default function ProductInfo({ product, addedToCart, onAddToCart, onOpenDrawer }: ProductInfoProps) {
  const [mobileExpanded, setMobileExpanded] = useState<DrawerType | null>(null)

  // TODO: add color support to Product type; defaulting to BLACK until then
  const displayColor = 'BLACK'
  const selectedSize = product.sizes[0] ?? 'ONE SIZE'

  const handleAction = (type: DrawerType) => {
    if (onOpenDrawer) {
      onOpenDrawer(type)
    } else {
      setMobileExpanded(p => (p === type ? null : type))
    }
  }

  return (
    <div className="space-y-7">

      {/* Name + Price */}
      <div className="animate-reveal-up" style={{ animationDelay: '0.05s' }}>
        <h1 className="font-display font-light text-3xl xl:text-4xl leading-tight">
          {product.name}
        </h1>
        <p className="text-xl font-light tabular-nums mt-3">
          €{product.price.toFixed(2)}
        </p>
      </div>

      {/* Color swatch */}
      <div className="animate-reveal-up" style={{ animationDelay: '0.14s' }}>
        <p className="text-[10px] tracking-[0.15em] mb-3">
          <span className="text-black/40 dark:text-white/40">COLOR</span>
          {/* TODO: add color support to Product type */}
          <span className="ml-3 tracking-[0.1em]">{displayColor}</span>
        </p>
        <button
          aria-label="Black (selected)"
          aria-pressed="true"
          className="w-7 h-7 rounded-full bg-black dark:bg-white ring-1 ring-offset-2 ring-black dark:ring-white"
        />
      </div>

      {/* Size row: dynamic from product.sizes */}
      <div className="animate-reveal-up" style={{ animationDelay: '0.22s' }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.2em]">{selectedSize}</span>
          <button className="underline-reveal text-[10px] tracking-[0.15em] text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors duration-200">
            SIZE GUIDE
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="animate-reveal-up" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={onAddToCart}
          disabled={!product.inStock || addedToCart}
          className={[
            'w-full py-4 text-[10px] tracking-[0.28em] flex items-center justify-center gap-3 transition-colors duration-300',
            addedToCart ? 'animate-btn-confirm' : '',
            !product.inStock
              ? 'bg-black/10 text-black/25 dark:bg-white/10 dark:text-white/25 cursor-not-allowed'
              : 'bg-black text-white dark:bg-white dark:text-black',
          ].join(' ')}
        >
          {addedToCart ? (
            <>
              <Check size={13} strokeWidth={2} />
              ADDED TO CART
            </>
          ) : (
            product.inStock ? `ADD TO CART — €${product.price.toFixed(2)}` : 'OUT OF STOCK'
          )}
        </button>
      </div>

      {/* Accordion links — open drawer on desktop, expand inline on mobile */}
      <div className="animate-reveal-up" style={{ animationDelay: '0.38s' }}>

        {/* Product Details */}
        <div className="border-b border-black/[0.07] dark:border-white/[0.07]">
          <button
            onClick={() => handleAction('details')}
            className="w-full text-left py-4 text-[11px] tracking-[0.1em] text-black/65 dark:text-white/65 hover:text-black dark:hover:text-white transition-colors duration-200 flex items-center justify-between"
          >
            <span className="underline-reveal">Product details</span>
            {!onOpenDrawer && (
              <span className="text-black/30 dark:text-white/30 text-base leading-none">
                {mobileExpanded === 'details' ? '−' : '+'}
              </span>
            )}
          </button>
          {!onOpenDrawer && mobileExpanded === 'details' && (
            <ProductDetailsContent type="details" product={product} variant="mobile" />
          )}
        </div>

        {/* Shipping and Returns */}
        <div className="border-b border-black/[0.07] dark:border-white/[0.07]">
          <button
            onClick={() => handleAction('shipping')}
            className="w-full text-left py-4 text-[11px] tracking-[0.1em] text-black/65 dark:text-white/65 hover:text-black dark:hover:text-white transition-colors duration-200 flex items-center justify-between"
          >
            <span className="underline-reveal">Free shipping and returns</span>
            {!onOpenDrawer && (
              <span className="text-black/30 dark:text-white/30 text-base leading-none">
                {mobileExpanded === 'shipping' ? '−' : '+'}
              </span>
            )}
          </button>
          {!onOpenDrawer && mobileExpanded === 'shipping' && (
            <ProductDetailsContent type="shipping" product={product} variant="mobile" />
          )}
        </div>

      </div>
    </div>
  )
}
