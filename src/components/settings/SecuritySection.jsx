import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react'
import { useSecuritySettings, useUpdateSecurity, useChangePassword } from '../../hooks/useSettings.js'
import { Skeleton } from '../ui/Skeleton.jsx'
import {
  SettingCard, Field, ToggleRow, SaveBar, InfoRow,
  SectionDivider, DangerCard,
} from './SettingsShared.jsx'
import { SESSION_TIMEOUTS } from '../../lib/settingsData.js'

export function SecuritySection() {
  const { data: security, isLoading } = useSecuritySettings()
  const updateMutation   = useUpdateSecurity()
  const passwordMutation = useChangePassword()

  const [form, setForm]       = useState(null)
  const [dirty, setDirty]     = useState(false)
  const [pwForm, setPwForm]   = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw]   = useState({ current: false, next: false, confirm: false })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  useEffect(() => {
    if (security && !form) setForm({ ...security })
  }, [security])

  if (isLoading || !form) return <SecuritySkeleton />

  const toggle = (field) => (val) => {
    setForm((f) => ({ ...f, [field]: val }))
    setDirty(true)
  }

  const setSelect = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setDirty(true)
  }

  const handleSave = async () => {
    await updateMutation.mutateAsync(form)
    setDirty(false)
  }

  const handleCancelSettings = () => {
    setForm({ ...security })
    setDirty(false)
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)

    if (!pwForm.current) { setPwError('Current password is required.'); return }
    if (!pwForm.next)    { setPwError('New password is required.'); return }
    if (pwForm.next.length < 8) { setPwError('Password must be at least 8 characters.'); return }
    if (pwForm.next !== pwForm.confirm) { setPwError('New passwords do not match.'); return }

    try {
      await passwordMutation.mutateAsync({
        currentPassword: pwForm.current,
        newPassword:     pwForm.next,
      })
      setPwSuccess(true)
      setPwForm({ current: '', next: '', confirm: '' })
      setTimeout(() => setPwSuccess(false), 3000)
    } catch (err) {
      setPwError(err.message || 'Failed to change password.')
    }
  }

  const toggleShow = (field) =>
    setShowPw((s) => ({ ...s, [field]: !s[field] }))

  return (
    <div className="space-y-4">
      {/* Security overview */}
      <SettingCard title="Security Overview">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 mb-4">
          {form.twoFactorEnabled
            ? <ShieldCheck size={24} className="text-emerald-500 flex-shrink-0" />
            : <ShieldAlert size={24} className="text-amber-500 flex-shrink-0" />
          }
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {form.twoFactorEnabled ? 'Account is secure' : 'Security can be improved'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {form.twoFactorEnabled
                ? 'Two-factor authentication is enabled.'
                : 'Enable two-factor authentication for stronger security.'}
            </p>
          </div>
        </div>

        <InfoRow label="Last password change" value={form.lastPasswordChange} />
        <InfoRow label="Active sessions"      value={`${form.activeSessions} device${form.activeSessions !== 1 ? 's' : ''}`} />
      </SettingCard>

      {/* Access settings */}
      <SettingCard
        title="Access & Authentication"
        description="Configure how and when you can access your account."
      >
        <ToggleRow
          label="Two-factor authentication"
          description="Require a verification code on every login"
          checked={form.twoFactorEnabled}
          onChange={toggle('twoFactorEnabled')}
        />
        <ToggleRow
          label="Login notification emails"
          description="Email me when a new device logs into my account"
          checked={form.loginNotification}
          onChange={toggle('loginNotification')}
        />

        <SectionDivider label="Session" />

        <Field label="Auto logout after" hint="How long before an idle session is automatically signed out.">
          <select className="input-base" value={form.sessionTimeout} onChange={setSelect('sessionTimeout')}>
            {SESSION_TIMEOUTS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>

        <SaveBar
          onSave={handleSave}
          onCancel={handleCancelSettings}
          isPending={updateMutation.isPending}
          isDirty={dirty}
        />
      </SettingCard>

      {/* Password change */}
      <SettingCard
        title="Change Password"
        description="Use a strong password with at least 8 characters."
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {(['current', 'next', 'confirm']).map((field) => {
            const labels = { current: 'Current Password', next: 'New Password', confirm: 'Confirm New Password' }
            return (
              <div key={field}>
                <label className="label-base">{labels[field]}</label>
                <div className="relative">
                  <input
                    type={showPw[field] ? 'text' : 'password'}
                    className="input-base pr-10"
                    value={pwForm[field]}
                    onChange={(e) => setPwForm((p) => ({ ...p, [field]: e.target.value }))}
                    placeholder="••••••••"
                    autoComplete={field === 'current' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow(field)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw[field] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )
          })}

          {pwError && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{pwError}</p>
          )}
          {pwSuccess && (
            <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2 font-medium">
              ✓ Password changed successfully.
            </p>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="btn-primary py-2 text-sm"
              disabled={passwordMutation.isPending}
            >
              {passwordMutation.isPending
                ? <><Loader2 size={14} className="animate-spin" /> Updating…</>
                : 'Update password'
              }
            </button>
          </div>
        </form>
      </SettingCard>

      {/* Danger zone */}
      <div className="space-y-3">
        <DangerCard
          title="Sign out of all devices"
          description="This will end all active sessions except your current one."
          buttonLabel="Sign out everywhere"
          onAction={() => window.alert('This would sign out all other sessions.')}
        />
        <DangerCard
          title="Delete account"
          description="Permanently delete your account and all associated data. This cannot be undone."
          buttonLabel="Delete account"
          onAction={() => window.alert('Account deletion would require confirmation via email.')}
        />
      </div>
    </div>
  )
}

function SecuritySkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="h-16 w-full rounded-xl mb-4" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50">
          <div className="space-y-1.5"><Skeleton className="h-3.5 w-40" /><Skeleton className="h-3 w-56" /></div>
          <Skeleton className="w-9 h-5 rounded-full flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}
