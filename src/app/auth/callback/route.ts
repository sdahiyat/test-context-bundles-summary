import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }

    return NextResponse.redirect(
      `${origin}/auth/login?message=${encodeURIComponent(
        error.message || 'Could not complete authentication. Please try again.'
      )}`
    )
  }

  return NextResponse.redirect(
    `${origin}/auth/login?message=${encodeURIComponent('Invalid confirmation link.')}`
  )
}
