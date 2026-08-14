import { vi, type Mock } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

/**
 * Minimal stand-in for the supabase-js query builder.
 *
 * Every chainable method returns the same object and records its arguments, so
 * a test can assert *what was sent to the database* without a database:
 *
 *   expect(db.insert).toHaveBeenCalledWith(expect.objectContaining({ total: 130 }))
 *
 * The two terminal methods (`single` / `maybeSingle`) are where a test plugs in
 * the response it wants: `db.maybeSingle.mockResolvedValue({ data: null, error: null })`.
 */
export interface SupabaseStub {
  /** Cast to the real client type — hand this to a mocked `getDb()`. */
  client: SupabaseClient<Database>
  from: Mock
  insert: Mock
  select: Mock
  eq: Mock
  update: Mock
  single: Mock
  maybeSingle: Mock
}

interface QueryBuilderStub {
  insert: Mock
  select: Mock
  eq: Mock
  update: Mock
  single: Mock
  maybeSingle: Mock
}

/** Shape supabase-js returns from a terminal query method. */
export interface SupabaseResult {
  data: unknown
  error: { message: string; code?: string; details?: string; hint?: string } | null
}

export function ok(data: unknown): SupabaseResult {
  return { data, error: null }
}

export function dbError(message: string, code?: string, details?: string): SupabaseResult {
  return { data: null, error: { message, code, details } }
}

export function createSupabaseStub(): SupabaseStub {
  const single: Mock = vi.fn(async () => ok(null))
  const maybeSingle: Mock = vi.fn(async () => ok(null))

  const builder: QueryBuilderStub = {
    insert: vi.fn(() => builder),
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    update: vi.fn(() => builder),
    single,
    maybeSingle,
  }

  const from: Mock = vi.fn(() => builder)

  return {
    client: { from } as unknown as SupabaseClient<Database>,
    from,
    ...builder,
  }
}

/** A row as it comes back from the `orders` table. */
export function orderRow(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: '11111111-2222-3333-4444-555555555555',
    order_number: 'ANTRO-12345678901',
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
    items: [
      {
        productId: 'antro-classic-hoodie',
        productName: 'Sailor Hooded Jacket',
        size: 'ONE SIZE',
        quantity: 1,
        price: 120,
      },
    ],
    stripe_payment_intent_id: 'pi_test_123',
    created_at: '2026-07-27T10:00:00.000Z',
    updated_at: '2026-07-27T10:00:00.000Z',
    ...overrides,
  }
}
