import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _db: SupabaseClient | null = null

/**
 * Returns the server-side Supabase client, initializing it on first use.
 * Uses the service role key — bypasses Row Level Security.
 * Must ONLY be called from API routes / server components, never in the browser.
 */
export function getDb(): SupabaseClient {
  if (_db) return _db

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      '[lib/db.ts] NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.'
    )
  }

  _db = createClient(url, key, { auth: { persistSession: false } })
  return _db
}
