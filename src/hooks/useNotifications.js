import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchNotifications,
  fetchNotificationById,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  clearNotification,
  clearAllRead,
  togglePin,
} from '../lib/notificationsData.js'

// ── Query keys ────────────────────────────────────────────────────────────────
export const notifKeys = {
  all:    () => ['notifications'],
  detail: (id) => ['notifications', id],
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Fetch all notifications */
export function useNotifications() {
  return useQuery({
    queryKey: notifKeys.all(),
    queryFn:  fetchNotifications,
    staleTime: 1000 * 30, // fresher than other modules — 30 seconds
  })
}

/** Fetch a single notification by id */
export function useNotification(id) {
  return useQuery({
    queryKey: notifKeys.detail(id),
    queryFn:  () => fetchNotificationById(id),
    enabled:  Boolean(id),
    staleTime: 1000 * 30,
  })
}

/** Mark one notification as read */
export function useMarkAsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: (updated) => {
      qc.setQueryData(notifKeys.all(), (old = []) =>
        old.map((n) => (n.id === updated.id ? updated : n))
      )
      qc.setQueryData(notifKeys.detail(updated.id), updated)
    },
  })
}

/** Mark one notification as unread */
export function useMarkAsUnread() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAsUnread,
    onSuccess: (updated) => {
      qc.setQueryData(notifKeys.all(), (old = []) =>
        old.map((n) => (n.id === updated.id ? updated : n))
      )
      qc.setQueryData(notifKeys.detail(updated.id), updated)
    },
  })
}

/** Mark ALL notifications as read */
export function useMarkAllAsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: (all) => {
      qc.setQueryData(notifKeys.all(), all)
    },
  })
}

/** Clear (delete) a single notification */
export function useClearNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: clearNotification,
    onSuccess: (_, id) => {
      qc.setQueryData(notifKeys.all(), (old = []) => old.filter((n) => n.id !== id))
      qc.removeQueries({ queryKey: notifKeys.detail(id) })
    },
  })
}

/** Clear all read notifications */
export function useClearAllRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: clearAllRead,
    onSuccess: (remaining) => {
      qc.setQueryData(notifKeys.all(), remaining)
    },
  })
}

/** Toggle pin on a notification */
export function useTogglePin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: togglePin,
    onSuccess: (updated) => {
      qc.setQueryData(notifKeys.all(), (old = []) =>
        old.map((n) => (n.id === updated.id ? updated : n))
      )
      qc.setQueryData(notifKeys.detail(updated.id), updated)
    },
  })
}
