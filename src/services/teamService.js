// ─── Team Service ─────────────────────────────────────────────────────────────
//
// Supabase queries for the profiles and teams tables.
// Called by useTeam.js React Query hooks — UI components never import this.
//
// Field mapping
// ─────────────
// DB uses snake_case:   manager_id, team_id, is_active, avatar_url, updated_at
// App uses camelCase:   managerId,  teamId,  isActive,  avatarUrl,  updatedAt
//
// Fallback behaviour
// ──────────────────
// If the profiles table columns added by profiles_team_patch.sql don't exist
// yet (error code 42703 = undefined column), the functions return the static
// TEAM_MEMBERS array instead of throwing. This keeps the app fully functional
// before the SQL patch is applied.

import { supabase }     from '../lib/supabaseClient.js'
import { TEAM_MEMBERS } from '../lib/users.js'

// ── Field mapper: Supabase profile row → app member shape ────────────────────
function toApp(row) {
  if (!row) return null
  return {
    id:          row.id,
    name:        row.name        ?? '',
    email:       row.email       ?? '',
    role:        row.role        ?? 'Employee',
    department:  row.department  ?? '',
    managerId:   row.manager_id  ?? null,
    teamId:      row.team_id     ?? null,
    isActive:    row.is_active   ?? true,
    phone:       row.phone       ?? '',
    avatarUrl:   row.avatar_url  ?? null,
    updatedAt:   row.updated_at  ?? '',
  }
}

// ── Fetch all profiles (team members) ─────────────────────────────────────────
export async function getTeamMembers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, role, department, manager_id, team_id, is_active, phone, avatar_url, updated_at')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      // Graceful fallback for missing columns or table
      if (error.code === '42703' || error.code === '42P01') return TEAM_MEMBERS
      throw error
    }

    // If table exists but is empty (no auth users yet), fall back to static list
    if (!data || data.length === 0) return TEAM_MEMBERS

    return data.map(toApp)
  } catch {
    // Network failure — return static list so UI never breaks
    return TEAM_MEMBERS
  }
}

// ── Fetch a single profile by id ──────────────────────────────────────────────
export async function getProfileById(id) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, role, department, manager_id, team_id, is_active, phone, avatar_url, updated_at')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === '42703' || error.code === '42P01' || error.code === 'PGRST116') return null
      throw error
    }
    return toApp(data)
  } catch {
    return null
  }
}

// ── Fetch all teams ────────────────────────────────────────────────────────────
export async function getTeams() {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('id, name, description, created_at')
      .order('name', { ascending: true })

    if (error) {
      if (error.code === '42P01') return []
      throw error
    }
    return data ?? []
  } catch {
    return []
  }
}

// ── Update a profile ──────────────────────────────────────────────────────────
export async function updateProfile(id, payload) {
  const row = {}
  if (payload.name       !== undefined) row.name       = payload.name
  if (payload.role       !== undefined) row.role       = payload.role
  if (payload.department !== undefined) row.department = payload.department
  if (payload.managerId  !== undefined) row.manager_id = payload.managerId
  if (payload.teamId     !== undefined) row.team_id    = payload.teamId
  if (payload.phone      !== undefined) row.phone      = payload.phone
  if (payload.avatarUrl  !== undefined) row.avatar_url = payload.avatarUrl
  row.updated_at = new Date().toISOString()

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(row)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return toApp(data)
  } catch {
    return null
  }
}
