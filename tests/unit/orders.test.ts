import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSupabaseStub, dbError, ok, orderRow, type SupabaseStub } from '../helpers/supabase'

/**
 * Characterization tests for lib/orders.ts.
 *
 * The Supabase client is stubbed: assertions are about the payload sent to the
 * database and the mapping applied to the row that comes back.
 */
const holder = vi.hoisted(() => ({ db: null as SupabaseStub | null }))

vi.mock('@/lib/db', () => ({
  getDb: () => {
    if (!holder.db) throw new Error('Supabase stub not initialised')
    return holder.db.client
  },
}))

import {
  createOrder,
  getOrderById,
  getOrderByStripePaymentIntentId,
  isUniqueViolation,
  OrderDbError,
  UNIQUE_VIOLATION,
  updateOrderStatus,
  type Order,
} from '@/lib/orders'

let db: SupabaseStub

/** A frozen clock + random source so the generated order number is predictable. */
const FIXED_NOW = 1_785_155_696_789

function newOrderInput(
  overrides: Partial<Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>> = {}
): Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'> {
  return {
    status: 'paid',
    customerInfo: {
      name: 'Jean Dupont',
      email: 'jean@example.com',
      phone: '+32470000000',
      address: {
        line1: 'Rue Neuve 1',
        line2: 'Bus 3',
        city: 'Brussels',
        state: 'Brussels',
        postalCode: '1000',
        country: 'BE',
      },
    },
    items: [
      {
        productId: 'antro-classic-hoodie',
        productName: 'Sailor Hooded Jacket',
        size: 'ONE SIZE',
        quantity: 1,
        price: 120,
      },
    ],
    subtotal: 120,
    shipping: 0,
    total: 120,
    stripePaymentIntentId: 'pi_test_123',
    ...overrides,
  }
}

beforeEach(() => {
  db = createSupabaseStub()
  holder.db = db
})

afterEach(() => {
  vi.useRealTimers()
})

describe('order number', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(FIXED_NOW)
  })

  it('is ANTRO- followed by 11 digits', async () => {
    db.single.mockResolvedValue(ok(orderRow()))

    await createOrder(newOrderInput())

    const inserted = db.insert.mock.calls[0][0] as { order_number: string }
    expect(inserted.order_number).toMatch(/^ANTRO-\d{11}$/)
  })

  it('is the last 8 digits of the timestamp plus a zero-padded 3-digit random', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.007)
    db.single.mockResolvedValue(ok(orderRow()))

    await createOrder(newOrderInput())

    const inserted = db.insert.mock.calls[0][0] as { order_number: string }
    expect(inserted.order_number).toBe('ANTRO-55696789007')
  })

  it('pads the random component at the top of the range too', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999)
    db.single.mockResolvedValue(ok(orderRow()))

    await createOrder(newOrderInput())

    const inserted = db.insert.mock.calls[0][0] as { order_number: string }
    expect(inserted.order_number).toBe('ANTRO-55696789999')
  })
})

describe('createOrder', () => {
  beforeEach(() => {
    db.single.mockResolvedValue(ok(orderRow()))
  })

  it('writes to the orders table with snake_case columns', async () => {
    await createOrder(newOrderInput())

    expect(db.from).toHaveBeenCalledWith('orders')
    expect(db.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/),
        status: 'paid',
        customer_name: 'Jean Dupont',
        customer_email: 'jean@example.com',
        customer_phone: '+32470000000',
        address_line1: 'Rue Neuve 1',
        address_line2: 'Bus 3',
        address_city: 'Brussels',
        address_state: 'Brussels',
        address_postal: '1000',
        address_country: 'BE',
        subtotal: 120,
        shipping: 0,
        total: 120,
        stripe_payment_intent_id: 'pi_test_123',
      })
    )
    expect(db.select).toHaveBeenCalled()
    expect(db.single).toHaveBeenCalled()
  })

  it('stores items as-is for the jsonb column', async () => {
    await createOrder(newOrderInput())

    const inserted = db.insert.mock.calls[0][0] as { items: unknown }
    expect(inserted.items).toEqual([
      {
        productId: 'antro-classic-hoodie',
        productName: 'Sailor Hooded Jacket',
        size: 'ONE SIZE',
        quantity: 1,
        price: 120,
      },
    ])
  })

  it('writes NULL for an absent phone, line2 and payment intent', async () => {
    await createOrder(
      newOrderInput({
        customerInfo: {
          name: 'Jean Dupont',
          email: 'jean@example.com',
          address: {
            line1: 'Rue Neuve 1',
            city: 'Brussels',
            state: 'Brussels',
            postalCode: '1000',
            country: 'BE',
          },
        },
        stripePaymentIntentId: undefined,
      })
    )

    expect(db.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_phone: null,
        address_line2: null,
        stripe_payment_intent_id: null,
      })
    )
  })

  it('maps every column of the returned row back onto an Order', async () => {
    const order = await createOrder(newOrderInput())

    expect(order).toEqual({
      id: '11111111-2222-3333-4444-555555555555',
      orderNumber: 'ANTRO-12345678901',
      status: 'paid',
      customerInfo: {
        name: 'Jean Dupont',
        email: 'jean@example.com',
        phone: '+32470000000',
        address: {
          line1: 'Rue Neuve 1',
          line2: 'Bus 3',
          city: 'Brussels',
          state: 'Brussels',
          postalCode: '1000',
          country: 'BE',
        },
      },
      items: [
        {
          productId: 'antro-classic-hoodie',
          productName: 'Sailor Hooded Jacket',
          size: 'ONE SIZE',
          quantity: 1,
          price: 120,
        },
      ],
      subtotal: 120,
      shipping: 0,
      total: 120,
      stripePaymentIntentId: 'pi_test_123',
      createdAt: '2026-07-27T10:00:00.000Z',
      updatedAt: '2026-07-27T10:00:00.000Z',
    })
  })

  it('coerces Postgres numeric strings to numbers', async () => {
    db.single.mockResolvedValue(
      ok(orderRow({ subtotal: '120.00', shipping: '10.00', total: '130.00' }))
    )

    const order = await createOrder(newOrderInput())

    expect(order.subtotal).toBe(120)
    expect(order.shipping).toBe(10)
    expect(order.total).toBe(130)
  })

  it('passes NULL optionals straight through (they are typed optional but arrive as null)', async () => {
    db.single.mockResolvedValue(
      ok(orderRow({ address_line2: null, customer_phone: null, stripe_payment_intent_id: null }))
    )

    const order = await createOrder(newOrderInput())

    expect(order.customerInfo.address.line2).toBeNull()
    expect(order.customerInfo.phone).toBeNull()
    expect(order.stripePaymentIntentId).toBeNull()
  })

  it('throws a prefixed error when the insert fails', async () => {
    db.single.mockResolvedValue(dbError('duplicate key value violates unique constraint'))

    await expect(createOrder(newOrderInput())).rejects.toThrow(
      '[createOrder] duplicate key value violates unique constraint'
    )
  })
})

describe('database errors', () => {
  /**
   * Added in Phase 2: the SQLSTATE code has to survive the throw, otherwise the
   * webhook cannot tell "this order already exists" (permanent, and actually
   * success) from "the database fell over" (transient, worth a retry).
   */
  async function failingInsert(message: string, code?: string) {
    db.single.mockResolvedValue(dbError(message, code))
    return createOrder(newOrderInput()).catch((err: unknown) => err)
  }

  it('preserves the Postgres code and details', async () => {
    db.single.mockResolvedValue(
      dbError(
        'duplicate key value violates unique constraint',
        UNIQUE_VIOLATION,
        'Key (stripe_payment_intent_id)=(pi_test_123) already exists.'
      )
    )

    const err = await createOrder(newOrderInput()).catch((e: unknown) => e)

    expect(err).toBeInstanceOf(OrderDbError)
    expect(err).toMatchObject({
      name: 'OrderDbError',
      code: UNIQUE_VIOLATION,
      details: 'Key (stripe_payment_intent_id)=(pi_test_123) already exists.',
    })
  })

  it('identifies a unique violation', async () => {
    expect(isUniqueViolation(await failingInsert('duplicate key', UNIQUE_VIOLATION))).toBe(true)
  })

  it('does not mistake other database failures for a unique violation', async () => {
    expect(isUniqueViolation(await failingInsert('deadlock detected', '40P01'))).toBe(false)
    expect(isUniqueViolation(await failingInsert('connection reset'))).toBe(false)
  })

  it('does not mistake unrelated errors for a unique violation', () => {
    expect(isUniqueViolation(new Error('duplicate key value'))).toBe(false)
    expect(isUniqueViolation(null)).toBe(false)
  })
})

describe('getOrderById', () => {
  it('selects the row by primary key', async () => {
    db.maybeSingle.mockResolvedValue(ok(orderRow()))

    const order = await getOrderById('11111111-2222-3333-4444-555555555555')

    expect(db.from).toHaveBeenCalledWith('orders')
    expect(db.select).toHaveBeenCalledWith('*')
    expect(db.eq).toHaveBeenCalledWith('id', '11111111-2222-3333-4444-555555555555')
    expect(order?.orderNumber).toBe('ANTRO-12345678901')
  })

  it('returns null when there is no row', async () => {
    db.maybeSingle.mockResolvedValue(ok(null))

    await expect(getOrderById('missing')).resolves.toBeNull()
  })

  it('throws a prefixed error on a query failure', async () => {
    db.maybeSingle.mockResolvedValue(dbError('connection reset'))

    await expect(getOrderById('any')).rejects.toThrow('[getOrderById] connection reset')
  })
})

describe('getOrderByStripePaymentIntentId', () => {
  it('looks the order up by the payment intent column', async () => {
    db.maybeSingle.mockResolvedValue(ok(orderRow()))

    const order = await getOrderByStripePaymentIntentId('pi_test_123')

    expect(db.eq).toHaveBeenCalledWith('stripe_payment_intent_id', 'pi_test_123')
    expect(order?.stripePaymentIntentId).toBe('pi_test_123')
  })

  it('returns null when the payment intent is unknown', async () => {
    db.maybeSingle.mockResolvedValue(ok(null))

    await expect(getOrderByStripePaymentIntentId('pi_unknown')).resolves.toBeNull()
  })

  it('throws a prefixed error on a query failure', async () => {
    db.maybeSingle.mockResolvedValue(dbError('timeout'))

    await expect(getOrderByStripePaymentIntentId('pi_test_123')).rejects.toThrow(
      '[getOrderByStripePaymentIntentId] timeout'
    )
  })
})

describe('updateOrderStatus', () => {
  it('updates only the status column', async () => {
    db.single.mockResolvedValue(ok(orderRow({ status: 'shipped' })))

    const order = await updateOrderStatus('11111111-2222-3333-4444-555555555555', 'shipped')

    expect(db.update).toHaveBeenCalledWith({ status: 'shipped' })
    expect(db.eq).toHaveBeenCalledWith('id', '11111111-2222-3333-4444-555555555555')
    expect(order?.status).toBe('shipped')
  })

  it('throws a prefixed error on failure', async () => {
    db.single.mockResolvedValue(dbError('row not found'))

    await expect(updateOrderStatus('nope', 'shipped')).rejects.toThrow(
      '[updateOrderStatus] row not found'
    )
  })
})
