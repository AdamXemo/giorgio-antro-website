import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/data/products'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="relative aspect-[3/4] mb-5 overflow-hidden bg-[#f0f0f0] dark:bg-[#1c1c1c]">
        <Image
          src={product.mobileImages[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
          className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />

        {/* Hover reveal bar — slides up from bottom */}
        {product.inStock && (
          <div className="absolute inset-x-0 bottom-0 h-11 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-black dark:bg-white flex items-center justify-center"
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <span className="text-[9px] tracking-[0.35em] text-white dark:text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
              VIEW DETAILS
            </span>
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 dark:bg-black/70 flex items-center justify-center">
            <span className="text-[10px] tracking-[0.3em]">SOLD OUT</span>
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium">
          {product.name}
        </h3>
        <p className="text-sm text-black/45 dark:text-white/45 tabular-nums shrink-0 ml-4">
          €{product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  )
}
