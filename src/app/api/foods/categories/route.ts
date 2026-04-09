import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('foods')
      .select('category')
      .order('category')

    if (error) {
      console.error('Categories fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      )
    }

    const uniqueCategories = Array.from(
      new Set((data ?? []).map((row: { category: string }) => row.category))
    ).sort()

    return NextResponse.json({ categories: uniqueCategories })
  } catch (err) {
    console.error('Unexpected error fetching categories:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
