import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton browser client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Re-export types for convenience
export type { Database };
export type { SupabaseClient } from '@supabase/supabase-js';
