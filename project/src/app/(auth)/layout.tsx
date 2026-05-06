import Link from 'next/link'
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4">
      <Link
        href="/"
        className="text-3xl font-bold text-primary-600 mb-8"
      >
        NutriTrack
      </Link>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {children}
      </div>
    </div>
  )
}
