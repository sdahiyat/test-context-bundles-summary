'use client'

import { useState } from 'react'
import FoodSearch from '@/components/food/FoodSearch'
import FoodCard from '@/components/food/FoodCard'
import MacroBar from '@/components/food/MacroBar'
import { calculateMacrosForServing } from '@/types/food'
import type { FoodSearchResult } from '@/types/food'

interface SelectedFoodState {
  food: FoodSearchResult
  servingGrams: number
}

export default function FoodsPage() {
  const [selection, setSelection] = useState<SelectedFoodState | null>(null)

  const handleFoodSelect = (food: FoodSearchResult, servingGrams: number) => {
    setSelection({ food, servingGrams })
  }

  const macros = selection
    ? calculateMacrosForServing(selection.food, selection.servingGrams)
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Food Database</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse and search our database of 200+ foods with nutritional information
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Search */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Search Foods</h2>
              <FoodSearch
                onFoodSelect={handleFoodSelect}
                placeholder="e.g. chicken breast, apple, oats..."
              />
            </div>
          </div>

          {/* Right: Selected food preview */}
          <div>
            {selection && macros ? (
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-700">Selected Food</h2>
                  <button
                    onClick={() => setSelection(null)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                  >
                    Clear
                  </button>
                </div>

                <FoodCard
                  food={selection.food}
                  showMacros
                  servingGrams={selection.servingGrams}
                  isSelected
                />

                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Macro breakdown for {selection.servingGrams}g:
                  </p>
                  <MacroBar
                    protein={macros.protein}
                    carbs={macros.carbs}
                    fat={macros.fat}
                    calories={macros.calories}
                    showLabels
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Serving</p>
                    <p className="font-semibold text-gray-900">
                      {selection.servingGrams}g
                    </p>
                    <p className="text-xs text-gray-400">
                      ({selection.food.serving_unit})
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Fiber</p>
                    <p className="font-semibold text-gray-900">{macros.fiber}g</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 flex flex-col items-center justify-center text-center min-h-[260px]">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-600">No food selected</p>
                <p className="text-xs text-gray-400 mt-1">
                  Search for a food and click to view nutrition details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
