import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, CheckCircle, ArrowRight, RefreshCw, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore.js'
import { AuthAlert }    from '../../components/auth/AuthShared.jsx'
import { Spinner }      from '../../components/ui/Spinner.jsx'

export function EmailVerificationPage() {
  const {
    pendingVerificationEmail,
    verifyEmail,
    resendVerification,
    clearPendingVerification,
    isLoading,
  } = useAuthStore()

  const [resent,   setResent]   = useState(false)
  const [verified, setVerified] = useState(false)
  const [alert,    setAlert]    = useState(null)
  const navigate = useNavigate()

  // If no pending email (e.g. navigated here directly), redirect to login
  if (!pendingVerificationEmail && !verified) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-gray-500 mb-4">No pending verification found.</p>
        <Link to="/login" className="btn-primary inline-flex">
          Back to login
        </Link>
      </div>
    )
  }

  const handleResend = async () => {
    setAlert(null)
    setResent(false)
    const result = await resendVerification(pendingVerificationEmail)
    if (result.success) {
      setResent(true)
      setTimeout(() => setResent(false), 4000)
    } else {
      setAlert({ type: 'error', message: 'Could not resend. Please try again.' })
    }
  }

  // Mock "I've verified my email" button — in production this is automatic via Supabase callback
  const handleSimulateVerify = async () => {
    setAlert(null)
    const result = await verifyEmail(pendingVerificationEmail)
    if (result.success) {
      setVerified(true)
      setTimeout(() => navigate('/login'), 2500)
    }
  }

  if (verified) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-1 ring-teal-200">
          <CheckCircle size={30} className="text-teal-500" />
        </div>
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Email verified!</h2>
        <p className="text-sm text-gray-500 mb-1">Your account is ready. Redirecting to login…</p>
        <div className="flex justify-center mt-4">
          <Spinner size="sm" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center ring-1 ring-teal-200">
          <Mail size={28} className="text-teal-500" />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-6">
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-1.5">
          Check your email
        </h2>
        <p className="text-sm text-gray-500">
          We sent a verification link to
        </p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5">
          {pendingVerificationEmail}
        </p>
      </div>

      {/* Steps */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
        {[
          'Open the email from AccordCRM',
          'Click the "Verify email" link',
          'Return here and sign in',
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-bold
              flex items-center justify-center flex-shrink-0">
              {i + 1}
            </span>
            <span className="text-sm text-gray-700">{step}</span>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {alert && <AuthAlert type={alert.type} message={alert.message} className="mb-4" />}
      {resent && (
        <AuthAlert type="success" message="Verification email resent! Check your inbox." className="mb-4" />
      )}

      {/* Simulate verify (demo only) */}
      <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider mb-2">
          Demo mode
        </p>
        <p className="text-xs text-amber-600 mb-3">
          In production a real email is sent. For this demo, click below to simulate verification.
        </p>
        <button
          type="button"
          onClick={handleSimulateVerify}
          disabled={isLoading}
          className="btn-primary w-full py-2 text-sm"
        >
          {isLoading ? (
            <><Spinner size="sm" color="white" /> Verifying…</>
          ) : (
            <><CheckCircle size={14} /> Simulate email verification</>
          )}
        </button>
      </div>

      {/* Resend */}
      <button
        type="button"
        onClick={handleResend}
        disabled={isLoading || resent}
        className="btn-secondary w-full mb-3 text-sm gap-1.5"
      >
        <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        Resend verification email
      </button>

      {/* Back + change email */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <button
          type="button"
          onClick={() => { clearPendingVerification(); navigate('/login') }}
          className="inline-flex items-center gap-1 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={13} /> Back to login
        </button>
        <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-medium">
          Use different email
        </Link>
      </div>
    </div>
  )
}

export default EmailVerificationPage
