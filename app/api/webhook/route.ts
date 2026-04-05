import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createOrder, getOrderByShopifyId, updateOrderStatus } from '@/lib/orders'
import type { Order, OrderItem } from '@/lib/orders'
import { sendOrderConfirmation } from '@/lib/email'

export const runtime = 'nodejs'

// ── Signature verification ────────────────────────────────────────────────────

function verifyShopifyWebhook(body: string, hmacHeader: string): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[webhook] SHOPIFY_WEBHOOK_SECRET is not set — rejecting in production')
      return false
    }
    console.warn('[webhook] SHOPIFY_WEBHOOK_SECRET not set — skipping verification (dev only)')
    return true
  }
  const hash = crypto.createHmac('sha256', secret).update(body, 'utf8').digest('base64')
  return hash === hmacHeader
}

// ── Shopify payload types ─────────────────────────────────────────────────────

interface ShopifyLineItem {
  title: string
  quantity: number
  price: string
  variant_title: string | null
}

interface ShopifyAddress {
  first_name: string
  last_name: string
  address1: string
  address2: string | null
  city: string
  province_code: string
  zip: string
  country: string
}

interface ShopifyOrderPayload {
  id: number
  order_number: string
  email: string
  financial_status: string
  fulfillment_status: string | null
  total_price: string
  currency: string
  line_items: ShopifyLineItem[]
  shipping_address: ShopifyAddress
}

// ── Mapping helper ────────────────────────────────────────────────────────────

function mapShopifyToOrder(
  payload: ShopifyOrderPayload
): Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'> {
  const items: OrderItem[] = payload.line_items.map((li) => ({
    productId:   'shopify',
    productName: li.title,
    size:        li.variant_title ?? 'ONE SIZE',
    quantity:    li.quantity,
    price:       parseFloat(li.price),
  }))

  const total    = parseFloat(payload.total_price)
  const shipping = 0
  const subtotal = total - shipping

  const addr = payload.shipping_address

  return {
    status:             'paid',
    items,
    subtotal,
    shipping,
    total,
    shopifyOrderId:     payload.id,
    shopifyOrderNumber: String(payload.order_number),
    customerInfo: {
      name:  `${addr.first_name} ${addr.last_name}`.trim(),
      email: payload.email,
      address: {
        line1:      addr.address1,
        line2:      addr.address2 ?? undefined,
        city:       addr.city,
        state:      addr.province_code,
        postalCode: addr.zip,
        country:    addr.country,
      },
    },
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body       = await req.text()
  const hmacHeader = req.headers.get('x-shopify-hmac-sha256') ?? ''
  const topic      = req.headers.get('x-shopify-topic') ?? ''

  if (!verifyShopifyWebhook(body, hmacHeader)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Log only non-PII identifiers
  console.log(`[webhook] ${topic}`, {
    id:               payload.id,
    order_number:     payload.order_number,
    financial_status: payload.financial_status,
  })

  try {
    switch (topic) {
      case 'orders/paid':
      case 'orders/create': {
        const shopifyPayload = payload as unknown as ShopifyOrderPayload

        // Idempotency guard: Shopify may deliver the same event more than once
        const existing = await getOrderByShopifyId(shopifyPayload.id)
        if (existing) {
          console.log(`[webhook] Order ${shopifyPayload.id} already stored (${existing.id}), skipping`)
          break
        }

        const orderData = mapShopifyToOrder(shopifyPayload)
        const order     = await createOrder(orderData)
        console.log(`[webhook] Created order ${order.id} (${order.orderNumber})`)

        // Fire-and-forget: email failure must not cause a non-200 response
        // (Shopify would retry indefinitely on 5xx)
        sendOrderConfirmation(order).catch((err) =>
          console.error('[webhook] sendOrderConfirmation failed:', err)
        )
        break
      }

      case 'orders/fulfilled': {
        const shopifyId = (payload as { id: number }).id
        const existing  = await getOrderByShopifyId(shopifyId)
        if (existing) {
          await updateOrderStatus(existing.id, 'shipped')
          console.log(`[webhook] Order ${existing.id} marked as shipped`)
        }
        break
      }

      case 'orders/cancelled': {
        const shopifyId = (payload as { id: number }).id
        const existing  = await getOrderByShopifyId(shopifyId)
        if (existing) {
          await updateOrderStatus(existing.id, 'cancelled')
          console.log(`[webhook] Order ${existing.id} marked as cancelled`)
        }
        break
      }

      default:
        console.log(`[webhook] Unhandled topic: ${topic}`)
    }
  } catch (err) {
    // Return 500 for transient errors (DB unavailable) so Shopify retries.
    // Return 200 for logic errors to prevent infinite retry loops.
    if (err instanceof Error && err.message.toLowerCase().includes('supabase')) {
      console.error('[webhook] DB error (will retry):', err)
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })
    }
    console.error('[webhook] Handler error (no retry):', err)
  }

  return NextResponse.json({ received: true })
}
