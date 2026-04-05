import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import type { CartItem } from '@/types/cart'

export const runtime = 'nodejs'

const ALLOWED_COUNTRIES = [
  'BE', 'NL', 'FR', 'DE', 'LU', 'GB', 'IT', 'ES', 'PT', 'CH',
  'AT', 'PL', 'SE', 'DK', 'NO', 'FI', 'IE', 'US', 'CA', 'AU',
] as const

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 100 ? 0 : 10
    const total = subtotal + shipping

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    const session = await getStripe().checkout.sessions.create({
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
        items: JSON.stringify(
          items.map((i) => ({
            productId:   i.id,
            productName: i.name,
            size:        i.size,
            quantity:    i.quantity,
            price:       i.price,
          }))
        ),
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        total:    total.toFixed(2),
      },
      return_url: `${siteUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    })

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (err) {
    console.error('[create-checkout-session]', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
