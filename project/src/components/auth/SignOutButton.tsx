'use client'

import { useState } from 'react'
import { useAuthActions } from '@/hooks/useAuthActions'

export function SignOutButton({ className }: { className?: string }) {
  const { signOut } = useAuthActions()
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick() {
    setIsLoading(true)
    await signOut()
    setIsLoading(false)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={
        className ??
        'inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60'
      }
    >
      {isLoading ? 'Signing out...' : 'Sign out'}
    </button>
  )
}
