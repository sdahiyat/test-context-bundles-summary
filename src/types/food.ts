export interface Food {
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
  created_at?: string
}

// Alias for clarity in search contexts
export type FoodSearchResult = Food

export interface FoodSearchResponse {
  foods: FoodSearchResult[]
  total: number
}

export interface MacroSummary {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}

/**
 * Calculate macros for a specific serving size.
 * All per-100g values scaled to the actual serving.
 */
export function calculateMacrosForServing(
  food: Food,
  servingGrams: number
): MacroSummary {
  const ratio = servingGrams / 100
  return {
    calories: Math.round(food.calories_per_100g * ratio * 10) / 10,
    protein: Math.round(food.protein_per_100g * ratio * 10) / 10,
    carbs: Math.round(food.carbs_per_100g * ratio * 10) / 10,
    fat: Math.round(food.fat_per_100g * ratio * 10) / 10,
    fiber: Math.round(food.fiber_per_100g * ratio * 10) / 10,
  }
}
