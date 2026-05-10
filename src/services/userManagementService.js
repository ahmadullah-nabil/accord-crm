// ─── User Management Service ──────────────────────────────────────────────────
//
// Admin-only operations on public.profiles.
// All mutations are safe incremental updates — never deletes, never touches
// auth.users directly. Supabase auth records are fully preserved.
//
// Operations:
//   listWorkspaceUsers()       — all profiles for the admin overview
//   updateUserRole()           — change profiles.role
//   updateUserManager()        — change profiles.manager_id
//   updateUserDepartment()     — change profiles.department
//   setUserActive()            — toggle profiles.is_active
//
// Field mapping  DB → App
//   id, name, email, role, department
//   manager_id → managerId, is_active → isActive, updated_at → updatedAt

import { supabase } from '../lib/supabaseClient.js'

function toApp(row) {
  if (!row) return null
  return {
    id:         row.id,
    name:       row.name        ?? '',
    email:      row.email       ?? '',
    role:       row.role        ?? 'Employee',
    department: row.department  ?? '',
    managerId:  row.manager_id  ?? null,
    teamId:     row.team_id     ?? null,
    isActive:   row.is_active   ?? true,
    phone:      row.phone       ?? '',
    avatarUrl:  row.avatar_url  ?? null,
    updatedAt:  row.updated_at  ?? '',
    createdAt:  row.created_at  ?? '',
  }
}

// ── Read ──────────────────────────────────────────────────────────────────────

/** All workspace users, active and inactive, ordered by name. */
export async function listWorkspaceUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, department, manager_id, team_id, is_active, phone, avatar_url, updated_at, created_at')
    .order('name', { ascending: true })

  if (error) {
    if (error.code === '42P01') return []   // table doesn't exist yet
    throw error
  }
  return (data ?? []).map(toApp)
}

// ── Update helpers — each patches a single concern ───────────────────────────

async function patchProfile(id, patch) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return toApp(data)
}

/** Change a user's role (e.g. 'Employee' → 'Manager'). */
export function updateUserRole(id, role) {
  return patchProfile(id, { role })
}

/**
 * Set or clear a user's manager.
 * Pass null to remove the manager relationship.
 */
export function updateUserManager(id, managerId) {
  return patchProfile(id, { manager_id: managerId ?? null })
}

/** Update a user's department string. */
export function updateUserDepartment(id, department) {
  return patchProfile(id, { department: department ?? '' })
}

/** Activate or deactivate a user without deleting their auth record. */
export function setUserActive(id, isActive) {
  return patchProfile(id, { is_active: isActive })
}

/** Update name (display name in the CRM, not the auth email). */
export function updateUserName(id, name) {
  return patchProfile(id, { name })
}
