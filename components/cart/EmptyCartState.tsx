import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default function EmptyCartState() {
  return (
    <div className="min-h-screen pt-[73px] flex items-center justify-center px-6">
      <div className="text-center">
        <ShoppingBag size={36} strokeWidth={1} className="mx-auto mb-8 text-black/15" />
        <p className="text-[10px] tracking-[0.3em] text-black/35 mb-5">YOUR BAG</p>
        <h1 className="font-display font-light text-3xl mb-10">Nothing here yet.</h1>
        <Link href="/" className="btn-primary">
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  )
}
