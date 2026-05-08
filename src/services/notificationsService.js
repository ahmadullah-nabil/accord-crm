// ─── Notifications Service ────────────────────────────────────────────────────
//
// TO MIGRATE: set VITE_USE_REAL_BACKEND=true and implement the real branch.
// The useNotifications.js hooks and all UI components are unchanged.
//
// Real-time updates: when migrating, also wire up Supabase Realtime subscription
// in the real branch to push new notifications without polling.

import { supabase, USE_REAL_BACKEND } from '../lib/supabaseClient.js'
import {
  fetchNotifications    as mockFetchAll,
  fetchNotificationById as mockFetchById,
  markAsRead            as mockMarkRead,
  markAsUnread          as mockMarkUnread,
  markAllAsRead         as mockMarkAllRead,
  clearNotification     as mockClear,
  clearAllRead          as mockClearAllRead,
  togglePin             as mockTogglePin,
} from '../lib/notificationsData.js'

export async function getNotifications() {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
  return mockFetchAll()
}

export async function getNotificationById(id) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }
  return mockFetchById(id)
}

export async function markNotificationRead(id) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  return mockMarkRead(id)
}

export async function markNotificationUnread(id) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: false })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  return mockMarkUnread(id)
}

export async function markAllNotificationsRead(userId) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .select()
    if (error) throw error
    return data
  }
  return mockMarkAllRead()
}

export async function deleteNotification(id) {
  if (USE_REAL_BACKEND) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
    if (error) throw error
    return { id }
  }
  return mockClear(id)
}

export async function deleteAllReadNotifications(userId) {
  if (USE_REAL_BACKEND) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .eq('is_read', true)
    if (error) throw error
    return []
  }
  return mockClearAllRead()
}

export async function toggleNotificationPin(id) {
  if (USE_REAL_BACKEND) {
    // Fetch current state first, then toggle
    const { data: current, error: fetchErr } = await supabase
      .from('notifications')
      .select('is_pinned')
      .eq('id', id)
      .single()
    if (fetchErr) throw fetchErr

    const { data, error } = await supabase
      .from('notifications')
      .update({ is_pinned: !current.is_pinned })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  return mockTogglePin(id)
}

// ── Realtime subscription (Supabase only) ─────────────────────────────────────
// Call this to subscribe to live notification inserts for the current user.
// Pass the user ID and a callback that React Query will call to invalidate cache.
export function subscribeToNotifications(userId, onInsert) {
  if (!USE_REAL_BACKEND) {
    return { unsubscribe: () => {} }
  }

  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event:  'INSERT',
        schema: 'public',
        table:  'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onInsert(payload.new),
    )
    .subscribe()

  return {
    unsubscribe: () => supabase.removeChannel(channel),
  }
}
