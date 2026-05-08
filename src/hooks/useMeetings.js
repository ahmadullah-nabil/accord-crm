import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMeetings,
  fetchMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from '../lib/meetingsData.js'

// ── Query keys ────────────────────────────────────────────────────────────────
export const meetingKeys = {
  all:    () => ['meetings'],
  detail: (id) => ['meetings', id],
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Fetch all meetings */
export function useMeetings() {
  return useQuery({
    queryKey: meetingKeys.all(),
    queryFn:  fetchMeetings,
    staleTime: 1000 * 60 * 2,
  })
}

/** Fetch a single meeting by id */
export function useMeeting(id) {
  return useQuery({
    queryKey: meetingKeys.detail(id),
    queryFn:  () => fetchMeetingById(id),
    enabled:  Boolean(id),
    staleTime: 1000 * 60 * 2,
  })
}

/** Create a new meeting */
export function useCreateMeeting() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createMeeting,
    onSuccess: (newMeeting) => {
      qc.setQueryData(meetingKeys.all(), (old = []) => [newMeeting, ...old])
    },
  })
}

/** Update an existing meeting */
export function useUpdateMeeting() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateMeeting(id, data),
    onSuccess: (updated) => {
      qc.setQueryData(meetingKeys.all(), (old = []) =>
        old.map((m) => (m.id === updated.id ? updated : m))
      )
      qc.setQueryData(meetingKeys.detail(updated.id), updated)
    },
  })
}

/** Delete a meeting */
export function useDeleteMeeting() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteMeeting,
    onSuccess: (_, id) => {
      qc.setQueryData(meetingKeys.all(), (old = []) => old.filter((m) => m.id !== id))
      qc.removeQueries({ queryKey: meetingKeys.detail(id) })
    },
  })
}
