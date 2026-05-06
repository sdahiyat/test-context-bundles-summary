'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type ActionResult = { error: AuthError | null }

function getSiteUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

export function useAuthActions() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function signUp(email: string, password: string): Promise<ActionResult> {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/confirm`,
      },
    })
    setIsLoading(false)
    return { error }
  }

  async function signIn(email: string, password: string): Promise<ActionResult> {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setIsLoading(false)
    return { error }
  }

  async function signOut(): Promise<ActionResult> {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    setIsLoading(false)
    if (!error) {
      router.push('/login')
      router.refresh()
    }
    return { error }
  }

  async function resetPassword(email: string): Promise<ActionResult> {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/reset-password`,
    })
    setIsLoading(false)
    return { error }
  }

  return { signUp, signIn, signOut, resetPassword, isLoading }
}
