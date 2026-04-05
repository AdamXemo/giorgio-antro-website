'use client'

/**
 * DEV-ONLY smoke test page — delete before launch.
 * Verifies: Shopify Storefront API connectivity, product fetching, cart state.
 * Visit: http://localhost:3000/test-shopify
 */

import { useState, useEffect } from 'react'
import { getAllProducts } from '@/lib/shopify/storefront'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { useCart } from '@/hooks/useCart'

export default function TestShopifyPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const { cart, itemCount, addToCart } = useCart()

  useEffect(() => {
    setStatus('loading')
    getAllProducts()
      .then((data) => {
        console.log('[test-shopify] products:', data)
        setProducts(data)
        setStatus('success')
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err)
        console.error('[test-shopify] error:', err)
        setError(message)
        setStatus('error')
      })
  }, [])

  return (
    <div className="pt-[73px] min-h-screen px-8 py-12 max-w-3xl mx-auto font-sans">
      <div className="mb-6 px-4 py-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs tracking-wide rounded">
        DEV ONLY — delete <code className="font-mono">app/test-shopify/</code> before going live.
      </div>

      <h1 className="text-2xl font-light mb-2">Shopify Smoke Test</h1>
      <p className="text-sm text-black/50 mb-10">
        Cart items: <strong>{itemCount}</strong>
      </p>

      {/* ── Status ── */}
      {status === 'loading' && (
        <p className="text-sm text-black/40">Fetching products from Shopify…</p>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {status === 'success' && products.length === 0 && (
        <p className="text-sm text-black/40">
          Connected successfully, but no products found in your Shopify store.
        </p>
      )}

      {/* ── Product list ── */}
      {status === 'success' && products.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs tracking-widest text-black/40 uppercase">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
          {products.map((product) => {
            const price = product.priceRange.minVariantPrice
            const firstVariant = product.variants[0]

            return (
              <div
                key={product.id}
                className="flex items-center justify-between border border-black/10 px-5 py-4"
              >
                <div>
                  <p className="text-sm font-medium">{product.title}</p>
                  <p className="text-xs text-black/40 mt-1">
                    {price.amount} {price.currencyCode} —{' '}
                    {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <button
                  onClick={() => {
                    addToCart({
                      id: product.handle,
                      name: product.title,
                      price: parseFloat(price.amount),
                      size: firstVariant?.selectedOptions.find(
                        (o) => o.name.toLowerCase() === 'size'
                      )?.value ?? 'ONE SIZE',
                      quantity: 1,
                      image: product.images[0]?.url ?? '',
                      variantId: firstVariant?.id,
                    })
                  }}
                  className="text-[10px] tracking-widest border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                >
                  ADD TO CART
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Cart state dump ── */}
      {cart.length > 0 && (
        <div className="mt-12">
          <p className="text-xs tracking-widest text-black/40 uppercase mb-3">
            Current cart state
          </p>
          <pre className="bg-black/[0.03] border border-black/10 rounded p-4 text-xs overflow-x-auto">
            {JSON.stringify(cart, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
