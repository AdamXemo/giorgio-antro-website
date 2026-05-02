import type { Product } from '@/data/products'

type DrawerType = 'details' | 'shipping'

interface ProductDetailsContentProps {
  type: DrawerType
  product: Pick<Product, 'description' | 'features' | 'shippingInfo'>
  variant: 'mobile' | 'drawer'
}

export default function ProductDetailsContent({ type, product, variant }: ProductDetailsContentProps) {
  if (type === 'details') {
    return variant === 'drawer' ? (
      <>
        <p className="font-body text-[13px] text-black/55 dark:text-white/55 leading-loose mb-10">
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
              <span className="text-[13px] text-black/65 dark:text-white/65">{feature}</span>
            </div>
          ))}
        </div>
      </>
    ) : (
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
    )
  }

  // type === 'shipping'
  return variant === 'drawer' ? (
    <>
      <p className="text-[13px] text-black/55 dark:text-white/55 leading-loose mb-10">
        {product.shippingInfo}
      </p>
      <div className="pt-8 border-t border-black/[0.07] dark:border-white/[0.07]">
        <p className="text-[9px] tracking-[0.25em] mb-5">RETURNS</p>
        <p className="text-[13px] text-black/55 dark:text-white/55 leading-loose">
          We accept returns within 14 days of delivery. Items must be unworn, in original packaging,
          and accompanied by proof of purchase. Contact us to initiate your return.
        </p>
      </div>
    </>
  ) : (
    <div className="pb-6 space-y-4 text-sm text-black/55 dark:text-white/55 leading-loose">
      <p>{product.shippingInfo}</p>
      <p>We accept returns within 14 days of delivery. Items must be unworn and in original condition.</p>
    </div>
  )
}
