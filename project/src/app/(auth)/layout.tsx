import Link from 'next/link'
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            NutriTrack
          </Link>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-sm">{children}</div>
      </div>
    </div>
  )
}
