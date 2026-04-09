import { Suspense } from 'react'
import Link from 'next/link'
import SignupForm from './_components/SignupForm'

interface SignupPageProps {
  searchParams: {
    message?: string
  }
}

export default function SignupPage({ searchParams }: SignupPageProps) {
  const { message } = searchParams

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
        <p className="text-gray-500 text-sm">Start tracking your nutrition today — it&apos;s free</p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">{message}</p>
        </div>
      )}

      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>

      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
