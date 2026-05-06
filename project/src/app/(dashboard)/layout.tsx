import Link from 'next/link'
import type { ReactNode } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SignOutButton } from '@/components/auth/SignOutButton'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/dashboard" className="text-xl font-bold text-primary-600">
              NutriTrack
            </Link>
            <SignOutButton />
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
