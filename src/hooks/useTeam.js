// ─── Team / Hierarchy React Query Hooks ──────────────────────────────────────
//
// All hooks here read from teamService.js which falls back to static
// TEAM_MEMBERS when the Supabase table isn't ready — zero runtime errors.
//
// Cache strategy
// ──────────────
// Team structure changes rarely → 10-minute staleTime.
// All hooks share queryKeys.team.* so a single invalidation refreshes them all.
//
// RBAC readiness
// ──────────────
// useMySubordinates()    → used by manager dashboards for scoped views
// useVisibleMemberIds()  → used by filter selectors to scope data
// Both are no-ops for Employee/Executive roles.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore }   from '../stores/authStore.js'
import {
  getTeamMembers,
  getProfileById,
  getTeams,
  updateProfile,
} from '../services/teamService.js'
import {
  getAllSubordinates,
  getDirectReports,
  getManagerChain,
  getVisibleMemberIds,
  isManagerRole,
  TEAM_MEMBERS as STATIC_MEMBERS,
} from '../lib/users.js'

// ── Query keys ────────────────────────────────────────────────────────────────
export const teamKeys = {
  members:   () => ['team', 'members'],
  member:    (id) => ['team', 'member', id],
  teams:     () => ['team', 'teams'],
  hierarchy: () => ['team', 'hierarchy'],
}

const STALE = 1000 * 60 * 10  // 10 minutes

// ── All team members ───────────────────────────────────────────────────────────
export function useTeamMembers() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: teamKeys.members(),
    queryFn:  getTeamMembers,
    staleTime: STALE,
    enabled:   isAuthenticated,
    // Always return at least the static list
    placeholderData: STATIC_MEMBERS,
  })
}

// ── Single member profile ──────────────────────────────────────────────────────
export function useTeamMember(id) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: teamKeys.member(id),
    queryFn:  () => getProfileById(id),
    staleTime: STALE,
    enabled:   isAuthenticated && Boolean(id),
  })
}

// ── All teams (org units) ─────────────────────────────────────────────────────
export function useTeams() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: teamKeys.teams(),
    queryFn:  getTeams,
    staleTime: STALE,
    enabled:   isAuthenticated,
  })
}

// ── Derived: hierarchy for current user ───────────────────────────────────────

/** Direct reports of the current auth user */
export function useMyDirectReports() {
  const user   = useAuthStore((s) => s.user)
  const { data: members = STATIC_MEMBERS } = useTeamMembers()

  if (!user?.id) return []
  return getDirectReports(user.id, members)
}

/** All subordinates (recursive) of the current auth user */
export function useMySubordinates() {
  const user   = useAuthStore((s) => s.user)
  const { data: members = STATIC_MEMBERS } = useTeamMembers()

  if (!user?.id) return []
  return getAllSubordinates(user.id, members)
}

/** Manager chain above the current auth user */
export function useMyManagerChain() {
  const user   = useAuthStore((s) => s.user)
  const { data: members = STATIC_MEMBERS } = useTeamMembers()

  if (!user?.id) return []
  return getManagerChain(user.id, members)
}

/**
 * IDs of all members visible to the current user based on their role.
 * Admin/AGM → all.
 * Manager   → self + subordinates.
 * Employee  → self only.
 *
 * Used by filter dropdowns to scope assignee lists.
 * UI-only hint — real scoping is enforced in RLS.
 */
export function useVisibleMemberIds() {
  const user   = useAuthStore((s) => s.user)
  const { data: members = STATIC_MEMBERS } = useTeamMembers()

  if (!user) return []
  const me = members.find((m) => m.id === user.id || m.name === user.name) ?? null
  return getVisibleMemberIds(me, members)
}

/**
 * Whether the current user has manager-level access.
 * Safe to call even before members are loaded (falls back on auth user role).
 */
export function useIsManager() {
  const user = useAuthStore((s) => s.user)
  return isManagerRole(user?.role ?? '')
}

// ── Update profile mutation ────────────────────────────────────────────────────
export function useUpdateProfile() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateProfile(id, data),
    onSuccess: (updated, { id }) => {
      if (updated) {
        qc.setQueryData(teamKeys.member(id), updated)
        qc.setQueryData(teamKeys.members(), (old = STATIC_MEMBERS) =>
          old.map((m) => (m.id === id ? updated : m))
        )
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: teamKeys.members() })
    },
  })
}
