// ─── Tasks Service ────────────────────────────────────────────────────────────
//
// TO MIGRATE: set VITE_USE_REAL_BACKEND=true and implement the real branch.
// The useTasks.js hooks and all UI components are unchanged.

import { supabase, USE_REAL_BACKEND } from '../lib/supabaseClient.js'
import {
  fetchTasks     as mockFetchAll,
  fetchTaskById  as mockFetchById,
  createTask     as mockCreate,
  updateTask     as mockUpdate,
  deleteTask     as mockDelete,
} from '../lib/tasksData.js'

export async function getTasks() {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true })
    if (error) throw error
    return data
  }
  return mockFetchAll()
}

export async function getTaskById(id) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }
  return mockFetchById(id)
}

export async function insertTask(payload) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data
  }
  return mockCreate(payload)
}

export async function patchTask(id, payload) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await supabase
      .from('tasks')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  return mockUpdate(id, payload)
}

export async function removeTask(id) {
  if (USE_REAL_BACKEND) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    if (error) throw error
    return { id }
  }
  return mockDelete(id)
}
