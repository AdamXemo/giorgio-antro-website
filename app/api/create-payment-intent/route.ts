import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getProductById } from '@/data/products'

export const runtime = 'nodejs'

interface RequestLineItem {
  id: string
  quantity: number
}

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: RequestLineItem[] } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    // Price is looked up server-side per line item — never trusted from the
    // request body. The client only sends { id, quantity }.
    let subtotalCents = 0
    const metadataItems: {
      productId: string
      productName: string
      size: string
      quantity: number
      price: number
    }[] = []

    for (const { id, quantity } of items) {
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 })
      }

      const product = getProductById(id)
      if (!product) {
        return NextResponse.json({ error: `Unknown product: ${id}` }, { status: 400 })
      }

      const unitCents = Math.round(product.price * 100)
      subtotalCents += unitCents * quantity

      metadataItems.push({
        productId: product.id,
        productName: product.name,
        size: product.sizes[0] ?? 'ONE SIZE',
        quantity,
        price: unitCents / 100,
      })
    }

    const shippingCents = subtotalCents >= 10000 ? 0 : 1000
    const totalCents = subtotalCents + shippingCents

    if (totalCents <= 0) {
      return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 })
    }

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: totalCents,
      currency: 'eur',
      metadata: {
        items: JSON.stringify(metadataItems),
        subtotal: (subtotalCents / 100).toFixed(2),
        shipping: (shippingCents / 100).toFixed(2),
        total: (totalCents / 100).toFixed(2),
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (err) {
    console.error('[create-payment-intent]', err)
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}
