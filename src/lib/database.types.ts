export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
export type Goal = 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'gain_muscle';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          date_of_birth: string | null;
          gender: Gender | null;
          height_cm: number | null;
          activity_level: ActivityLevel | null;
          goal: Goal | null;
          target_calories: number | null;
          target_protein_g: number | null;
          target_carbs_g: number | null;
          target_fat_g: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          gender?: Gender | null;
          height_cm?: number | null;
          activity_level?: ActivityLevel | null;
          goal?: Goal | null;
          target_calories?: number | null;
          target_protein_g?: number | null;
          target_carbs_g?: number | null;
          target_fat_g?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          gender?: Gender | null;
          height_cm?: number | null;
          activity_level?: ActivityLevel | null;
          goal?: Goal | null;
          target_calories?: number | null;
          target_protein_g?: number | null;
          target_carbs_g?: number | null;
          target_fat_g?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      foods: {
        Row: {
          id: string;
          name: string;
          brand: string | null;
          serving_size_g: number;
          calories_per_100g: number;
          protein_per_100g: number;
          carbs_per_100g: number;
          fat_per_100g: number;
          fiber_per_100g: number | null;
          sugar_per_100g: number | null;
          sodium_per_100mg: number | null;
          is_verified: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          brand?: string | null;
          serving_size_g?: number;
          calories_per_100g: number;
          protein_per_100g?: number;
          carbs_per_100g?: number;
          fat_per_100g?: number;
          fiber_per_100g?: number | null;
          sugar_per_100g?: number | null;
          sodium_per_100mg?: number | null;
          is_verified?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          brand?: string | null;
          serving_size_g?: number;
          calories_per_100g?: number;
          protein_per_100g?: number;
          carbs_per_100g?: number;
          fat_per_100g?: number;
          fiber_per_100g?: number | null;
          sugar_per_100g?: number | null;
          sodium_per_100mg?: number | null;
          is_verified?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          meal_type: MealType;
          logged_at: string;
          notes: string | null;
          photo_url: string | null;
          ai_generated: boolean;
          total_calories: number | null;
          total_protein_g: number | null;
          total_carbs_g: number | null;
          total_fat_g: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          meal_type: MealType;
          logged_at?: string;
          notes?: string | null;
          photo_url?: string | null;
          ai_generated?: boolean;
          total_calories?: number | null;
          total_protein_g?: number | null;
          total_carbs_g?: number | null;
          total_fat_g?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          meal_type?: MealType;
          logged_at?: string;
          notes?: string | null;
          photo_url?: string | null;
          ai_generated?: boolean;
          total_calories?: number | null;
          total_protein_g?: number | null;
          total_carbs_g?: number | null;
          total_fat_g?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      meal_items: {
        Row: {
          id: string;
          meal_id: string;
          food_id: string;
          quantity_g: number;
          calories: number;
          protein_g: number;
          carbs_g: number;
          fat_g: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          meal_id: string;
          food_id: string;
          quantity_g: number;
          calories: number;
          protein_g?: number;
          carbs_g?: number;
          fat_g?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          meal_id?: string;
          food_id?: string;
          quantity_g?: number;
          calories?: number;
          protein_g?: number;
          carbs_g?: number;
          fat_g?: number;
          created_at?: string;
        };
      };
      weight_logs: {
        Row: {
          id: string;
          user_id: string;
          weight_kg: number;
          logged_at: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          weight_kg: number;
          logged_at?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          weight_kg?: number;
          logged_at?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience row type exports
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Food = Database['public']['Tables']['foods']['Row'];
export type Meal = Database['public']['Tables']['meals']['Row'];
export type MealItem = Database['public']['Tables']['meal_items']['Row'];
export type WeightLog = Database['public']['Tables']['weight_logs']['Row'];

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type FoodInsert = Database['public']['Tables']['foods']['Insert'];
export type MealInsert = Database['public']['Tables']['meals']['Insert'];
export type MealItemInsert = Database['public']['Tables']['meal_items']['Insert'];
export type WeightLogInsert = Database['public']['Tables']['weight_logs']['Insert'];

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type FoodUpdate = Database['public']['Tables']['foods']['Update'];
export type MealUpdate = Database['public']['Tables']['meals']['Update'];
export type MealItemUpdate = Database['public']['Tables']['meal_items']['Update'];
export type WeightLogUpdate = Database['public']['Tables']['weight_logs']['Update'];
