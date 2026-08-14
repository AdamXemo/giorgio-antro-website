import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { requireEnv } from './env'

let _db: SupabaseClient<Database> | null = null

/**
 * Returns the server-side Supabase client, initializing it on first use.
 * Uses the service role key — bypasses Row Level Security.
 * Must ONLY be called from API routes / server components, never in the browser.
 */
export function getDb(): SupabaseClient<Database> {
  if (_db) return _db

  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY')

  _db = createClient<Database>(url, key, { auth: { persistSession: false } })
  return _db
}
