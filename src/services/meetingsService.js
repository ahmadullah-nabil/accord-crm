// ─── Meetings Service ─────────────────────────────────────────────────────────
//
// TO MIGRATE: set VITE_USE_REAL_BACKEND=true and implement the real branch.
// The useMeetings.js hooks and all UI components are unchanged.

import { supabase, USE_REAL_BACKEND } from '../lib/supabaseClient.js'
import {
  fetchMeetings    as mockFetchAll,
  fetchMeetingById as mockFetchById,
  createMeeting    as mockCreate,
  updateMeeting    as mockUpdate,
  deleteMeeting    as mockDelete,
} from '../lib/meetingsData.js'

export async function getMeetings() {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('scheduled_date', { ascending: true })
    if (error) throw error
    return data
  }
  return mockFetchAll()
}

export async function getMeetingById(id) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }
  return mockFetchById(id)
}

export async function insertMeeting(payload) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('meetings')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data
  }
  return mockCreate(payload)
}

export async function patchMeeting(id, payload) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('meetings')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  return mockUpdate(id, payload)
}

export async function removeMeeting(id) {
  if (USE_REAL_BACKEND) {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id)
    if (error) throw error
    return { id }
  }
  return mockDelete(id)
}
