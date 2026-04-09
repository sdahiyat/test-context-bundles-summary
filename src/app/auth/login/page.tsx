import { Suspense } from 'react'
import Link from 'next/link'
import LoginForm from './_components/LoginForm'

interface LoginPageProps {
  searchParams: {
    redirectTo?: string
    message?: string
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo, message } = searchParams

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-500 text-sm">Sign in to continue tracking your nutrition</p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">{message}</p>
        </div>
      )}

      <Suspense fallback={null}>
        <LoginForm redirectTo={redirectTo} />
      </Suspense>

      <div className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/signup"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Sign up for free
        </Link>
      </div>
    </div>
  )
}
