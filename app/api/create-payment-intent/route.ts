import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import type { CartItem } from '@/types/cart'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 100 ? 0 : 10
    const total = subtotal + shipping
    const amountInCents = Math.round(total * 100)

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      metadata: {
        items: JSON.stringify(
          items.map((i) => ({
            productId: i.id,
            productName: i.name,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
          }))
        ),
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
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
