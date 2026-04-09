import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { FoodSearchResult } from '@/types/food'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const category = searchParams.get('category')
  const limitParam = searchParams.get('limit')

  if (!q || q.trim() === '') {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    )
  }

  const searchQuery = q.trim()
  const limit = Math.min(parseInt(limitParam ?? '20', 10) || 20, 50)

  try {
    let query = supabase
      .from('foods')
      .select(
        'id, name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, serving_size_g, serving_unit'
      )
      .ilike('name', `%${searchQuery}%`)

    if (category && category.trim() !== '') {
      query = query.eq('category', category.trim())
    }

    // Fetch more than limit to allow JS-side relevance sorting
    const { data, error } = await query.order('name').limit(50)

    if (error) {
      console.error('Food search error:', error)
      return NextResponse.json(
        { error: 'Failed to search foods' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ foods: [], total: 0 })
    }

    // Relevance ranking: exact > starts-with > contains
    const lowerQ = searchQuery.toLowerCase()

    const ranked = (data as FoodSearchResult[]).sort((a, b) => {
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()

      const aExact = aName === lowerQ
      const bExact = bName === lowerQ
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1

      const aStarts = aName.startsWith(lowerQ)
      const bStarts = bName.startsWith(lowerQ)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1

      return a.name.localeCompare(b.name)
    })

    const results = ranked.slice(0, limit)

    return NextResponse.json({ foods: results, total: results.length })
  } catch (err) {
    console.error('Unexpected error in food search:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
