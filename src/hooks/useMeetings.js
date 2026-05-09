// ─── Meetings React Query Hooks ───────────────────────────────────────────────
//
// All data operations for the Meetings module go through these hooks.
// They delegate to meetingsService.js (Supabase) — UI components are unchanged.
//
// Auth guard
// ──────────
// Every query is gated on isAuthenticated. This prevents any request from
// firing before authStore.initialize() restores the Supabase session,
// which would cause RLS to reject it and show a spurious error state.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore.js'
import {
  getMeetings,
  getMeetingById,
  insertMeeting,
  patchMeeting,
  removeMeeting,
} from '../services/meetingsService.js'

// ── Stable query keys ─────────────────────────────────────────────────────────
export const meetingKeys = {
  all:    () => ['meetings'],
  detail: (id) => ['meetings', id],
}

// ── useMeetings — fetch list ──────────────────────────────────────────────────
export function useMeetings() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: meetingKeys.all(),
    queryFn:  getMeetings,
    staleTime: 1000 * 60 * 2,
    enabled:   isAuthenticated,
  })
}

// ── useMeeting — fetch one ────────────────────────────────────────────────────
export function useMeeting(id) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: meetingKeys.detail(id),
    queryFn:  () => getMeetingById(id),
    enabled:  isAuthenticated && Boolean(id),
    staleTime: 1000 * 60 * 2,
  })
}

// ── useCreateMeeting ──────────────────────────────────────────────────────────
export function useCreateMeeting() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: insertMeeting,
    onSuccess: (newMeeting) => {
      // Prepend to list cache — no extra round-trip
      qc.setQueryData(meetingKeys.all(), (old = []) => [newMeeting, ...old])
    },
    onError: () => {
      // Re-sync on failure
      qc.invalidateQueries({ queryKey: meetingKeys.all() })
    },
  })
}

// ── useUpdateMeeting ──────────────────────────────────────────────────────────
export function useUpdateMeeting() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => patchMeeting(id, data),
    onSuccess: (updated) => {
      qc.setQueryData(meetingKeys.all(), (old = []) =>
        old.map((m) => (m.id === updated.id ? updated : m))
      )
      // Also refresh the detail cache so the drawer shows fresh data
      qc.setQueryData(meetingKeys.detail(updated.id), updated)
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: meetingKeys.all() })
    },
  })
}

// ── useLeadMeetings — meetings linked to a specific lead ──────────────────────
// Uses the SAME queryKey as useMeetings() so it shares the React Query cache.
// When useCreateMeeting / useDeleteMeeting update ['meetings'], this hook's
// `select` re-runs automatically — no separate fetch, no stale data.
//
// relatedType is stored as 'Lead' (capital L) in the DB to match RELATED_TYPES.
export function useLeadMeetings(leadId) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: meetingKeys.all(),           // same key = shared cache entry
    queryFn:  getMeetings,
    staleTime: 1000 * 60 * 2,
    enabled:   isAuthenticated && Boolean(leadId),
    select: (meetings) =>
      meetings
        .filter((m) => m.relatedId === String(leadId) && m.relatedType === 'Lead')
        .sort((a, b) => {
          // Newest first: combine date + time for accurate sort
          const at = `${a.scheduledDate || ''}T${a.scheduledTime || ''}`
          const bt = `${b.scheduledDate || ''}T${b.scheduledTime || ''}`
          return bt.localeCompare(at)
        }),
  })
}

// ── useDeleteMeeting ──────────────────────────────────────────────────────────
export function useDeleteMeeting() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: removeMeeting,

    // Optimistic: remove from list immediately
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: meetingKeys.all() })
      const previous = qc.getQueryData(meetingKeys.all())
      qc.setQueryData(meetingKeys.all(), (old = []) =>
        old.filter((m) => m.id !== id)
      )
      return { previous }
    },

    // Roll back on Supabase error
    onError: (_err, _id, context) => {
      if (context?.previous) {
        qc.setQueryData(meetingKeys.all(), context.previous)
      }
    },

    // Always clean up and re-validate
    onSettled: (_data, _err, id) => {
      qc.removeQueries({ queryKey: meetingKeys.detail(id) })
      qc.invalidateQueries({ queryKey: meetingKeys.all() })
    },
  })
}
