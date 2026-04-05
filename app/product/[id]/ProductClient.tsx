'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check, Truck, Shield, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/components/CartContext'
import type { Product } from '@/data/products'

export default function ProductClient({ product }: { product: Product }) {
  const router = useRouter()
  const { addToCart } = useCart()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const total = product.images.length
  const prev = useCallback(() => setSelectedImage(i => (i - 1 + total) % total), [total])
  const next = useCallback(() => setSelectedImage(i => (i + 1) % total), [total])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
    setIsDragging(true)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    setDragOffset(e.touches[0].clientX - touchStart)
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const delta = touchStart - e.changedTouches[0].clientX
    if (Math.abs(delta) > 48) delta > 0 ? next() : prev()
    setTouchStart(null)
    setIsDragging(false)
    setDragOffset(0)
  }

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

            {/* ── Left: Image Slider ────────────────────────── */}
            <div>
              <div
                ref={containerRef}
                className="relative aspect-[3/4] overflow-hidden bg-white select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex h-full"
                  style={{
                    width: `${total * 100}%`,
                    transform: `translateX(calc(-${(selectedImage * 100) / total}% + ${isDragging ? dragOffset : 0}px))`,
                    transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                >
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-full flex-shrink-0"
                      style={{ width: `${100 / total}%` }}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} — view ${index + 1}`}
                        fill
                        className="object-contain object-center"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>

                {total > 1 && (
                  <>
                    <button
                      onClick={prev}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-black/40 hover:text-black hover:shadow-lg transition-all duration-200"
                    >
                      <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden>
                        <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-black/40 hover:text-black hover:shadow-lg transition-all duration-200"
                    >
                      <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden>
                        <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Pagination dots */}
              {total > 1 && (
                <div className="flex justify-center items-center gap-2.5 mt-5" role="tablist" aria-label="Image navigation">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      role="tab"
                      aria-selected={index === selectedImage}
                      aria-label={`Image ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      className={`rounded-full transition-all duration-300 ${
                        index === selectedImage
                          ? 'w-2 h-2 bg-black'
                          : 'w-[7px] h-[7px] bg-black/15 hover:bg-black/35'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Product Info ──────────────────────── */}
            <div className="lg:sticky lg:top-28 space-y-10">

              {/* Name & Price */}
              <div>
<h1 className="font-display font-light text-4xl md:text-5xl leading-tight mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl font-light tabular-nums">€{product.price.toFixed(2)}</p>
              </div>

              {/* Description */}
              <p className="text-sm leading-loose text-black/55">
                {product.description}
              </p>

              {/* Size */}
              <p className="text-[10px] tracking-[0.25em] text-black/40">ONE SIZE — FITS ALL</p>

              {/* Quantity */}
              <div>
                <p className="text-[10px] tracking-[0.25em] mb-4">QUANTITY</p>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 border border-black/20 hover:border-black text-base transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-14 text-center text-sm tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 border border-black/20 hover:border-black text-base transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || addedToCart}
                className={`w-full py-4 text-[10px] tracking-[0.28em] flex items-center justify-center gap-3 border transition-colors duration-300 ${
                  !product.inStock
                    ? 'border-black/15 text-black/25 cursor-not-allowed'
                    : addedToCart
                      ? 'bg-black text-white border-black'
                      : 'bg-black text-white border-black hover:bg-white hover:text-black'
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

              {/* Trust indicators */}
              <div className="flex items-center justify-between py-5 border-t border-b border-black/[0.08]">
                <div className="flex flex-col items-center gap-2">
                  <Truck size={16} strokeWidth={1.5} />
                  <p className="text-[9px] tracking-[0.15em] text-black/40">FREE SHIPPING</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Shield size={16} strokeWidth={1.5} />
                  <p className="text-[9px] tracking-[0.15em] text-black/40">SECURE CHECKOUT</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <RotateCcw size={16} strokeWidth={1.5} />
                  <p className="text-[9px] tracking-[0.15em] text-black/40">EASY RETURNS</p>
                </div>
              </div>

              {/* Details */}
              <div>
                <p className="text-[10px] tracking-[0.25em] mb-4">DETAILS</p>
                <div>
                  {product.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-5 py-3.5 border-b border-black/[0.07]"
                    >
                      <span className="text-[10px] text-black/25 tabular-nums w-5 flex-shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm text-black/65">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div>
                <p className="text-[10px] tracking-[0.25em] mb-3">SHIPPING</p>
                <p className="text-sm text-black/55 leading-relaxed">{product.shippingInfo}</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
