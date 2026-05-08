import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { Spinner } from '../../components/ui/Spinner.jsx'

export function ForgotPasswordPage() {
  const [email,     setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) { setError('Email is required.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address.'); return }

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000)) // simulate API
    setIsLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-8 text-center">
        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-teal-500" />
        </div>
        <h2 className="font-display font-700 text-2xl text-gray-900 mb-2">Check your inbox</h2>
        <p className="text-sm text-gray-500 mb-6">
          We sent a password reset link to <strong className="text-gray-700">{email}</strong>.
          Check your email to proceed.
        </p>
        <Link to="/login" className="btn-primary inline-flex">
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="font-display font-700 text-2xl text-gray-900 mb-1.5">
          Reset password
        </h2>
        <p className="text-sm text-gray-500">
          Enter your work email and we'll send you a reset link.
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="label-base">Email address</label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="you@company.com"
              className="input-base pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading ? (
            <><Spinner size="sm" color="white" /><span>Sending…</span></>
          ) : (
            <span>Send reset link</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium">
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
