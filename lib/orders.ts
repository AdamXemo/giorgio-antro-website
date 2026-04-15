import 'server-only'

import { v4 as uuidv4 } from 'uuid'
import type { Json, Tables, TablesInsert } from '@/types/supabase'
import { getDb } from './db'

export interface OrderItem {
  productId: string
  productName: string
  size: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
  customerInfo: {
    email: string
    name: string
    address: {
      line1: string
      line2?: string
      city: string
      state: string
      postalCode: string
      country: string
    }
    phone?: string
  }
  total: number
  subtotal: number
  shipping: number
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  stripePaymentIntentId?: string
  createdAt: string
  updatedAt: string
}

// ── Private helpers ───────────────────────────────────────────────────────────

function generateOrderNumber(): string {
  const timestamp = new Date().toISOString().replace(/\D/g, '').slice(2, 14)
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `ANTRO-${timestamp}${random}`
}

// TODO (human): Back this up with database UNIQUE constraints on both
// `order_number` and `stripe_payment_intent_id` in Supabase migrations.
type DbRow = Tables<'orders'>

function isJsonObject(value: Json): value is { [key: string]: Json | undefined } {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isOrderItem(value: Json): value is Json & { [key: string]: Json | undefined } {
  return (
    isJsonObject(value) &&
    typeof value.productId === 'string' &&
    typeof value.productName === 'string' &&
    typeof value.size === 'string' &&
    typeof value.quantity === 'number' &&
    typeof value.price === 'number'
  )
}

function parseOrderItems(value: Json): OrderItem[] {
  if (!Array.isArray(value) || !value.every(isOrderItem)) {
    throw new Error('[rowToOrder] Invalid order items payload in database.')
  }

  return value.map((item) => ({
    productId: item.productId as string,
    productName: item.productName as string,
    size: item.size as string,
    quantity: item.quantity as number,
    price: item.price as number,
  }))
}

function rowToOrder(row: DbRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    items: parseOrderItems(row.items),
    customerInfo: {
      email: row.customer_email,
      name: row.customer_name,
      phone: row.customer_phone ?? undefined,
      address: {
        line1: row.address_line1,
        line2: row.address_line2 ?? undefined,
        city: row.address_city,
        state: row.address_state,
        postalCode: row.address_postal,
        country: row.address_country,
      },
    },
    subtotal: row.subtotal,
    shipping: row.shipping,
    total: row.total,
    status: row.status as Order['status'],
    stripePaymentIntentId: row.stripe_payment_intent_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function createOrder(
  orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
): Promise<Order> {
  const id = uuidv4()
  const orderNumber = generateOrderNumber()
  const insertData: TablesInsert<'orders'> = {
    id,
    order_number: orderNumber,
    status: orderData.status,
    customer_name: orderData.customerInfo.name,
    customer_email: orderData.customerInfo.email,
    customer_phone: orderData.customerInfo.phone ?? null,
    address_line1: orderData.customerInfo.address.line1,
    address_line2: orderData.customerInfo.address.line2 ?? null,
    address_city: orderData.customerInfo.address.city,
    address_state: orderData.customerInfo.address.state,
    address_postal: orderData.customerInfo.address.postalCode,
    address_country: orderData.customerInfo.address.country,
    subtotal: orderData.subtotal,
    shipping: orderData.shipping,
    total: orderData.total,
    items: orderData.items as unknown as Json,
    stripe_payment_intent_id: orderData.stripePaymentIntentId ?? null,
  }

  const { data, error } = await getDb()
    .from('orders')
    .insert(insertData)
    .select()
    .single()

  if (error) throw new Error(`[createOrder] ${error.message}`)
  return rowToOrder(data)
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await getDb()
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`[getOrderById] ${error.message}`)
  return data ? rowToOrder(data) : null
}

export async function getOrderByStripePaymentIntentId(
  paymentIntentId: string
): Promise<Order | null> {
  const { data, error } = await getDb()
    .from('orders')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .maybeSingle()

  if (error) throw new Error(`[getOrderByStripePaymentIntentId] ${error.message}`)
  return data ? rowToOrder(data) : null
}

export async function updateOrderStatus(
  id: string,
  status: Order['status']
): Promise<Order | null> {
  const { data, error } = await getDb()
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`[updateOrderStatus] ${error.message}`)
  return data ? rowToOrder(data) : null
}
