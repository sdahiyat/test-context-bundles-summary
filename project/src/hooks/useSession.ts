'use client'

import { useAuth } from '@/contexts/AuthContext'
import type { Session, User } from '@supabase/supabase-js'

export interface UseSessionResult {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useSession(): UseSessionResult {
  const { user, session, loading } = useAuth()
  return {
    user,
    session,
    isAuthenticated: user !== null,
    isLoading: loading,
  }
}
