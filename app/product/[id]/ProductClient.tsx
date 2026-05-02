'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCart } from '@/components/cart/CartContext'
import type { Product } from '@/data/products'
import Image from 'next/image'
import ProductImageSlider from '@/components/product/ProductImageSlider'
import ProductInfo, { type DrawerType } from '@/components/product/ProductInfo'
import SideDrawer from '@/components/ui/SideDrawer'
import ProductDetailsContent from '@/components/product/ProductDetailsContent'

const DRAWER_TITLES: Record<DrawerType, string> = {
  details: 'PRODUCT DETAILS',
  shipping: 'SHIPPING AND RETURNS',
}

export default function ProductClient({ product }: { product: Product }) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeDrawer, setActiveDrawer] = useState<DrawerType | null>(null)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes[0] ?? 'ONE SIZE',
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

        {/* Right: sticky product info + slide-in drawer */}
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
