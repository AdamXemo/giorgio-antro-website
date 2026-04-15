import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import {
  calculateCheckoutTotals,
  CheckoutValidationError,
  validateCheckoutItems,
} from '@/lib/checkout'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json()
    const items = validateCheckoutItems(
      typeof body === 'object' && body !== null ? (body as { items?: unknown }).items : undefined
    )
    const { subtotal, shipping, total } = calculateCheckoutTotals(items)
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
    if (err instanceof CheckoutValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    console.error('[create-payment-intent]', err)
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}
