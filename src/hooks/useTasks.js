import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../lib/tasksData.js'

// ── Query keys ────────────────────────────────────────────────────────────────
export const taskKeys = {
  all:    () => ['tasks'],
  detail: (id) => ['tasks', id],
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Fetch all tasks */
export function useTasks() {
  return useQuery({
    queryKey: taskKeys.all(),
    queryFn:  fetchTasks,
    staleTime: 1000 * 60 * 2,
  })
}

/** Fetch a single task by id */
export function useTask(id) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn:  () => fetchTaskById(id),
    enabled:  Boolean(id),
    staleTime: 1000 * 60 * 2,
  })
}

/** Create a new task */
export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      qc.setQueryData(taskKeys.all(), (old = []) => [newTask, ...old])
    },
  })
}

/** Update an existing task */
export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: (updated) => {
      qc.setQueryData(taskKeys.all(), (old = []) =>
        old.map((t) => (t.id === updated.id ? updated : t))
      )
      qc.setQueryData(taskKeys.detail(updated.id), updated)
    },
  })
}

/** Delete a task */
export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, id) => {
      qc.setQueryData(taskKeys.all(), (old = []) => old.filter((t) => t.id !== id))
      qc.removeQueries({ queryKey: taskKeys.detail(id) })
    },
  })
}

/** Convenience: toggle a task's status between Completed and its previous state */
export function useToggleTaskComplete() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, currentStatus }) =>
      updateTask(id, {
        status: currentStatus === 'Completed' ? 'Todo' : 'Completed',
      }),
    onSuccess: (updated) => {
      qc.setQueryData(taskKeys.all(), (old = []) =>
        old.map((t) => (t.id === updated.id ? updated : t))
      )
      qc.setQueryData(taskKeys.detail(updated.id), updated)
    },
  })
}
