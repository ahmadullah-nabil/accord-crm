import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore.js'
import {
  PasswordField, AuthAlert, AuthSubmitButton,
  PasswordStrengthMeter,
} from '../../components/auth/AuthShared.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'

export function ResetPasswordPage() {
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [success,   setSuccess]   = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const { resetPassword, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // In production: token comes from Supabase magic link query param
  const token = searchParams.get('token') || 'demo-reset-token'
  const hasToken = Boolean(token)

  const validate = () => {
    const errs = {}
    if (!password)           errs.password = 'Password is required.'
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters.'
    if (!confirm)            errs.confirm  = 'Please confirm your password.'
    else if (password !== confirm) errs.confirm = 'Passwords do not match.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    const errs = validate()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    const result = await resetPassword(token, password)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    }
  }

  // ── Invalid/missing token ─────────────────────────────────────────────────
  if (!hasToken) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Link expired</h2>
        <p className="text-sm text-gray-500 mb-6">
          This password reset link is invalid or has expired.
        </p>
        <Link to="/forgot-password" className="btn-primary inline-flex">
          Request a new link
        </Link>
      </div>
    )
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-1 ring-teal-200">
          <CheckCircle size={28} className="text-teal-500" />
        </div>
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">
          Password updated
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Your password has been changed. Redirecting to sign in…
        </p>
        <div className="flex justify-center">
          <Spinner size="sm" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Heading */}
      <div className="mb-7">
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-1.5">
          Set new password
        </h2>
        <p className="text-sm text-gray-500">
          Choose a strong, unique password for your account.
        </p>
      </div>

      {/* Error from store */}
      {error && <AuthAlert type="error" message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* New password */}
        <div>
          <PasswordField
            label="New password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setFieldErrors((fe) => { const n = { ...fe }; delete n.password; return n })
              clearError()
            }}
            error={fieldErrors.password}
            placeholder="Minimum 8 characters"
            disabled={isLoading}
            autoComplete="new-password"
          />
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Confirm password */}
        <PasswordField
          label="Confirm password"
          id="confirm"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value)
            setFieldErrors((fe) => { const n = { ...fe }; delete n.confirm; return n })
          }}
          error={fieldErrors.confirm}
          placeholder="Repeat your new password"
          disabled={isLoading}
          autoComplete="new-password"
        />

        {/* Password rules hint */}
        <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
          {[
            { rule: password.length >= 8,           text: 'At least 8 characters' },
            { rule: /[A-Z]/.test(password),          text: 'One uppercase letter' },
            { rule: /[0-9]/.test(password),          text: 'One number' },
          ].map(({ rule, text }) => (
            <p key={text} className={`text-xs flex items-center gap-2
              ${rule ? 'text-emerald-600' : 'text-gray-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                ${rule ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              {text}
            </p>
          ))}
        </div>

        <AuthSubmitButton
          isLoading={isLoading}
          label="Update password"
          loadingLabel="Updating…"
        />
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
          Back to sign in
        </Link>
      </div>
    </div>
  )
}

export default ResetPasswordPage
