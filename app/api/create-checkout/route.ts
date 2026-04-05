import { NextRequest, NextResponse } from 'next/server'
import { getProductById } from '@/data/products'
import { getProductVariants, createShopifyCart } from '@/lib/shopify'
import type { CartItem } from '@/types/cart'

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    const lines: { merchandiseId: string; quantity: number }[] = []

    for (const item of items) {
      const product = getProductById(item.id)

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.id}` },
          { status: 400 }
        )
      }

      // Fetch all variants for this product from Shopify
      const variants = await getProductVariants(product.shopifyHandle)

      // Try to match by size option. For ONE SIZE products that have no size option
      // configured in Shopify, selectedOptions will be empty — fall back to variants[0].
      const variant =
        variants.find((v) =>
          v.selectedOptions.some(
            (opt) =>
              opt.name.toLowerCase() === 'size' &&
              opt.value.toLowerCase() === item.size.toLowerCase()
          )
        ) ?? variants[0]

      if (!variant) {
        return NextResponse.json(
          { error: `No variants found for "${product.name}" in Shopify` },
          { status: 400 }
        )
      }

      if (!variant.availableForSale) {
        return NextResponse.json(
          { error: `Size "${item.size}" of "${product.name}" is currently out of stock` },
          { status: 400 }
        )
      }

      lines.push({ merchandiseId: variant.id, quantity: item.quantity })
    }

    const { checkoutUrl, cartId } = await createShopifyCart(lines)

    return NextResponse.json({ checkoutUrl, cartId })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error creating checkout session'
    console.error('Checkout error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
