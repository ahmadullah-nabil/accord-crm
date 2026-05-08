// ─── Contacts Service ─────────────────────────────────────────────────────────
//
// This service is the single source of truth for contact data operations.
// In mock mode it delegates to contactsData.js functions.
// In real mode it queries the Supabase 'contacts' table.
//
// TO MIGRATE TO SUPABASE:
//   1. Set VITE_USE_REAL_BACKEND=true
//   2. Uncomment and complete the real branch in each function.
//   3. The useContacts.js hooks and all UI components are unchanged.

import { supabase, USE_REAL_BACKEND } from '../lib/supabaseClient.js'
import {
  fetchContacts      as mockFetchAll,
  fetchContactById   as mockFetchById,
  createContact      as mockCreate,
  updateContact      as mockUpdate,
  deleteContact      as mockDelete,
} from '../lib/contactsData.js'

export async function getContacts() {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('last_activity', { ascending: false })
    if (error) throw error
    return data
  }
  return mockFetchAll()
}

export async function getContactById(id) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }
  return mockFetchById(id)
}

export async function insertContact(payload) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('contacts')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data
  }
  return mockCreate(payload)
}

export async function patchContact(id, payload) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('contacts')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  return mockUpdate(id, payload)
}

export async function removeContact(id) {
  if (USE_REAL_BACKEND) {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)
    if (error) throw error
    return { id }
  }
  return mockDelete(id)
}
