'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import type { Product } from '@/data/products'
import { useMobileBottomSheet } from '@/hooks/useMobileBottomSheet'
import ProductDetailsContent from './ProductDetailsContent'

interface MobileBottomSheetProps {
  product: Product
  addedToCart: boolean
  onAddToCart: () => void
}

export default function MobileBottomSheet({ product, addedToCart, onAddToCart }: MobileBottomSheetProps) {
  const { sheetRef, isExpanded, translateY, isDragging, toggle, dragHandlers } = useMobileBottomSheet()
  const [expandedSection, setExpandedSection] = useState<'details' | 'shipping' | null>(null)

  const displayColor = 'BLACK'
  const selectedSize = product.sizes[0] ?? 'ONE SIZE'

  const toggleSection = (section: 'details' | 'shipping') =>
    setExpandedSection(p => (p === section ? null : section))

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 z-20 h-[82dvh] flex flex-col bg-white dark:bg-[#111] rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.4)]"
      style={{
        transform: `translateY(${translateY}px)`,
        transition: isDragging ? 'none' : 'transform 350ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      {/* Drag handle — tap or drag to expand/collapse */}
      <div
        className="flex-none flex justify-center pt-3 pb-3 cursor-grab active:cursor-grabbing touch-none"
        onClick={toggle}
        {...dragHandlers}
      >
        <div className="w-10 h-[3px] rounded-full bg-black/[0.12] dark:bg-white/[0.12]" />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pb-10">

        {/* ── Always visible in collapsed state ── */}
        <h1 className="font-display font-light text-xl leading-tight tracking-tight">
          {product.name}
        </h1>
        <p className="text-sm font-light tabular-nums mt-1 text-black/60 dark:text-white/60">
          €{product.price.toFixed(2)}
        </p>

        <div className="mt-4">
          <button
            onClick={onAddToCart}
            disabled={!product.inStock || addedToCart}
            className={[
              'w-full tracking-[0.28em]',
              addedToCart ? 'animate-btn-confirm' : '',
              !product.inStock
                ? 'py-4 flex items-center justify-center text-[10px] bg-black/10 text-black/25 dark:bg-white/10 dark:text-white/25 cursor-not-allowed'
                : 'btn-primary !px-0',
            ].join(' ')}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {addedToCart ? (
                <>
                  <Check size={13} strokeWidth={2} />
                  ADDED TO CART
                </>
              ) : product.inStock ? (
                `ADD TO CART — €${product.price.toFixed(2)}`
              ) : (
                'OUT OF STOCK'
              )}
            </span>
          </button>
        </div>

        {/* ── Expanded content — naturally below the collapsed fold ── */}
        <div className="mt-7 pt-6 border-t border-black/[0.07] dark:border-white/[0.07]">

          {/* Color */}
          <div>
            <p className="text-[10px] tracking-[0.15em] mb-2.5">
              <span className="text-black/40 dark:text-white/40">COLOR</span>
              <span className="ml-3 tracking-[0.1em]">{displayColor}</span>
            </p>
            <button
              aria-label="Black (selected)"
              aria-pressed="true"
              className="w-6 h-6 rounded-full bg-black dark:bg-white ring-1 ring-offset-2 ring-black dark:ring-white"
            />
          </div>

          {/* Size */}
          <div className="mt-5 flex items-center justify-between">
            <span className="text-[10px] tracking-[0.2em]">{selectedSize}</span>
            <button className="underline-reveal text-[10px] tracking-[0.15em] text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors duration-200">
              SIZE GUIDE
            </button>
          </div>

          {/* Accordion sections */}
          <div className="mt-6 border-t border-black/[0.07] dark:border-white/[0.07]">

            <div className="border-b border-black/[0.07] dark:border-white/[0.07]">
              <button
                onClick={() => toggleSection('details')}
                className="w-full text-left py-4 text-[11px] tracking-[0.1em] text-black/65 dark:text-white/65 hover:text-black dark:hover:text-white transition-colors duration-200 flex items-center justify-between"
              >
                <span className="underline-reveal">Product details</span>
                <span className="text-black/30 dark:text-white/30 text-base leading-none">
                  {expandedSection === 'details' ? '−' : '+'}
                </span>
              </button>
              {expandedSection === 'details' && (
                <ProductDetailsContent type="details" product={product} variant="mobile" />
              )}
            </div>

            <div className="border-b border-black/[0.07] dark:border-white/[0.07]">
              <button
                onClick={() => toggleSection('shipping')}
                className="w-full text-left py-4 text-[11px] tracking-[0.1em] text-black/65 dark:text-white/65 hover:text-black dark:hover:text-white transition-colors duration-200 flex items-center justify-between"
              >
                <span className="underline-reveal">Free shipping and returns</span>
                <span className="text-black/30 dark:text-white/30 text-base leading-none">
                  {expandedSection === 'shipping' ? '−' : '+'}
                </span>
              </button>
              {expandedSection === 'shipping' && (
                <ProductDetailsContent type="shipping" product={product} variant="mobile" />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
