'use client'

import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const COOLDOWN_SECONDS = 60

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setIsLoading(true)
    // Don't surface backend errors to avoid email enumeration; we still call it.
    await resetPassword(email)
    setIsLoading(false)
    setSubmitted(true)
    setCooldown(COOLDOWN_SECONDS)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h1>
      <p className="text-gray-600 mb-6">
        Enter the email associated with your account and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
          />
        </div>

        {error && (
          <div role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {submitted && (
          <div role="status" className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
            If that email is registered, you will receive a reset link shortly.
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || cooldown > 0}
          className="btn-primary w-full flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading
            ? 'Sending...'
            : cooldown > 0
              ? `Try again in ${cooldown}s`
              : 'Send reset link'}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-6 text-center">
        Remembered it?{' '}
        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
