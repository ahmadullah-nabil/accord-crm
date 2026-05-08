import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore.js'
import { Spinner } from '../../components/ui/Spinner.jsx'

const DEMO_ACCOUNTS = [
  { role: 'Admin',     email: 'admin@nexuscrm.io',   password: 'admin123'   },
  { role: 'AGM',       email: 'agm@nexuscrm.io',     password: 'agm123'     },
  { role: 'Manager',   email: 'manager@nexuscrm.io', password: 'manager123' },
  { role: 'Executive', email: 'exec@nexuscrm.io',    password: 'exec123'    },
]

export function LoginPage() {
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [formError, setFormError] = useState('')

  const { login, isLoading, error, clearError } = useAuthStore()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!email.trim())    { setFormError('Email is required.');    return }
    if (!password.trim()) { setFormError('Password is required.'); return }

    const result = await login(email.trim().toLowerCase(), password)
    if (result.success) {
      navigate(from, { replace: true })
    }
  }

  const fillDemo = (account) => {
    setEmail(account.email)
    setPassword(account.password)
    setFormError('')
    clearError()
  }

  const displayError = formError || error

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="font-display font-700 text-2xl text-gray-900 mb-1.5">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500">
          Sign in to your workspace to continue.
        </p>
      </div>

      {/* Demo accounts */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
          Quick demo access
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.role}
              type="button"
              onClick={() => fillDemo(acc)}
              className="text-left px-3 py-2 rounded-xl border border-gray-200 hover:border-teal-300
                         hover:bg-teal-50 transition-all duration-150 group"
            >
              <span className="block text-xs font-semibold text-gray-700 group-hover:text-teal-700">
                {acc.role}
              </span>
              <span className="block text-[11px] text-gray-400 truncate">{acc.email}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-gray-400">or sign in manually</span>
        </div>
      </div>

      {/* Error alert */}
      {displayError && (
        <div className="mb-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm animate-fade-in">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{displayError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label htmlFor="email" className="label-base">
            Email address
          </label>
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
              onChange={(e) => { setEmail(e.target.value); setFormError(''); clearError() }}
              placeholder="you@company.com"
              className="input-base pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="label-base mb-0">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-teal-600 hover:text-teal-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFormError(''); clearError() }}
              placeholder="••••••••"
              className="input-base pl-10 pr-11"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full mt-2"
        >
          {isLoading ? (
            <>
              <Spinner size="sm" color="white" />
              <span>Signing in…</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default LoginPage
