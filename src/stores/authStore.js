import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Mock user data for development (before Supabase integration)
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@nexuscrm.io',
    password: 'admin123',
    name: 'Alex Rivera',
    role: 'Admin',
    avatar: null,
    department: 'Leadership',
  },
  {
    id: '2',
    email: 'agm@nexuscrm.io',
    password: 'agm123',
    name: 'Jordan Kim',
    role: 'AGM',
    avatar: null,
    department: 'Sales',
  },
  {
    id: '3',
    email: 'manager@nexuscrm.io',
    password: 'manager123',
    name: 'Morgan Chen',
    role: 'Manager',
    avatar: null,
    department: 'Sales',
  },
  {
    id: '4',
    email: 'exec@nexuscrm.io',
    password: 'exec123',
    name: 'Taylor Brooks',
    role: 'Executive',
    avatar: null,
    department: 'Sales',
  },
]

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 800)) // simulate network

        const found = MOCK_USERS.find(
          (u) => u.email === email && u.password === password,
        )

        if (!found) {
          set({ isLoading: false, error: 'Invalid email or password.' })
          return { success: false }
        }

        const { password: _pw, ...safeUser } = found
        set({ user: safeUser, isAuthenticated: true, isLoading: false, error: null })
        return { success: true }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null })
      },

      clearError: () => set({ error: null }),

      updateUser: (updates) => {
        const current = get().user
        if (current) {
          set({ user: { ...current, ...updates } })
        }
      },
    }),
    {
      name: 'nexus-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
