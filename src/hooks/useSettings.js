import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore }        from '../stores/authStore.js'
import { useMyProfileData, useUpdateProfile as useUpdateTeamProfile, teamKeys } from './useTeam.js'
import {
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

// Profile: reads real Supabase public.profiles via useMyProfileData
export function useProfileSettings() {
  return useMyProfileData()
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

// Profile update: persists to Supabase public.profiles
// ProfileSection calls mutateAsync(form) where form has { name, department, phone, ... }
// We read the auth user id and call updateProfile(id, payload) via the team hook.
export function useUpdateProfile() {
  const user           = useAuthStore((s) => s.user)
  const teamMutation   = useUpdateTeamProfile()
  const qc             = useQueryClient()

  return useMutation({
    mutationFn: async (data) => {
      if (!user?.id) throw new Error('Not authenticated')
      // Map the settings form fields → profile fields
      const payload = {
        name:       data.name,
        department: data.department,
        phone:      data.phone,
      }
      return teamMutation.mutateAsync({ id: user.id, data: payload })
    },
    onSuccess: () => {
      // Invalidate both the profile data and the members list
      qc.invalidateQueries({ queryKey: teamKeys.myProfile(user?.id) })
      qc.invalidateQueries({ queryKey: teamKeys.members() })
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
