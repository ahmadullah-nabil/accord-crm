import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { Spinner } from '../../components/ui/Spinner.jsx'

export function ResetPasswordPage() {
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [error,     setError]     = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!password)              { setError('Password is required.'); return }
    if (password.length < 8)    { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm)   { setError('Passwords do not match.'); return }

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
    setSuccess(true)
    setTimeout(() => navigate('/login'), 2000)
  }

  if (success) {
    return (
      <div className="p-8 text-center">
        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-teal-500" />
        </div>
        <h2 className="font-display font-700 text-2xl text-gray-900 mb-2">Password updated</h2>
        <p className="text-sm text-gray-500">Redirecting you to login…</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="font-display font-700 text-2xl text-gray-900 mb-1.5">
          Set new password
        </h2>
        <p className="text-sm text-gray-500">
          Choose a strong password for your account.
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
          <label htmlFor="password" className="label-base">New password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="Minimum 8 characters"
              className="input-base pl-10 pr-11"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm" className="label-base">Confirm password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              id="confirm"
              type={showPass ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError('') }}
              placeholder="Repeat your password"
              className="input-base pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading
            ? <><Spinner size="sm" color="white" /><span>Updating…</span></>
            : <span>Update password</span>
          }
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
          Back to login
        </Link>
      </div>
    </div>
  )
}

export default ResetPasswordPage
