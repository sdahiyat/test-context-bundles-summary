'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'

function FullscreenSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <span
        role="status"
        aria-label="Loading"
        className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"
      />
    </div>
  )
}

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      const target = `/login?redirectTo=${encodeURIComponent(pathname || '/')}`
      router.push(target)
    }
  }, [loading, user, pathname, router])

  if (loading || !user) {
    return <FullscreenSpinner />
  }

  return <>{children}</>
}
