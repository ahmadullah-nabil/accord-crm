// ─── Supabase Client ──────────────────────────────────────────────────────────
//
// This file is the SINGLE place where the Supabase client is created.
// All services import the `supabase` singleton from here — never create
// a second client instance elsewhere.
//
// TO ACTIVATE: Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
// and set VITE_USE_REAL_BACKEND=true.
//
// While VITE_USE_REAL_BACKEND=false (the default), the client is created
// but services will use mock data instead of calling it.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || 'https://placeholder.supabase.co'
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// ── Singleton client ──────────────────────────────────────────────────────────
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Persist the session in localStorage so the user stays logged in
    // across page refreshes. When Zustand's authStore takes over session
    // management you can set this to false.
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Storage key — matches the Zustand persist key for consistency
    storageKey: 'nexus-auth-supabase',
  },
  global: {
    headers: {
      // Custom header so Supabase logs can identify requests from this app
      'X-App-Name': 'AccordCRM',
    },
  },
})

// ── Backend mode flag ─────────────────────────────────────────────────────────
// Centralised switch: when true, service functions use Supabase;
// when false (default), they fall through to mock data.
export const USE_REAL_BACKEND = import.meta.env.VITE_USE_REAL_BACKEND === 'true'

// ── Helper: check if Supabase is properly configured ─────────────────────────
export function isSupabaseConfigured() {
  return (
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseKey !== 'placeholder-key' &&
    supabaseUrl.includes('.supabase.co')
  )
}
