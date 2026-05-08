import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore.js'
import {
  AuthField, PasswordField, AuthAlert, AuthDivider,
  DemoAccountPicker, RememberMe, AuthSubmitButton,
} from '../../components/auth/AuthShared.jsx'

export function LoginPage() {
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [formError, setFormError] = useState('')

  const { login, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from     = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!email.trim())    { setFormError('Email is required.');    return }
    if (!password.trim()) { setFormError('Password is required.'); return }

    const result = await login(email.trim().toLowerCase(), password, rememberMe)

    if (result.success) {
      navigate(from, { replace: true })
    } else if (result.needsVerification) {
      navigate('/verify-email')
    }
  }

  const fillDemo = (acc) => {
    setEmail(acc.email)
    setPassword(acc.password)
    setFormError('')
    clearError()
  }

  const displayError = formError || error

  return (
    <div className="p-8">
      {/* Heading */}
      <div className="mb-7">
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-1.5">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500">
          Sign in to your workspace to continue.
        </p>
      </div>

      {/* Demo account pills */}
      <DemoAccountPicker onSelect={fillDemo} />

      <AuthDivider label="or sign in manually" />

      {/* Error */}
      {displayError && (
        <AuthAlert type="error" message={displayError} className="mb-4" />
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email */}
        <AuthField label="Email address" id="email" icon={Mail}>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFormError(''); clearError() }}
            placeholder="you@company.com"
            disabled={isLoading}
          />
        </AuthField>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="label-base mb-0">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs text-teal-600 hover:text-teal-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordField
            id="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setFormError(''); clearError() }}
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>

        {/* Remember me */}
        <RememberMe checked={rememberMe} onChange={setRememberMe} />

        {/* Submit */}
        <AuthSubmitButton
          isLoading={isLoading}
          label="Sign in"
          loadingLabel="Signing in…"
          icon={ArrowRight}
        />
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-semibold">
          Sign up free
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
