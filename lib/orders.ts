import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

/**
 * STORAGE SAFETY GUARD
 *
 * This module writes orders to the local filesystem (data/orders/*.json).
 * That works fine in local development but is UNSAFE for any serverless or
 * containerised host (Vercel, Netlify, Railway, Render, AWS Lambda, etc.)
 * because:
 *   1. The filesystem is ephemeral — files written after deploy are wiped on
 *      the next cold start or new instance.
 *   2. Multiple function instances do not share the same filesystem, so orders
 *      written on one instance are invisible to others.
 *
 * If this guard fires in production, the fix is to complete Phase 3 of
 * future_steps.md: replace this module with a real database (Supabase, etc.)
 * and remove this file entirely.
 *
 * To intentionally run file-based storage in production (e.g., a single
 * long-running VPS where you have verified the filesystem is persistent),
 * set the following env var to opt in explicitly:
 *   ALLOW_FILE_ORDERS_STORAGE=true
 */
const isServerless =
  process.env.VERCEL === '1' ||
  process.env.NETLIFY === 'true' ||
  process.env.RENDER === 'true' ||
  typeof process.env.AWS_LAMBDA_FUNCTION_NAME === 'string' ||
  typeof process.env.RAILWAY_ENVIRONMENT === 'string'

if (
  process.env.NODE_ENV === 'production' &&
  isServerless &&
  process.env.ALLOW_FILE_ORDERS_STORAGE !== 'true'
) {
  throw new Error(
    '[orders.ts] File-based order storage cannot be used in a serverless environment. ' +
    'Orders written to disk will be silently lost between function invocations. ' +
    'Complete Phase 3 of future_steps.md to migrate to a database. ' +
    'If you are on a persistent server and know what you are doing, ' +
    'set ALLOW_FILE_ORDERS_STORAGE=true to suppress this error.'
  )
}

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
  paymentIntentId?: string
  stripeSessionId?: string
  createdAt: string
  updatedAt: string
}

const ordersDir = path.join(process.cwd(), 'data', 'orders')

// Ensure orders directory exists
export function ensureOrdersDir() {
  if (!fs.existsSync(ordersDir)) {
    fs.mkdirSync(ordersDir, { recursive: true })
  }
}

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ANTRO-${timestamp}${random}`
}

// Create new order
export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  ensureOrdersDir()
  
  const order: Order = {
    ...orderData,
    id: uuidv4(),
    orderNumber: generateOrderNumber(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const orderPath = path.join(ordersDir, `${order.id}.json`)
  fs.writeFileSync(orderPath, JSON.stringify(order, null, 2))

  return order
}

// Get order by ID
export async function getOrderById(id: string): Promise<Order | null> {
  ensureOrdersDir()
  
  const orderPath = path.join(ordersDir, `${id}.json`)
  
  if (!fs.existsSync(orderPath)) {
    return null
  }

  const orderData = fs.readFileSync(orderPath, 'utf-8')
  return JSON.parse(orderData) as Order
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  ensureOrdersDir()
  
  const files = fs.readdirSync(ordersDir)
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const orderData = fs.readFileSync(path.join(ordersDir, file), 'utf-8')
      const order = JSON.parse(orderData) as Order
      if (order.orderNumber === orderNumber) {
        return order
      }
    }
  }
  
  return null
}

// Update order
export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
  ensureOrdersDir()
  
  const order = await getOrderById(id)
  if (!order) {
    return null
  }

  const updatedOrder: Order = {
    ...order,
    ...updates,
    id: order.id, // Ensure ID doesn't change
    orderNumber: order.orderNumber, // Ensure order number doesn't change
    createdAt: order.createdAt, // Preserve creation date
    updatedAt: new Date().toISOString(),
  }

  const orderPath = path.join(ordersDir, `${id}.json`)
  fs.writeFileSync(orderPath, JSON.stringify(updatedOrder, null, 2))

  return updatedOrder
}

// Get all orders
export async function getAllOrders(): Promise<Order[]> {
  ensureOrdersDir()
  
  const files = fs.readdirSync(ordersDir)
  const orders: Order[] = []

  for (const file of files) {
    if (file.endsWith('.json')) {
      const orderData = fs.readFileSync(path.join(ordersDir, file), 'utf-8')
      orders.push(JSON.parse(orderData) as Order)
    }
  }

  // Sort by creation date (newest first)
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

