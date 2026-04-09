'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { FoodSearchResult, MacroSummary } from '@/types/food'
import { calculateMacrosForServing } from '@/types/food'
import FoodCard from './FoodCard'
import MacroBar from './MacroBar'

interface FoodSearchProps {
  onFoodSelect: (food: FoodSearchResult, servingGrams: number) => void
  placeholder?: string
  className?: string
}

export default function FoodSearch({
  onFoodSelect,
  placeholder = 'Search for a food...',
  className = '',
}: FoodSearchProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [results, setResults] = useState<FoodSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFood, setSelectedFood] = useState<FoodSearchResult | null>(null)
  const [servingGrams, setServingGrams] = useState<number>(100)
  const [macroPreview, setMacroPreview] = useState<MacroSummary | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/foods/categories')
        if (!res.ok) throw new Error('Failed to load categories')
        const data = await res.json()
        setCategories(data.categories ?? [])
      } catch {
        // Non-critical — categories filter just won't be populated
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  // Update macro preview when food or serving size changes
  useEffect(() => {
    if (selectedFood && servingGrams > 0) {
      setMacroPreview(calculateMacrosForServing(selectedFood, servingGrams))
    } else {
      setMacroPreview(null)
    }
  }, [selectedFood, servingGrams])

  const performSearch = useCallback(async (q: string, cat: string) => {
    if (!q.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ q: q.trim() })
      if (cat) params.set('category', cat)

      const res = await fetch(`/api/foods/search?${params.toString()}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Search failed')
      }
      const data = await res.json()
      setResults(data.foods ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    debounceRef.current = setTimeout(() => {
      performSearch(query, category)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, category, performSearch])

  const handleFoodSelect = (food: FoodSearchResult) => {
    setSelectedFood(food)
    setServingGrams(food.serving_size_g)
  }

  const handleAddFood = () => {
    if (selectedFood && servingGrams > 0) {
      onFoodSelect(selectedFood, servingGrams)
      // Reset after adding
      setSelectedFood(null)
      setQuery('')
      setResults([])
    }
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Search bar row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-500" />
            </div>
          )}
        </div>

        {/* Category filter */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 max-w-[160px]"
        >
          <option value="">All categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Results list */}
      {!selectedFood && (
        <div>
          {!query.trim() && (
            <p className="text-center text-sm text-gray-400 py-8">
              Search for foods above
            </p>
          )}

          {query.trim() && !isLoading && results.length === 0 && !error && (
            <p className="text-center text-sm text-gray-400 py-8">
              No foods found for &ldquo;{query}&rdquo;
            </p>
          )}

          {results.length > 0 && (
            <ul className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
              {results.map(food => (
                <li key={food.id}>
                  <FoodCard
                    food={food}
                    onSelect={handleFoodSelect}
                    showMacros
                    isSelected={selectedFood?.id === food.id}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Selected food: serving size + add */}
      {selectedFood && (
        <div className="rounded-xl border border-primary-200 bg-primary-50 p-4 flex flex-col gap-4">
          {/* Selected food header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{selectedFood.name}</p>
              <p className="text-xs text-gray-500">{selectedFood.category}</p>
            </div>
            <button
              onClick={() => setSelectedFood(null)}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Change
            </button>
          </div>

          {/* Serving size input */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Serving size:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={2000}
                value={servingGrams}
                onChange={e => setServingGrams(Number(e.target.value))}
                className="w-20 rounded-lg border border-gray-300 py-1.5 px-2 text-sm text-center focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-500">g</span>
              <span className="text-xs text-gray-400">
                ({selectedFood.serving_unit} = {selectedFood.serving_size_g}g)
              </span>
            </div>
          </div>

          {/* Macro preview */}
          {macroPreview && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">
                Nutrition for {servingGrams}g:
              </p>
              <MacroBar
                protein={macroPreview.protein}
                carbs={macroPreview.carbs}
                fat={macroPreview.fat}
                calories={macroPreview.calories}
                showLabels
              />
              <div className="mt-2 text-xs text-gray-500 flex gap-3">
                <span>Fiber: {macroPreview.fiber}g</span>
              </div>
            </div>
          )}

          {/* Add button */}
          <button
            onClick={handleAddFood}
            disabled={!servingGrams || servingGrams <= 0}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Food
          </button>
        </div>
      )}
    </div>
  )
}
