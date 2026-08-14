'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCart } from '@/components/cart/CartContext'
import type { Product } from '@/data/products'
import Image from 'next/image'
import ProductInfo, { type DrawerType } from '@/components/product/ProductInfo'
import SideDrawer from '@/components/ui/SideDrawer'
import ProductDetailsContent from '@/components/product/ProductDetailsContent'
import MobileProductHero from '@/components/product/MobileProductHero'
import MobileBottomSheet from '@/components/product/MobileBottomSheet'

const DRAWER_TITLES: Record<DrawerType, string> = {
  details: 'PRODUCT DETAILS',
  shipping: 'SHIPPING AND RETURNS',
}

export default function ProductClient({ product }: { product: Product }) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeDrawer, setActiveDrawer] = useState<DrawerType | null>(null)
  const [activeDesktopImage, setActiveDesktopImage] = useState(0)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const desktopImages = product.desktopImages ?? product.mobileImages

  useEffect(() => {
    if (desktopImages.length < 2) return
    const observers = imageRefs.current.map((el, index) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveDesktopImage(index) },
        { threshold: 0.5 },
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(obs => obs?.disconnect())
  }, [desktopImages.length])

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes[0] ?? 'ONE SIZE',
      quantity: 1,
      image: product.mobileImages[0],
    })
    setAddedToCart(true)
    toast.success(`${product.name} added to cart`)
    setTimeout(() => {
      setAddedToCart(false)
      router.push('/cart')
    }, 1500)
  }

  return (
    <div className="pt-[var(--header-height)]">

      {/* ── Desktop: 50/50 split-screen ─────────────────────────────── */}
      <div className="hidden lg:flex">

        {/* Left: stacked mobileImages, each capped to viewport height */}
        <div className="w-1/2">
          {desktopImages.map((image, index) => (
            <div
              key={index}
              ref={el => { imageRefs.current[index] = el }}
              className="relative w-full h-[calc(100vh_-_var(--header-height))] studio-bg"
            >
              <Image
                src={image}
                alt={`${product.name} — view ${index + 1}`}
                fill
                sizes="50vw"
                className="object-cover object-center"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Dot indicators — mirrors mobile, only shown when multiple mobileImages */}
          {desktopImages.length > 1 && (
            <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5">
              {desktopImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => imageRefs.current[index]?.scrollIntoView({ behavior: 'smooth' })}
                  aria-label={`View image ${index + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    index === activeDesktopImage
                      ? 'w-2 h-2 bg-black'
                      : 'w-1.5 h-1.5 bg-black/25'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: sticky product info + slide-in drawer */}
        <div className="w-1/2 relative border-l border-black/[0.06]">
          <div className="sticky top-[var(--header-height)] h-[calc(100vh_-_var(--header-height))] overflow-y-auto">
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

          <SideDrawer
            isOpen={activeDrawer !== null}
            onClose={() => setActiveDrawer(null)}
            title={activeDrawer ? DRAWER_TITLES[activeDrawer] : undefined}
          >
            {activeDrawer && (
              <ProductDetailsContent
                type={activeDrawer}
                product={product}
                variant="drawer"
              />
            )}
          </SideDrawer>
        </div>
      </div>

      {/* ── Mobile: full-bleed hero + floating bottom sheet ─────────── */}
      <div className="lg:hidden relative h-[calc(100dvh_-_var(--header-height))] overflow-hidden">
        <MobileProductHero mobileImages={product.mobileImages} productName={product.name} />
        <MobileBottomSheet
          product={product}
          addedToCart={addedToCart}
          onAddToCart={handleAddToCart}
        />
      </div>

    </div>
  )
}
