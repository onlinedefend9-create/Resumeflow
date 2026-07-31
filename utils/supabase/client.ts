import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null

export function createClient() {
  if (supabase) return supabase

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // Accept either the classic anon key or the newer publishable key variable
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)')
  }

  supabase = createSupabaseClient(url, anonKey)
  return supabase
}
