/**
 * Centralized, fail-fast environment variable access for server code.
 *
 * Every server-side integration (Stripe, Supabase, Resend) reads its
 * credentials through here so a missing variable produces one consistent,
 * actionable error instead of an opaque failure deep inside a vendor SDK.
 *
 * Values are read lazily on each call — never at module load — so that
 * importing a module does not blow up at build time.
 */

/** Server-only variables. Every one of these must be set for the app to work. */
export const REQUIRED_SERVER_ENV = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
] as const

export type RequiredServerEnvVar = (typeof REQUIRED_SERVER_ENV)[number]

function describeMissing(names: readonly string[]): string {
  const list = names.join(', ')
  return (
    `[env] Missing required environment variable${names.length > 1 ? 's' : ''}: ${list}. ` +
    `Set ${names.length > 1 ? 'them' : 'it'} in .env.local for local development, ` +
    `or in the Vercel project settings for a deployment.`
  )
}

/**
 * Returns the value of a required server variable, throwing a descriptive
 * error when it is missing or blank.
 */
export function requireEnv(name: RequiredServerEnvVar): string {
  const value = process.env[name]
  if (!value || !value.trim()) {
    throw new Error(describeMissing([name]))
  }
  return value
}

/**
 * Returns an optional variable, falling back to `fallback` when unset/blank.
 */
export function optionalEnv(name: string, fallback: string): string {
  const value = process.env[name]
  return value && value.trim() ? value : fallback
}

/**
 * Validates the whole server environment at once and reports *every* missing
 * variable in a single error. Useful as a startup/health check — individual
 * call sites still use `requireEnv`.
 */
export function assertServerEnv(): void {
  const missing = REQUIRED_SERVER_ENV.filter((name) => {
    const value = process.env[name]
    return !value || !value.trim()
  })
  if (missing.length > 0) {
    throw new Error(describeMissing(missing))
  }
}
