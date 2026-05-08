import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Mock user database ────────────────────────────────────────────────────────
// When Supabase is wired up, replace MOCK_USERS with a real DB query.
// The store's public API (login, signup, logout, etc.) remains unchanged.

const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@nexuscrm.io',
    password: 'admin123',
    name: 'Alex Rivera',
    role: 'Admin',
    avatar: null,
    department: 'Leadership',
    emailVerified: true,
    createdAt: '2025-01-15',
  },
  {
    id: '2',
    email: 'agm@nexuscrm.io',
    password: 'agm123',
    name: 'Jordan Kim',
    role: 'AGM',
    avatar: null,
    department: 'Sales',
    emailVerified: true,
    createdAt: '2025-02-01',
  },
  {
    id: '3',
    email: 'manager@nexuscrm.io',
    password: 'manager123',
    name: 'Morgan Chen',
    role: 'Manager',
    avatar: null,
    department: 'Sales',
    emailVerified: true,
    createdAt: '2025-02-15',
  },
  {
    id: '4',
    email: 'exec@nexuscrm.io',
    password: 'exec123',
    name: 'Taylor Brooks',
    role: 'Executive',
    avatar: null,
    department: 'Sales',
    emailVerified: true,
    createdAt: '2025-03-01',
  },
]

// Simulated new-user queue (reset on page refresh in mock mode only)
const _signedUpUsers = []

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── Server state ──────────────────────────────────────────────────────
      user:            null,
      isAuthenticated: false,
      isLoading:       false,
      error:           null,

      // ── Auth flow UI states ───────────────────────────────────────────────
      pendingVerificationEmail: null,
      rememberMe: false,

      // ── Login ─────────────────────────────────────────────────────────────
      login: async (email, password, rememberMe = false) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 750))

        const normalised = email.trim().toLowerCase()
        const allUsers = [...MOCK_USERS, ..._signedUpUsers]
        const found = allUsers.find(
          (u) => u.email === normalised && u.password === password,
        )

        if (!found) {
          set({ isLoading: false, error: 'Invalid email or password.' })
          return { success: false }
        }

        if (!found.emailVerified) {
          set({
            isLoading: false,
            error: null,
            pendingVerificationEmail: found.email,
          })
          return { success: false, needsVerification: true, email: found.email }
        }

        const { password: _pw, ...safeUser } = found
        set({
          user: safeUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          rememberMe,
          pendingVerificationEmail: null,
        })
        return { success: true }
      },

      // ── Signup ────────────────────────────────────────────────────────────
      signup: async ({ name, email, password, company = '' }) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 900))

        const normalised = email.trim().toLowerCase()
        const allUsers = [...MOCK_USERS, ..._signedUpUsers]

        if (allUsers.find((u) => u.email === normalised)) {
          set({ isLoading: false, error: 'An account with this email already exists.' })
          return { success: false }
        }

        const newUser = {
          id: `u-${Date.now()}`,
          email: normalised,
          password,
          name: name.trim(),
          role: 'Executive',
          avatar: null,
          department: company.trim() || 'Sales',
          emailVerified: false,
          createdAt: new Date().toISOString().split('T')[0],
        }
        _signedUpUsers.push(newUser)

        set({
          isLoading: false,
          error: null,
          pendingVerificationEmail: normalised,
        })
        return { success: true, email: normalised }
      },

      // ── Mock email verification ────────────────────────────────────────────
      verifyEmail: async (email) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 600))
        const idx = _signedUpUsers.findIndex((u) => u.email === email)
        if (idx !== -1) _signedUpUsers[idx].emailVerified = true
        set({ isLoading: false, pendingVerificationEmail: null })
        return { success: true }
      },

      resendVerification: async (_email) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 700))
        set({ isLoading: false })
        return { success: true }
      },

      // ── Forgot password ────────────────────────────────────────────────────
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 800))
        set({ isLoading: false })
        // Always succeed — avoids user enumeration
        return { success: true }
      },

      // ── Reset password ─────────────────────────────────────────────────────
      resetPassword: async (token, newPassword) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 800))
        if (!token) {
          set({ isLoading: false, error: 'Invalid or expired reset link.' })
          return { success: false }
        }
        set({ isLoading: false })
        return { success: true }
      },

      // ── Logout ─────────────────────────────────────────────────────────────
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
          pendingVerificationEmail: null,
        })
      },

      // ── Helpers ────────────────────────────────────────────────────────────
      clearError:               () => set({ error: null }),
      clearPendingVerification: () => set({ pendingVerificationEmail: null }),
      setRememberMe:            (val) => set({ rememberMe: val }),

      updateUser: (updates) => {
        const current = get().user
        if (current) set({ user: { ...current, ...updates } })
      },
    }),
    {
      name: 'nexus-auth',
      partialize: (state) => ({
        user:            state.user,
        isAuthenticated: state.isAuthenticated,
        rememberMe:      state.rememberMe,
      }),
    },
  ),
)
