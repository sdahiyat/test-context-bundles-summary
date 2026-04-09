export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say'
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active'
export type Goal = 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          avatar_url: string | null
          date_of_birth: string | null
          gender: Gender | null
          height_cm: number | null
          weight_kg: number | null
          activity_level: ActivityLevel | null
          goal: Goal | null
          target_calories: number | null
          target_protein_g: number | null
          target_carbs_g: number | null
          target_fat_g: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          gender?: Gender | null
          height_cm?: number | null
          weight_kg?: number | null
          activity_level?: ActivityLevel | null
          goal?: Goal | null
          target_calories?: number | null
          target_protein_g?: number | null
          target_carbs_g?: number | null
          target_fat_g?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      foods: {
        Row: {
          id: string
          name: string
          category: string
          calories_per_100g: number
          protein_per_100g: number
          carbs_per_100g: number
          fat_per_100g: number
          fiber_per_100g: number
          serving_size_g: number
          serving_unit: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          calories_per_100g: number
          protein_per_100g: number
          carbs_per_100g: number
          fat_per_100g: number
          fiber_per_100g: number
          serving_size_g: number
          serving_unit: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['foods']['Insert']>
      }
      meals: {
        Row: {
          id: string
          user_id: string
          meal_type: MealType
          logged_at: string
          notes: string | null
          photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meal_type: MealType
          logged_at?: string
          notes?: string | null
          photo_url?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['meals']['Insert']>
      }
      meal_items: {
        Row: {
          id: string
          meal_id: string
          food_id: string
          serving_size_g: number
          calories: number
          protein_g: number
          carbs_g: number
          fat_g: number
          fiber_g: number
          created_at: string
        }
        Insert: {
          id?: string
          meal_id: string
          food_id: string
          serving_size_g: number
          calories: number
          protein_g: number
          carbs_g: number
          fat_g: number
          fiber_g: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['meal_items']['Insert']>
      }
      weight_logs: {
        Row: {
          id: string
          user_id: string
          weight_kg: number
          logged_at: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weight_kg: number
          logged_at?: string
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['weight_logs']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      gender: Gender
      activity_level: ActivityLevel
      goal: Goal
      meal_type: MealType
    }
  }
}
