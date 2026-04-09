import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton browser client for use in client components
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side admin client — only call from server components or API routes
export function createServerSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Re-export Database type and all named types for convenience
export type { Database } from './database.types';
export type {
  Profile,
  Food,
  Meal,
  MealItem,
  WeightLog,
  ProfileInsert,
  FoodInsert,
  MealInsert,
  MealItemInsert,
  WeightLogInsert,
  ProfileUpdate,
  FoodUpdate,
  MealUpdate,
  MealItemUpdate,
  WeightLogUpdate,
  Gender,
  ActivityLevel,
  Goal,
  MealType,
} from './database.types';
