import { describe, expect, it, vi } from 'vitest'
import { assertServerEnv, optionalEnv, requireEnv } from '@/lib/env'

describe('requireEnv', () => {
  it('returns the value when the variable is set', () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_abc')
    expect(requireEnv('STRIPE_SECRET_KEY')).toBe('sk_test_abc')
  })

  it('throws a named, actionable error when the variable is missing', () => {
    vi.stubEnv('STRIPE_SECRET_KEY', undefined)
    expect(() => requireEnv('STRIPE_SECRET_KEY')).toThrow(/STRIPE_SECRET_KEY/)
    expect(() => requireEnv('STRIPE_SECRET_KEY')).toThrow(/\.env\.local/)
  })

  it('treats a blank value as missing', () => {
    vi.stubEnv('RESEND_API_KEY', '   ')
    expect(() => requireEnv('RESEND_API_KEY')).toThrow(/RESEND_API_KEY/)
  })
})

describe('optionalEnv', () => {
  it('falls back when unset or blank', () => {
    vi.stubEnv('CONTACT_EMAIL', undefined)
    expect(optionalEnv('CONTACT_EMAIL', 'info@example.com')).toBe('info@example.com')

    vi.stubEnv('CONTACT_EMAIL', '')
    expect(optionalEnv('CONTACT_EMAIL', 'info@example.com')).toBe('info@example.com')
  })

  it('prefers the configured value', () => {
    vi.stubEnv('CONTACT_EMAIL', 'hello@giorgioantro.com')
    expect(optionalEnv('CONTACT_EMAIL', 'info@example.com')).toBe('hello@giorgioantro.com')
  })
})

describe('assertServerEnv', () => {
  it('passes when the whole server environment is present', () => {
    expect(() => assertServerEnv()).not.toThrow()
  })

  it('reports every missing variable in one error', () => {
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', undefined)
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', undefined)

    expect(() => assertServerEnv()).toThrow(/STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY/)
  })
})
