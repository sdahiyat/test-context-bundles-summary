import { Suspense } from 'react'
import Link from 'next/link'
import ResetPasswordForm from './_components/ResetPasswordForm'

interface ResetPasswordPageProps {
  searchParams: {
    message?: string
  }
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { message } = searchParams

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h1>
        <p className="text-gray-500 text-sm">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">{message}</p>
        </div>
      )}

      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>

      <div className="mt-6 text-center text-sm text-gray-500">
        Remember your password?{' '}
        <Link
          href="/auth/login"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
