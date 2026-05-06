'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useAuthActions } from '@/hooks/useAuthActions'

export function ForgotPasswordForm() {
  const { resetPassword } = useAuthActions()

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    await resetPassword(email)
    setIsLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-lg font-semibold text-gray-900">Check your email</h2>
        <p className="text-sm text-gray-600">
          If an account exists with this email, you will receive a reset link.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            aria-label="Loading"
          />
        ) : (
          'Send reset link'
        )}
      </button>

      <p className="text-center text-sm text-gray-600">
        <Link
          href="/login"
          className="font-medium text-primary-600 hover:text-primary-500"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  )
}
