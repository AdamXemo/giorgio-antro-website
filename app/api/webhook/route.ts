import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'

function verifyShopifyWebhook(body: string, hmacHeader: string): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      // Fail closed in production: an absent secret means every request would be
      // accepted, which allows anyone to forge orders/paid events.
      console.error('SHOPIFY_WEBHOOK_SECRET is not set — rejecting webhook in production')
      return false
    }
    // Development only: allow unverified webhooks so you can test with ngrok/CLI
    console.warn('SHOPIFY_WEBHOOK_SECRET is not set — skipping verification (dev only)')
    return true
  }

  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64')
  return hash === hmacHeader
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const hmacHeader = req.headers.get('x-shopify-hmac-sha256') || ''
  const topic = req.headers.get('x-shopify-topic') || ''

  if (!verifyShopifyWebhook(body, hmacHeader)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  console.log(`Shopify webhook received: ${topic}`)

  switch (topic) {
    case 'orders/paid':
    case 'orders/create': {
      // TODO (Phase 2 — Supabase): persist order to database and send confirmation email
      // const order = payload as ShopifyOrder
      // await upsertOrder(order)
      // await sendOrderConfirmation(order)

      // Log only non-PII order identifiers — never the full payload which includes
      // customer name, email, address, and payment details.
      const o = payload as Record<string, unknown>
      console.log('Order event:', {
        id: o.id,
        order_number: o.order_number,
        financial_status: o.financial_status,
        fulfillment_status: o.fulfillment_status,
        total_price: o.total_price,
        currency: o.currency,
      })
      break
    }

    case 'orders/fulfilled': {
      // TODO: update order status to 'shipped', send shipping notification
      break
    }

    case 'orders/cancelled': {
      // TODO: update order status to 'cancelled'
      break
    }

    default:
      console.log(`Unhandled Shopify webhook topic: ${topic}`)
  }

  return NextResponse.json({ received: true })
}
