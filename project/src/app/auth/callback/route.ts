import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    const redirectUrl = new URL('/login', origin)
    redirectUrl.searchParams.set('error', errorDescription ?? error)
    return NextResponse.redirect(redirectUrl)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      return NextResponse.redirect(new URL(next, origin))
    }

    const redirectUrl = new URL('/login', origin)
    redirectUrl.searchParams.set('error', exchangeError.message)
    return NextResponse.redirect(redirectUrl)
  }

  const redirectUrl = new URL('/login', origin)
  redirectUrl.searchParams.set('error', 'missing_code')
  return NextResponse.redirect(redirectUrl)
}
