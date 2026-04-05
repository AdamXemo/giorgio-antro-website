import { NextRequest, NextResponse } from 'next/server'
import { getProductById } from '@/data/products'
import { getProductVariants, createShopifyCart } from '@/lib/shopify'

interface CartItem {
  id: string
  name: string
  size: string
  quantity: number
  price: number
}

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

      // Find the variant matching the customer's selected size
      const variant = variants.find((v) =>
        v.selectedOptions.some(
          (opt) =>
            opt.name.toLowerCase() === 'size' &&
            opt.value.toLowerCase() === item.size.toLowerCase()
        )
      )

      if (!variant) {
        return NextResponse.json(
          { error: `Size "${item.size}" is not available for "${product.name}"` },
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
