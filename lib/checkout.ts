import 'server-only'

import { createHash } from 'node:crypto'
import { getProductById } from '@/data/products'
import type { CartItem } from '@/types/cart'
import type { OrderItem } from '@/lib/orders'

export interface ValidatedCheckoutItem {
  id: string
  name: string
  price: number
  size: string
  quantity: number
}

type CheckoutMetadataItem = [productId: string, size: string, quantity: number]

export class CheckoutValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CheckoutValidationError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isValidQuantity(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

function validateCartItem(input: unknown): ValidatedCheckoutItem {
  if (!isRecord(input)) {
    throw new CheckoutValidationError('Each cart item must be an object')
  }

  const id = input.id
  const size = input.size
  const quantity = input.quantity

  if (typeof id !== 'string' || id.length === 0) {
    throw new CheckoutValidationError('Each cart item must include a valid product id')
  }

  if (typeof size !== 'string' || size.length === 0) {
    throw new CheckoutValidationError('Each cart item must include a valid size')
  }

  if (!isValidQuantity(quantity)) {
    throw new CheckoutValidationError('Each cart item must include a valid quantity')
  }

  const product = getProductById(id)
  if (!product) {
    throw new CheckoutValidationError(`Unknown product: ${id}`)
  }

  if (!product.sizes.includes(size)) {
    throw new CheckoutValidationError(`Invalid size for product: ${id}`)
  }

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    size,
    quantity,
  }
}

export function validateCheckoutItems(items: unknown): ValidatedCheckoutItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw new CheckoutValidationError('No items provided')
  }

  if (items.length > 100) {
    throw new CheckoutValidationError('Cart exceeds Stripe line item limit')
  }

  // TODO (human): Replace static catalog validation with the real source of truth
  // once product pricing is moved to Shopify or Stripe-managed Prices.
  return items.map(validateCartItem)
}

export function calculateCheckoutTotals(items: Pick<CartItem, 'price' | 'quantity'>[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 100 ? 0 : 10
  const total = subtotal + shipping

  return { subtotal, shipping, total }
}

export function buildCheckoutMetadata(items: ValidatedCheckoutItem[]) {
  return JSON.stringify(
    items.map((item): CheckoutMetadataItem => [item.id, item.size, item.quantity])
  )
}

export function parseOrderItemsFromMetadata(rawItems: string | undefined): OrderItem[] {
  let parsed: unknown

  try {
    parsed = JSON.parse(rawItems ?? '[]')
  } catch {
    throw new CheckoutValidationError('Invalid items metadata')
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new CheckoutValidationError('Missing items metadata')
  }

  return parsed.map((entry) => {
    if (!Array.isArray(entry) || entry.length !== 3) {
      throw new CheckoutValidationError('Invalid items metadata')
    }

    const [id, size, quantity] = entry
    if (typeof id !== 'string' || typeof size !== 'string' || !isValidQuantity(quantity)) {
      throw new CheckoutValidationError('Invalid items metadata')
    }

    const product = getProductById(id)
    if (!product) {
      throw new CheckoutValidationError(`Unknown product in metadata: ${id}`)
    }

    if (!product.sizes.includes(size)) {
      throw new CheckoutValidationError(`Invalid size in metadata: ${id}`)
    }

    return {
      productId: product.id,
      productName: product.name,
      size,
      quantity,
      price: product.price,
    }
  })
}

export function buildStripeIdempotencyKey(prefix: string, items: ValidatedCheckoutItem[]): string {
  const payload = items.map((item) => `${item.id}:${item.size}:${item.quantity}:${item.price}`).join('|')
  return `${prefix}-${createHash('sha256').update(payload).digest('hex').slice(0, 32)}`
}
