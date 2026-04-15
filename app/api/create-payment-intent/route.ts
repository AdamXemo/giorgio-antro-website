import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import {
  buildCheckoutMetadata,
  buildStripeIdempotencyKey,
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
    const encodedItems = buildCheckoutMetadata(items)

    const paymentIntent = await getStripe().paymentIntents.create(
      {
        amount: amountInCents,
        currency: 'eur',
        metadata: {
          items: encodedItems,
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          total: total.toFixed(2),
        },
      },
      {
        idempotencyKey: buildStripeIdempotencyKey('payment-intent', items),
      }
    )

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
