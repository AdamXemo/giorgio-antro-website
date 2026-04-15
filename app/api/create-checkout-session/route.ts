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

const ALLOWED_COUNTRIES = [
  'BE', 'NL', 'FR', 'DE', 'LU', 'GB', 'IT', 'ES', 'PT', 'CH',
  'AT', 'PL', 'SE', 'DK', 'NO', 'FI', 'IE', 'US', 'CA', 'AU',
] as const

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json()
    const items = validateCheckoutItems(
      typeof body === 'object' && body !== null ? (body as { items?: unknown }).items : undefined
    )
    const { subtotal, shipping, total } = calculateCheckoutTotals(items)
    const encodedItems = buildCheckoutMetadata(items)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    const session = await getStripe().checkout.sessions.create(
      {
        ui_mode: 'embedded_page',
        mode: 'payment',
        currency: 'eur',
        line_items: items.map((item) => ({
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.size !== 'ONE SIZE'
                ? `${item.name} — ${item.size}`
                : item.name,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        shipping_options: [
          shipping === 0
            ? {
                shipping_rate_data: {
                  type: 'fixed_amount',
                  fixed_amount: { amount: 0, currency: 'eur' },
                  display_name: 'Free shipping',
                  delivery_estimate: {
                    minimum: { unit: 'business_day', value: 3 },
                    maximum: { unit: 'business_day', value: 5 },
                  },
                },
              }
            : {
                shipping_rate_data: {
                  type: 'fixed_amount',
                  fixed_amount: { amount: 1000, currency: 'eur' },
                  display_name: 'Standard shipping',
                  delivery_estimate: {
                    minimum: { unit: 'business_day', value: 3 },
                    maximum: { unit: 'business_day', value: 5 },
                  },
                },
              },
        ],
        shipping_address_collection: {
          allowed_countries: [...ALLOWED_COUNTRIES],
        },
        metadata: {
          items: encodedItems,
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          total: total.toFixed(2),
        },
        return_url: `${siteUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      },
      {
        idempotencyKey: buildStripeIdempotencyKey('checkout-session', items),
      }
    )

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (err) {
    if (err instanceof CheckoutValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    console.error('[create-checkout-session]', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
