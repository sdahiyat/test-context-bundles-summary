'use client'

import { calculateMacrosForServing } from '@/types/food'
import type { FoodSearchResult } from '@/types/food'

interface FoodCardProps {
  food: FoodSearchResult
  onSelect?: (food: FoodSearchResult) => void
  showMacros?: boolean
  servingGrams?: number
  isSelected?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  'Fruits': 'bg-green-100 text-green-700',
  'Vegetables': 'bg-emerald-100 text-emerald-700',
  'Meat & Poultry': 'bg-red-100 text-red-700',
  'Fish & Seafood': 'bg-blue-100 text-blue-700',
  'Dairy & Eggs': 'bg-yellow-100 text-yellow-700',
  'Grains & Cereals': 'bg-amber-100 text-amber-700',
  'Legumes & Beans': 'bg-lime-100 text-lime-700',
  'Nuts & Seeds': 'bg-orange-100 text-orange-700',
  'Snacks & Sweets': 'bg-pink-100 text-pink-700',
  'Beverages': 'bg-cyan-100 text-cyan-700',
  'Condiments & Sauces': 'bg-purple-100 text-purple-700',
  'Oils & Fats': 'bg-stone-100 text-stone-700',
}

export default function FoodCard({
  food,
  onSelect,
  showMacros = true,
  servingGrams,
  isSelected = false,
}: FoodCardProps) {
  const macros = servingGrams
    ? calculateMacrosForServing(food, servingGrams)
    : {
        calories: Math.round(food.calories_per_100g * 10) / 10,
        protein: Math.round(food.protein_per_100g * 10) / 10,
        carbs: Math.round(food.carbs_per_100g * 10) / 10,
        fat: Math.round(food.fat_per_100g * 10) / 10,
        fiber: Math.round(food.fiber_per_100g * 10) / 10,
      }

  const categoryColor = CATEGORY_COLORS[food.category] ?? 'bg-gray-100 text-gray-700'
  const servingLabel = servingGrams
    ? `per ${servingGrams}g`
    : 'per 100g'

  return (
    <div
      className={[
        'p-3 rounded-lg border transition-all duration-150',
        onSelect ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100' : '',
        isSelected ? 'ring-2 ring-primary-500 border-primary-300 bg-primary-50' : 'border-gray-200 bg-white',
      ].join(' ')}
      onClick={() => onSelect?.(food)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 truncate">{food.name}</p>
          <span
            className={`inline-block text-xs font-medium px-1.5 py-0.5 rounded mt-0.5 ${categoryColor}`}
          >
            {food.category}
          </span>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-gray-900 text-sm">
            {macros.calories} <span className="text-xs font-normal text-gray-500">kcal</span>
          </p>
          <p className="text-xs text-gray-400">{servingLabel}</p>
        </div>
      </div>

      {showMacros && (
        <div className="mt-2 grid grid-cols-4 gap-1 text-center">
          <div className="bg-blue-50 rounded p-1">
            <p className="text-xs font-semibold text-blue-700">{macros.protein}g</p>
            <p className="text-xs text-blue-500">Protein</p>
          </div>
          <div className="bg-amber-50 rounded p-1">
            <p className="text-xs font-semibold text-amber-700">{macros.carbs}g</p>
            <p className="text-xs text-amber-500">Carbs</p>
          </div>
          <div className="bg-red-50 rounded p-1">
            <p className="text-xs font-semibold text-red-700">{macros.fat}g</p>
            <p className="text-xs text-red-500">Fat</p>
          </div>
          <div className="bg-green-50 rounded p-1">
            <p className="text-xs font-semibold text-green-700">{macros.fiber}g</p>
            <p className="text-xs text-green-500">Fiber</p>
          </div>
        </div>
      )}
    </div>
  )
}
