import { v4 as uuidv4 } from 'uuid'
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

// ── Errors ────────────────────────────────────────────────────────────────────

/** Postgres `unique_violation`. */
export const UNIQUE_VIOLATION = '23505'

/**
 * Wraps a Supabase/Postgres failure while preserving the SQLSTATE code, so
 * callers can tell a retryable outage apart from a permanent constraint
 * violation (see `isUniqueViolation`).
 */
export class OrderDbError extends Error {
  readonly code?: string
  readonly details?: string

  constructor(message: string, code?: string, details?: string) {
    super(message)
    this.name = 'OrderDbError'
    this.code = code
    this.details = details
  }
}

/**
 * True when the error is Postgres rejecting a duplicate row. For the orders
 * table this means the `stripe_payment_intent_id` unique index fired — i.e.
 * the order already exists and the write was a redundant one.
 */
export function isUniqueViolation(err: unknown): boolean {
  return err instanceof OrderDbError && err.code === UNIQUE_VIOLATION
}

// ── Private helpers ───────────────────────────────────────────────────────────

function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ANTRO-${timestamp}${random}`
}

type DbRow = Record<string, unknown>

function rowToOrder(row: DbRow): Order {
  return {
    id:          row.id as string,
    orderNumber: row.order_number as string,
    items:       row.items as OrderItem[],
    customerInfo: {
      email: row.customer_email as string,
      name:  row.customer_name as string,
      phone: row.customer_phone as string | undefined,
      address: {
        line1:      row.address_line1 as string,
        line2:      row.address_line2 as string | undefined,
        city:       row.address_city as string,
        state:      row.address_state as string,
        postalCode: row.address_postal as string,
        country:    row.address_country as string,
      },
    },
    subtotal:           Number(row.subtotal),
    shipping:           Number(row.shipping),
    total:              Number(row.total),
    status:                  row.status as Order['status'],
    stripePaymentIntentId:   row.stripe_payment_intent_id as string | undefined,
    createdAt:               row.created_at as string,
    updatedAt:               row.updated_at as string,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function createOrder(
  orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
): Promise<Order> {
  const id = uuidv4()
  const orderNumber = generateOrderNumber()

  const { data, error } = await getDb()
    .from('orders')
    .insert({
      id,
      order_number:         orderNumber,
      status:               orderData.status,
      customer_name:        orderData.customerInfo.name,
      customer_email:       orderData.customerInfo.email,
      customer_phone:       orderData.customerInfo.phone ?? null,
      address_line1:        orderData.customerInfo.address.line1,
      address_line2:        orderData.customerInfo.address.line2 ?? null,
      address_city:         orderData.customerInfo.address.city,
      address_state:        orderData.customerInfo.address.state,
      address_postal:       orderData.customerInfo.address.postalCode,
      address_country:      orderData.customerInfo.address.country,
      subtotal:             orderData.subtotal,
      shipping:             orderData.shipping,
      total:                orderData.total,
      items:                        orderData.items as unknown as import('../types/supabase').Json,
      stripe_payment_intent_id:     orderData.stripePaymentIntentId ?? null,
    })
    .select()
    .single()

  if (error) throw new OrderDbError(`[createOrder] ${error.message}`, error.code, error.details)
  return rowToOrder(data as DbRow)
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await getDb()
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new OrderDbError(`[getOrderById] ${error.message}`, error.code, error.details)
  return data ? rowToOrder(data as DbRow) : null
}

export async function getOrderByStripePaymentIntentId(
  paymentIntentId: string
): Promise<Order | null> {
  const { data, error } = await getDb()
    .from('orders')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .maybeSingle()

  if (error) {
    throw new OrderDbError(
      `[getOrderByStripePaymentIntentId] ${error.message}`,
      error.code,
      error.details
    )
  }
  return data ? rowToOrder(data as DbRow) : null
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

  if (error) {
    throw new OrderDbError(`[updateOrderStatus] ${error.message}`, error.code, error.details)
  }
  return data ? rowToOrder(data as DbRow) : null
}
