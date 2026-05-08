import React, { useState, useEffect } from 'react'
import { useProfileSettings, useUpdateProfile } from '../../hooks/useSettings.js'
import { useAuthStore }    from '../../stores/authStore.js'
import { Avatar }          from '../ui/Avatar.jsx'
import { Skeleton }        from '../ui/Skeleton.jsx'
import {
  SettingCard, Field, FieldGrid, SaveBar, SectionDivider,
} from './SettingsShared.jsx'
import { TIMEZONES, LANGUAGES, DATE_FORMATS } from '../../lib/settingsData.js'

export function ProfileSection() {
  const { data: profile, isLoading } = useProfileSettings()
  const updateMutation = useUpdateProfile()
  const { updateUser } = useAuthStore()

  const [form, setForm]   = useState(null)
  const [dirty, setDirty] = useState(false)

  // Hydrate form when data arrives
  useEffect(() => {
    if (profile && !form) {
      setForm({ ...profile })
    }
  }, [profile])

  if (isLoading || !form) return <ProfileSkeleton />

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setDirty(true)
  }

  const handleSave = async () => {
    await updateMutation.mutateAsync(form)
    // Sync name back to authStore so Navbar/Avatar updates immediately
    updateUser({ name: form.name, email: form.email, department: form.department })
    setDirty(false)
  }

  const handleCancel = () => {
    setForm({ ...profile })
    setDirty(false)
  }

  return (
    <div className="space-y-4">
      {/* Avatar + name preview */}
      <SettingCard title="Profile Information" description="Update your personal details and contact information.">
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={form.name} size="2xl" />
          <div>
            <p className="font-semibold text-gray-900 text-base">{form.name}</p>
            <p className="text-sm text-gray-500">{form.title} · {form.department}</p>
            <button className="text-xs text-teal-600 hover:text-teal-700 font-medium mt-1.5 transition-colors">
              Change avatar
            </button>
          </div>
        </div>

        <FieldGrid cols={2}>
          <Field label="Full Name" required>
            <input className="input-base" value={form.name} onChange={set('name')} placeholder="Alex Rivera" />
          </Field>
          <Field label="Email Address" required>
            <input type="email" className="input-base" value={form.email} onChange={set('email')} placeholder="alex@accord.io" />
          </Field>
          <Field label="Phone Number">
            <input type="tel" className="input-base" value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" />
          </Field>
          <Field label="Job Title">
            <input className="input-base" value={form.title} onChange={set('title')} placeholder="Sales Manager" />
          </Field>
          <Field label="Department">
            <input className="input-base" value={form.department} onChange={set('department')} placeholder="Sales" />
          </Field>
        </FieldGrid>

        <SectionDivider label="About" />

        <Field label="Bio" hint="Brief description shown on your profile.">
          <textarea
            className="input-base resize-none"
            rows={3}
            value={form.bio}
            onChange={set('bio')}
            placeholder="Tell us a little about yourself…"
          />
        </Field>

        <SaveBar
          onSave={handleSave}
          onCancel={handleCancel}
          isPending={updateMutation.isPending}
          isDirty={dirty}
        />
      </SettingCard>

      {/* Locale */}
      <SettingCard title="Locale & Formatting" description="Control how dates, times, and language appear across the CRM.">
        <FieldGrid cols={3}>
          <Field label="Language">
            <select className="input-base" value={form.language} onChange={set('language')}>
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Timezone">
            <select className="input-base" value={form.timezone} onChange={set('timezone')}>
              {TIMEZONES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Date Format">
            <select className="input-base" value={form.dateFormat} onChange={set('dateFormat')}>
              {DATE_FORMATS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </Field>
        </FieldGrid>

        <SaveBar
          onSave={handleSave}
          onCancel={handleCancel}
          isPending={updateMutation.isPending}
          isDirty={dirty}
        />
      </SettingCard>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-4">
          <Skeleton className="w-20 h-20 rounded-full flex-shrink-0" />
          <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5"><Skeleton className="h-3 w-20" /><Skeleton className="h-10 w-full rounded-xl" /></div>
          ))}
        </div>
      </div>
    </div>
  )
}
