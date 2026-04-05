import { products } from '@/data/products'
import ProductGrid from '@/components/ProductGrid'

export const metadata = {
  title: 'Shop — ANTRO',
  description: 'Browse all ANTRO products.',
}

export default function ProductsPage() {
  return (
    <div className="pt-[73px]">
      <div className="pt-16 pb-24 md:pb-36 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">

          <div className="mb-14">
            <p className="text-[10px] tracking-[0.3em] text-black/35 mb-4">COLLECTION</p>
            <h1 className="font-display font-light text-4xl md:text-5xl">All Products</h1>
          </div>

          <ProductGrid products={products} />

        </div>
      </div>
    </div>
  )
}
