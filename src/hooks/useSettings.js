import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchProfileSettings,
  fetchCompanySettings,
  fetchNotificationSettings,
  fetchAppearanceSettings,
  fetchSecuritySettings,
  fetchPreferencesSettings,
  updateProfileSettings,
  updateCompanySettings,
  updateNotificationSettings,
  updateAppearanceSettings,
  updateSecuritySettings,
  updatePreferencesSettings,
  changePassword,
} from '../lib/settingsData.js'

// ── Query keys ────────────────────────────────────────────────────────────────
export const settingsKeys = {
  profile:       () => ['settings', 'profile'],
  company:       () => ['settings', 'company'],
  notifications: () => ['settings', 'notifications'],
  appearance:    () => ['settings', 'appearance'],
  security:      () => ['settings', 'security'],
  preferences:   () => ['settings', 'preferences'],
}

const STALE = 1000 * 60 * 5 // 5 minutes — settings change rarely

// ── Fetch hooks ───────────────────────────────────────────────────────────────

export function useProfileSettings() {
  return useQuery({
    queryKey: settingsKeys.profile(),
    queryFn:  fetchProfileSettings,
    staleTime: STALE,
  })
}

export function useCompanySettings() {
  return useQuery({
    queryKey: settingsKeys.company(),
    queryFn:  fetchCompanySettings,
    staleTime: STALE,
  })
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: settingsKeys.notifications(),
    queryFn:  fetchNotificationSettings,
    staleTime: STALE,
  })
}

export function useAppearanceSettings() {
  return useQuery({
    queryKey: settingsKeys.appearance(),
    queryFn:  fetchAppearanceSettings,
    staleTime: STALE,
  })
}

export function useSecuritySettings() {
  return useQuery({
    queryKey: settingsKeys.security(),
    queryFn:  fetchSecuritySettings,
    staleTime: STALE,
  })
}

export function usePreferencesSettings() {
  return useQuery({
    queryKey: settingsKeys.preferences(),
    queryFn:  fetchPreferencesSettings,
    staleTime: STALE,
  })
}

// ── Mutation hooks ────────────────────────────────────────────────────────────

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateProfileSettings,
    onSuccess: (updated) => {
      qc.setQueryData(settingsKeys.profile(), updated)
    },
  })
}

export function useUpdateCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateCompanySettings,
    onSuccess: (updated) => {
      qc.setQueryData(settingsKeys.company(), updated)
    },
  })
}

export function useUpdateNotifications() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: (updated) => {
      qc.setQueryData(settingsKeys.notifications(), updated)
    },
  })
}

export function useUpdateAppearance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateAppearanceSettings,
    onSuccess: (updated) => {
      qc.setQueryData(settingsKeys.appearance(), updated)
    },
  })
}

export function useUpdateSecurity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateSecuritySettings,
    onSuccess: (updated) => {
      qc.setQueryData(settingsKeys.security(), updated)
    },
  })
}

export function useUpdatePreferences() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updatePreferencesSettings,
    onSuccess: (updated) => {
      qc.setQueryData(settingsKeys.preferences(), updated)
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      changePassword(currentPassword, newPassword),
  })
}
