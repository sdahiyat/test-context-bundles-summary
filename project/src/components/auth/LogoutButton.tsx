'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface LogoutButtonProps {
  className?: string
  children?: React.ReactNode
}

export default function LogoutButton({ className, children }: LogoutButtonProps) {
  const { signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick() {
    setIsLoading(true)
    try {
      await signOut()
    } catch {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={className ?? 'btn-secondary disabled:opacity-60 disabled:cursor-not-allowed'}
    >
      {isLoading ? 'Signing out...' : (children ?? 'Sign out')}
    </button>
  )
}
