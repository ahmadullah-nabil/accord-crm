// ─── Settings Service ─────────────────────────────────────────────────────────
//
// TO MIGRATE: set VITE_USE_REAL_BACKEND=true and implement the real branch.
// Maps to Supabase tables: profiles, company_settings, user_preferences
// The useSettings.js hooks and all UI components are unchanged.

import { supabase, USE_REAL_BACKEND } from '../lib/supabaseClient.js'
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
  changePassword as mockChangePassword,
} from '../lib/settingsData.js'

// ── Profile ───────────────────────────────────────────────────────────────────
export async function getProfileSettings(userId) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  }
  return fetchProfileSettings()
}

export async function saveProfileSettings(userId, payload) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ ...payload, id: userId })
      .select()
      .single()
    if (error) throw error
    return data
  }
  return updateProfileSettings(payload)
}

// ── Company ───────────────────────────────────────────────────────────────────
export async function getCompanySettings(orgId) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .eq('org_id', orgId)
      .single()
    if (error) throw error
    return data
  }
  return fetchCompanySettings()
}

export async function saveCompanySettings(orgId, payload) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('company_settings')
      .upsert({ ...payload, org_id: orgId })
      .select()
      .single()
    if (error) throw error
    return data
  }
  return updateCompanySettings(payload)
}

// ── Notification preferences ──────────────────────────────────────────────────
export async function getNotificationPrefs(userId) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('notifications')
      .eq('user_id', userId)
      .single()
    if (error) throw error
    return data?.notifications
  }
  return fetchNotificationSettings()
}

export async function saveNotificationPrefs(userId, payload) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, notifications: payload })
      .select()
      .single()
    if (error) throw error
    return data?.notifications
  }
  return updateNotificationSettings(payload)
}

// ── Appearance ────────────────────────────────────────────────────────────────
export async function getAppearancePrefs(userId) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('appearance')
      .eq('user_id', userId)
      .single()
    if (error) throw error
    return data?.appearance
  }
  return fetchAppearanceSettings()
}

export async function saveAppearancePrefs(userId, payload) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, appearance: payload })
      .select()
      .single()
    if (error) throw error
    return data?.appearance
  }
  return updateAppearanceSettings(payload)
}

// ── Security ──────────────────────────────────────────────────────────────────
export async function getSecuritySettings(userId) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('security')
      .eq('user_id', userId)
      .single()
    if (error) throw error
    return data?.security
  }
  return fetchSecuritySettings()
}

export async function saveSecuritySettings(userId, payload) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, security: payload })
      .select()
      .single()
    if (error) throw error
    return data?.security
  }
  return updateSecuritySettings(payload)
}

export async function changePasswordService(currentPassword, newPassword) {
  if (USE_REAL_BACKEND) {
    // Supabase: just update the password — no need to verify current password
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
    return { success: true }
  }
  return mockChangePassword(currentPassword, newPassword)
}

// ── Preferences ───────────────────────────────────────────────────────────────
export async function getPreferencesSettings(userId) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('preferences')
      .eq('user_id', userId)
      .single()
    if (error) throw error
    return data?.preferences
  }
  return fetchPreferencesSettings()
}

export async function savePreferencesSettings(userId, payload) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, preferences: payload })
      .select()
      .single()
    if (error) throw error
    return data?.preferences
  }
  return updatePreferencesSettings(payload)
}
