'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/components/cart/CartContext'
import type { Product } from '@/data/products'
import Image from 'next/image'
import ProductImageSlider from '@/components/product/ProductImageSlider'

type DrawerType = 'details' | 'shipping'

// ── Sub-component: shared product info panel ──────────────────────────

interface ProductInfoProps {
  product: Product
  addedToCart: boolean
  onAddToCart: () => void
  onOpenDrawer?: (type: DrawerType) => void
}

function ProductInfo({ product, addedToCart, onAddToCart, onOpenDrawer }: ProductInfoProps) {
  const [mobileExpanded, setMobileExpanded] = useState<DrawerType | null>(null)

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
          <span className="ml-3 tracking-[0.1em]">BLACK</span>
        </p>
        {/* Round black swatch — selected */}
        <button
          aria-label="Black (selected)"
          aria-pressed="true"
          className="w-7 h-7 rounded-full bg-black dark:bg-white ring-1 ring-offset-2 ring-black dark:ring-white"
        />
      </div>

      {/* Size row: ONE SIZE + SIZE GUIDE */}
      <div className="animate-reveal-up" style={{ animationDelay: '0.22s' }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.2em]">ONE SIZE</span>
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

      {/* Text link buttons */}
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
            <div className="pb-6">
              <p className="font-body text-sm text-black/55 dark:text-white/55 leading-loose mb-5">
                {product.description}
              </p>
              {product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-5 py-3 border-b border-black/[0.05] dark:border-white/[0.05] last:border-0"
                >
                  <span className="text-[10px] text-black/25 dark:text-white/25 tabular-nums w-5 flex-shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-black/65 dark:text-white/65">{feature}</span>
                </div>
              ))}
            </div>
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
            <div className="pb-6 space-y-4 text-sm text-black/55 dark:text-white/55 leading-loose">
              <p>{product.shippingInfo}</p>
              <p>We accept returns within 14 days of delivery. Items must be unworn and in original condition.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// ── Main page component ───────────────────────────────────────────────

export default function ProductClient({ product }: { product: Product }) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeDrawer, setActiveDrawer] = useState<DrawerType | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveDrawer(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: 'ONE SIZE',
      quantity: 1,
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
    <div className="pt-[69px]">

      {/* ── Desktop: 50/50 split-screen ─────────────────────────────── */}
      <div className="hidden lg:flex">

        {/* Left: stacked images, each capped to viewport height */}
        <div className="w-1/2">
          {product.images.map((image, index) => (
            <div
              key={index}
              className="relative w-full h-[calc(100vh-69px)] studio-bg"
            >
              <Image
                src={image}
                alt={`${product.name} — view ${index + 1}`}
                fill
                sizes="50vw"
                className="object-contain object-center"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Right: sticky product info */}
        <div className="w-1/2 relative border-l border-black/[0.06] dark:border-white/[0.06]">
          <div className="sticky top-[69px] h-[calc(100vh-69px)] overflow-y-auto">
            <div className="min-h-full flex items-center py-16">
              <div className="px-16 xl:px-24 w-full">
                <ProductInfo
                  product={product}
                  addedToCart={addedToCart}
                  onAddToCart={handleAddToCart}
                  onOpenDrawer={setActiveDrawer}
                />
              </div>
            </div>
          </div>

          {/* Slide-in drawer — covers the right panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-hidden={activeDrawer === null}
            aria-label={
              activeDrawer === 'details'
                ? 'Product Details'
                : activeDrawer === 'shipping'
                  ? 'Shipping and Returns'
                  : undefined
            }
            className={[
              'fixed top-[69px] right-0 w-1/2 h-[calc(100vh-69px)]',
              'bg-[var(--background)] border-l border-black/[0.08] dark:border-white/[0.08]',
              'z-40 overflow-y-auto',
              'transition-transform duration-500',
              activeDrawer ? 'translate-x-0' : 'translate-x-full',
            ].join(' ')}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div className="px-12 xl:px-16 py-12">

              <button
                onClick={() => setActiveDrawer(null)}
                aria-label="Close"
                className="flex items-center gap-3 mb-14 text-[9px] tracking-[0.2em] text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                <X size={14} strokeWidth={1.5} />
                CLOSE
              </button>

              {activeDrawer === 'details' && (
                <>
                  <p className="text-[10px] tracking-[0.25em] mb-8">PRODUCT DETAILS</p>
                  <p className="font-body text-sm text-black/55 dark:text-white/55 leading-loose mb-10">
                    {product.description}
                  </p>
                  <div className="border-t border-black/[0.07] dark:border-white/[0.07]">
                    {product.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-5 py-3.5 border-b border-black/[0.07] dark:border-white/[0.07]"
                      >
                        <span className="text-[10px] text-black/25 dark:text-white/25 tabular-nums w-5 flex-shrink-0">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm text-black/65 dark:text-white/65">{feature}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeDrawer === 'shipping' && (
                <>
                  <p className="text-[10px] tracking-[0.25em] mb-8">SHIPPING AND RETURNS</p>
                  <p className="text-sm text-black/55 dark:text-white/55 leading-loose mb-10">
                    {product.shippingInfo}
                  </p>
                  <div className="pt-8 border-t border-black/[0.07] dark:border-white/[0.07]">
                    <p className="text-[10px] tracking-[0.25em] mb-5">RETURNS</p>
                    <p className="text-sm text-black/55 dark:text-white/55 leading-loose">
                      We accept returns within 14 days of delivery. Items must be unworn, in original packaging, and accompanied by proof of purchase. Contact us to initiate your return.
                    </p>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: single column ───────────────────────────────────── */}
      <div className="lg:hidden px-6 pt-8 pb-24">
        <ProductImageSlider images={product.images} productName={product.name} />
        <div className="mt-10">
          <ProductInfo
            product={product}
            addedToCart={addedToCart}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

    </div>
  )
}
