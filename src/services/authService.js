// ─── Auth Service ─────────────────────────────────────────────────────────────
//
// This service abstracts all authentication operations.
// Currently delegates to the mock implementation inside authStore.
//
// TO MIGRATE TO SUPABASE:
//   1. Set VITE_USE_REAL_BACKEND=true in .env.local
//   2. Replace the body of each function in the "real" branch with:
//      supabase.auth.signInWithPassword(), supabase.auth.signUp(), etc.
//   3. The authStore and all UI components remain completely unchanged.
//
// IMPORTANT: This file does NOT call authStore.login() etc. directly.
// authStore still owns session state. This service is a lower-level
// layer that can be used independently (e.g. by React Query for session checks).

import { supabase, USE_REAL_BACKEND } from '../lib/supabaseClient.js'

// ── Sign in ────────────────────────────────────────────────────────────────────
export async function signIn({ email, password }) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }
  // Mock: delegate to authStore (called from LoginPage via authStore.login())
  return null
}

// ── Sign up ───────────────────────────────────────────────────────────────────
export async function signUp({ email, password, name, company = '' }) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, company },
        emailRedirectTo: `${import.meta.env.VITE_APP_URL}/verify-email`,
      },
    })
    if (error) throw error
    return data
  }
  return null
}

// ── Sign out ──────────────────────────────────────────────────────────────────
export async function signOut() {
  if (USE_REAL_BACKEND) {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
  }
  return true
}

// ── Get current session ────────────────────────────────────────────────────────
export async function getSession() {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  }
  return null
}

// ── Get current user ─────────────────────────────────────────────────────────
export async function getUser() {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  }
  return null
}

// ── Forgot password ───────────────────────────────────────────────────────────
export async function forgotPassword(email) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${import.meta.env.VITE_APP_URL}/reset-password`,
    })
    if (error) throw error
    return data
  }
  return { sent: true }
}

// ── Reset password ────────────────────────────────────────────────────────────
export async function resetPassword(newPassword) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
    return data
  }
  return { updated: true }
}

// ── Resend verification email ─────────────────────────────────────────────────
export async function resendVerificationEmail(email) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${import.meta.env.VITE_APP_URL}/verify-email`,
      },
    })
    if (error) throw error
    return data
  }
  return { sent: true }
}

// ── Subscribe to auth state changes ───────────────────────────────────────────
// Call this in main.jsx or a top-level provider to reactively update authStore
// when Supabase fires auth events (TOKEN_REFRESHED, SIGNED_OUT, etc.)
export function onAuthStateChange(callback) {
  if (USE_REAL_BACKEND) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
    return subscription
  }
  // Mock: no-op — authStore manages state directly
  return { unsubscribe: () => {} }
}
