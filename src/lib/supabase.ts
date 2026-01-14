import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Client-side Supabase client
 * Uses the publishable key (sb_publishable_...) which is safe to expose in browser
 * This client respects Row Level Security (RLS) policies
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Server-side Supabase client
 * Uses the service role key (sb_secret_...) which bypasses RLS
 * ONLY use this for server-side operations that need elevated privileges
 * Never expose this key in client-side code
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Type exports for convenience
export type SupabaseClient = typeof supabase;
export type SupabaseAdminClient = typeof supabaseAdmin;

export default supabase;
