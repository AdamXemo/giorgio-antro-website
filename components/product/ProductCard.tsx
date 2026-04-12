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
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 dark:bg-black/70 flex items-center justify-center">
            <span className="text-[10px] tracking-[0.3em]">SOLD OUT</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium group-hover:opacity-40 transition-opacity">
          {product.name}
        </h3>
        <p className="text-sm text-black/45 dark:text-white/45 mt-1 tabular-nums">
          €{product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  )
}
