// ─── Leads Service ────────────────────────────────────────────────────────────
//
// All Supabase CRUD for the leads table.
// Called by leadsStore.js actions — UI components never import this directly.
//
// Field mapping
// ─────────────
// App uses camelCase:  createdAt, lastActivity
// Supabase uses snake: created_at, last_activity
//
// value is NUMERIC in Postgres and number in JS — no rename, just a cast.
// tags is TEXT[] in Postgres and string[] in JS — same shape, no rename.
//
// toApp()  DB row   → app shape   (every SELECT passes through this)
// toDb()   app data → DB columns  (every INSERT / UPDATE passes through this)
//
// RLS
// ───
// supabase.auth persists the JWT and forwards it on every request.
// The leads RLS policy requires auth.role() = 'authenticated'.

import { supabase }         from '../lib/supabaseClient.js'
import { throwClassified }  from '../lib/supabaseErrors.js'

// ── Field mappers ─────────────────────────────────────────────────────────────

/** Supabase row → app lead shape (camelCase) */
function toApp(row) {
  if (!row) return null
  return {
    id:           row.id,
    name:         row.name          ?? '',
    company:      row.company       ?? '',
    email:        row.email         ?? '',
    phone:        row.phone         ?? '',
    stage:        row.stage         ?? 'New',
    value:        Number(row.value) || 0,
    source:       row.source        ?? '',
    assignee:     row.assignee      ?? '',
    priority:     row.priority      ?? 'Medium',
    notes:        row.notes         ?? '',
    tags:         Array.isArray(row.tags) ? row.tags : [],
    createdAt:    row.created_at    ?? '',
    lastActivity: row.last_activity ?? '',
    // Ownership fields (nullable — not present on rows created before the patch)
    createdBy:    row.created_by    ?? '',
    ownerId:      row.owner_id      ?? null,
  }
}

/** App lead payload → Supabase column names (snake_case) */
function toDb(payload) {
  const row = {}
  if (payload.name     !== undefined) row.name     = payload.name
  if (payload.company  !== undefined) row.company  = payload.company
  if (payload.email    !== undefined) row.email    = payload.email
  if (payload.phone    !== undefined) row.phone    = payload.phone
  if (payload.stage    !== undefined) row.stage    = payload.stage
  if (payload.source   !== undefined) row.source   = payload.source
  if (payload.assignee !== undefined) row.assignee = payload.assignee
  if (payload.priority !== undefined) row.priority = payload.priority
  if (payload.notes    !== undefined) row.notes    = payload.notes
  if (payload.value    !== undefined) row.value    = Number(payload.value) || 0
  if (payload.tags     !== undefined) {
    row.tags = Array.isArray(payload.tags) ? payload.tags : []
  }
  // Ownership fields — only written on insert, never on update
  if (payload.createdBy !== undefined) row.created_by = payload.createdBy ?? ''
  if (payload.ownerId   !== undefined) row.owner_id   = payload.ownerId   ?? null
  return row
}

// ── Fetch all leads ───────────────────────────────────────────────────────────

export async function getLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('last_activity', { ascending: false })

  if (error) throwClassified(error)
  return (data ?? []).map(toApp)
}

// ── Fetch one lead ────────────────────────────────────────────────────────────

export async function getLeadById(id) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throwClassified(error)
  return toApp(data)
}

// ── Create a lead ─────────────────────────────────────────────────────────────

export async function insertLead(payload) {
  const today = new Date().toISOString().split('T')[0]
  const row   = {
    ...toDb(payload),
    created_at:    today,
    last_activity: today,
    // Do NOT include `id` — the DB generates it via gen_random_uuid()
  }

  const { data, error } = await supabase
    .from('leads')
    .insert(row)
    .select()
    .single()

  if (error) throwClassified(error)
  return toApp(data)
}

// ── Update a lead ─────────────────────────────────────────────────────────────

export async function patchLead(id, payload) {
  const row = {
    ...toDb(payload),
    last_activity: new Date().toISOString().split('T')[0],
  }

  const { data, error } = await supabase
    .from('leads')
    .update(row)
    .eq('id', id)
    .select()
    .single()

  if (error) throwClassified(error)
  return toApp(data)
}

// ── Update stage only (used by kanban drag + inline table dropdown) ───────────

export async function patchLeadStage(id, stage) {
  const { data, error } = await supabase
    .from('leads')
    .update({
      stage,
      last_activity: new Date().toISOString().split('T')[0],
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throwClassified(error)
  return toApp(data)
}

// ── Delete a lead ─────────────────────────────────────────────────────────────

export async function removeLead(id) {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) throwClassified(error)
  return { id }
}
