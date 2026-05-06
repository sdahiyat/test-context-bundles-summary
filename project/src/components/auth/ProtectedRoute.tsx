'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span
          className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"
          aria-label="Loading"
        />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
