import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/data/products'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.id}`}
          className="group"
        >
          <div className="relative aspect-[3/4] mb-5 overflow-hidden bg-[#f0f0f0]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="text-[10px] tracking-[0.3em]">SOLD OUT</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium group-hover:opacity-40 transition-opacity">
              {product.name}
            </h3>
            <p className="text-sm text-black/45 mt-1 tabular-nums">${product.price.toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
