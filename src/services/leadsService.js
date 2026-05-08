// ─── Leads Service ────────────────────────────────────────────────────────────
//
// TO MIGRATE TO SUPABASE: set VITE_USE_REAL_BACKEND=true and implement
// the real branch. The leadsStore and all UI components are unchanged.

import { supabase, USE_REAL_BACKEND } from '../lib/supabaseClient.js'

// Note: leadsStore.js manages lead data directly (not via a hook/lib pattern).
// When migrating, the leadsStore actions (addLead, updateLead, deleteLead, etc.)
// should call this service instead of mutating _leads in-memory.
// The service layer is defined here and ready to be wired in.

export async function getLeads() {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
  // Mock: leadsStore reads from its own in-memory _leads array
  return null
}

export async function getLeadById(id) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }
  return null
}

export async function insertLead(payload) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('leads')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data
  }
  return null
}

export async function patchLead(id, payload) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('leads')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  return null
}

export async function removeLead(id) {
  if (USE_REAL_BACKEND) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
    if (error) throw error
    return { id }
  }
  return null
}

export async function patchLeadStage(id, stage) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('leads')
      .update({ stage, last_activity: new Date().toISOString().split('T')[0] })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  return null
}
