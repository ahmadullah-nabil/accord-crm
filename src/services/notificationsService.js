// ─── Notifications Service ────────────────────────────────────────────────────
//
// All real Supabase CRUD for the notifications table.
// Called exclusively by useNotifications.js hooks.
//
// RLS ensures users only see their own notifications — no client-side
// filtering needed; Supabase enforces it at the DB level.
//
// Notification field mapping
// ──────────────────────────
// DB snake_case:  user_id, is_read, is_pinned, actor_id, entity_type, entity_id
// App camelCase:  userId, isRead, isPinned, actorId, entityType, entityId

import { supabase } from '../lib/supabaseClient.js'

// ── Field mapper ──────────────────────────────────────────────────────────────
function toApp(row) {
  if (!row) return null
  return {
    id:         row.id,
    userId:     row.user_id,
    actor:      row.actor       ?? '',
    actorId:    row.actor_id    ?? null,
    category:   row.category    ?? 'System',
    type:       row.type,
    title:      row.title       ?? '',
    body:       row.body        ?? '',
    entityType: row.entity_type ?? null,
    entityId:   row.entity_id   ?? null,
    isRead:     row.is_read     ?? false,
    isPinned:   row.is_pinned   ?? false,
    metadata:   row.metadata    ?? {},
    createdAt:  row.created_at  ?? '',
  }
}

// ── Read ──────────────────────────────────────────────────────────────────────

/** Fetch all notifications for the authenticated user (RLS scopes to user_id). */
export async function getNotifications() {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    // Table missing — return empty so the UI shows an empty state
    if (error.code === '42P01') return []
    throw error
  }
  return (data ?? []).map(toApp)
}

/** Fetch unread count for badge — lightweight, only counts. */
export async function getUnreadCount() {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)

  if (error) {
    if (error.code === '42P01') return 0
    throw error
  }
  return count ?? 0
}

/** Fetch a single notification. */
export async function getNotificationById(id) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return toApp(data)
}

// ── Write ─────────────────────────────────────────────────────────────────────

/** Mark one notification as read. */
export async function markNotificationRead(id) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return toApp(data)
}

/** Mark one notification as unread. */
export async function markNotificationUnread(id) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: false })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return toApp(data)
}

/** Mark ALL unread notifications as read for the authenticated user. */
export async function markAllNotificationsRead() {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('is_read', false)   // RLS scopes this to current user
    .select()
  if (error) throw error
  return (data ?? []).map(toApp)
}

/** Toggle pinned state. */
export async function toggleNotificationPin(id) {
  // Read current state, then flip
  const { data: cur, error: fetchErr } = await supabase
    .from('notifications')
    .select('is_pinned')
    .eq('id', id)
    .single()
  if (fetchErr) throw fetchErr

  const { data, error } = await supabase
    .from('notifications')
    .update({ is_pinned: !cur.is_pinned })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return toApp(data)
}

/** Delete a notification permanently. */
export async function deleteNotification(id) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
  if (error) throw error
  return { id }
}

/** Delete all read (non-pinned) notifications for the current user. */
export async function deleteAllReadNotifications() {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('is_read', true)
    .eq('is_pinned', false)
  if (error) throw error
  return []
}

// ── Create helpers ────────────────────────────────────────────────────────────
//
// These are the public API for other services (leadsStore, useTasks, etc.)
// to create notifications when significant events occur.
//
// Design: fire-and-forget by the caller — errors are logged, not thrown.
// The primary action (create lead, update stage) must never fail due to
// a notification write failure.

/**
 * Create a single notification row.
 *
 * @param {object} opts
 * @param {string}   opts.userId      — recipient Supabase UUID
 * @param {string}   [opts.actor]     — display name of who triggered it
 * @param {string}   [opts.actorId]   — UUID of the actor profile
 * @param {string}   opts.category    — 'Assignments'|'Tasks'|'Meetings'|'Deals'|'Leads'|'System'
 * @param {string}   opts.type        — machine-readable event type
 * @param {string}   opts.title       — short notification title
 * @param {string}   [opts.body]      — longer description
 * @param {string}   [opts.entityType]— 'lead'|'task'|'meeting'|'opportunity'
 * @param {string}   [opts.entityId]  — UUID of the source record
 * @param {object}   [opts.metadata]  — arbitrary JSON payload
 */
export async function createNotification({
  userId,
  actor    = '',
  actorId  = null,
  category = 'System',
  type,
  title,
  body     = '',
  entityType = null,
  entityId   = null,
  metadata   = {},
}) {
  if (!userId || !type || !title) {
    console.warn('[notificationsService] createNotification: missing required fields', { userId, type, title })
    return null
  }

  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id:     userId,
        actor,
        actor_id:    actorId,
        category,
        type,
        title,
        body,
        entity_type: entityType,
        entity_id:   entityId   ?? null,
        metadata,
      })
      .select()
      .single()

    if (error) {
      console.error('[notificationsService] createNotification error:', error.message)
      return null
    }
    return toApp(data)
  } catch (err) {
    console.error('[notificationsService] createNotification threw:', err.message)
    return null
  }
}

// ── High-level notification helpers ───────────────────────────────────────────
// Called by leadsStore, useMeetings, useTasks, etc. after a successful write.
// Always fire-and-forget (callers do not await these).

/**
 * Notify a user that a lead has been assigned to them.
 */
export function notifyLeadAssignment({ recipientId, actorName, actorId, leadName, leadId }) {
  return createNotification({
    userId:     recipientId,
    actor:      actorName,
    actorId,
    category:   'Assignments',
    type:       'lead_assigned',
    title:      `Lead assigned: ${leadName}`,
    body:       `${actorName} assigned you the lead for ${leadName}.`,
    entityType: 'lead',
    entityId:   leadId,
  })
}

/**
 * Notify a user that a task has been assigned to them.
 */
export function notifyTaskAssignment({ recipientId, actorName, actorId, taskTitle, taskId, dueDate }) {
  return createNotification({
    userId:     recipientId,
    actor:      actorName,
    actorId,
    category:   'Assignments',
    type:       'task_assigned',
    title:      `Task assigned: ${taskTitle}`,
    body:       dueDate
      ? `${actorName} assigned you a task due ${dueDate}.`
      : `${actorName} assigned you a new task.`,
    entityType: 'task',
    entityId:   taskId,
    metadata:   { dueDate },
  })
}

/**
 * Notify a user that a meeting has been scheduled for them.
 */
export function notifyMeetingScheduled({ recipientId, actorName, actorId, meetingTitle, meetingId, scheduledDate }) {
  return createNotification({
    userId:     recipientId,
    actor:      actorName,
    actorId,
    category:   'Meetings',
    type:       'meeting_scheduled',
    title:      `Meeting scheduled: ${meetingTitle}`,
    body:       scheduledDate
      ? `${actorName} scheduled a meeting on ${scheduledDate}.`
      : `${actorName} scheduled a new meeting with you.`,
    entityType: 'meeting',
    entityId:   meetingId,
    metadata:   { scheduledDate },
  })
}

/**
 * Notify when an opportunity moves to a significant stage.
 */
export function notifyOpportunityStageChange({ recipientId, actorName, actorId, oppTitle, oppId, newStage, oldStage }) {
  const isWon  = newStage === 'Won'
  const isLost = newStage === 'Lost'
  return createNotification({
    userId:     recipientId,
    actor:      actorName,
    actorId,
    category:   'Deals',
    type:       isWon ? 'opportunity_won' : isLost ? 'opportunity_lost' : 'opportunity_stage_changed',
    title:      isWon
      ? `Deal won: ${oppTitle}` 
      : isLost
        ? `Deal lost: ${oppTitle}`
        : `Deal moved to ${newStage}: ${oppTitle}`,
    body:       `${actorName} moved "${oppTitle}" from ${oldStage} to ${newStage}.`,
    entityType: 'opportunity',
    entityId:   oppId,
    metadata:   { newStage, oldStage },
  })
}

// ── Activity Intelligence helpers ─────────────────────────────────────────────
// These are called by the intelligence scanner (useIntelligence hook) to
// create system-level notifications for stale/overdue records.

/**
 * Create an overdue task notification for the task's assignee.
 */
export function notifyOverdueTask({ recipientId, taskTitle, taskId, dueDate, daysOverdue }) {
  return createNotification({
    userId:     recipientId,
    actor:      'System',
    category:   'Tasks',
    type:       'task_overdue',
    title:      `Overdue task: ${taskTitle}`,
    body:       `This task was due ${daysOverdue === 1 ? 'yesterday' : `${daysOverdue} days ago`} (${dueDate}). Please update or reschedule.`,
    entityType: 'task',
    entityId:   taskId,
    metadata:   { dueDate, daysOverdue },
  })
}

/**
 * Create a stale opportunity notification for the assignee.
 */
export function notifyStaleOpportunity({ recipientId, oppTitle, oppId, daysSinceActivity, stage }) {
  return createNotification({
    userId:     recipientId,
    actor:      'System',
    category:   'Deals',
    type:       'opportunity_stale',
    title:      `Stale deal: ${oppTitle}`,
    body:       `No activity on "${oppTitle}" (${stage}) for ${daysSinceActivity} days. Consider following up.`,
    entityType: 'opportunity',
    entityId:   oppId,
    metadata:   { daysSinceActivity, stage },
  })
}

/**
 * Create an inactive lead notification for the assignee.
 */
export function notifyInactiveLead({ recipientId, leadName, leadId, daysSinceActivity, stage }) {
  return createNotification({
    userId:     recipientId,
    actor:      'System',
    category:   'Leads',
    type:       'lead_inactive',
    title:      `Inactive lead: ${leadName}`,
    body:       `No activity on "${leadName}" (${stage}) for ${daysSinceActivity} days.`,
    entityType: 'lead',
    entityId:   leadId,
    metadata:   { daysSinceActivity, stage },
  })
}

// ── Realtime subscription ─────────────────────────────────────────────────────
// Wire this up in a top-level component to push new notifications without polling.
export function subscribeToNotifications(userId, onInsert) {
  const channel = supabase
    .channel(`notifications:user:${userId}`)
    .on(
      'postgres_changes',
      {
        event:  'INSERT',
        schema: 'public',
        table:  'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onInsert(toApp(payload.new)),
    )
    .subscribe()

  return { unsubscribe: () => supabase.removeChannel(channel) }
}
