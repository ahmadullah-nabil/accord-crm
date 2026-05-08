import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchContacts,
  fetchContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../lib/contactsData.js'

// ── Query keys ────────────────────────────────────────────────────────────────
export const contactKeys = {
  all:    () => ['contacts'],
  detail: (id) => ['contacts', id],
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Fetch all contacts list */
export function useContacts() {
  return useQuery({
    queryKey: contactKeys.all(),
    queryFn:  fetchContacts,
    staleTime: 1000 * 60 * 2,
  })
}

/** Fetch a single contact by id */
export function useContact(id) {
  return useQuery({
    queryKey: contactKeys.detail(id),
    queryFn:  () => fetchContactById(id),
    enabled:  Boolean(id),
    staleTime: 1000 * 60 * 2,
  })
}

/** Create a new contact */
export function useCreateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createContact,
    onSuccess: (newContact) => {
      // Optimistically prepend to the list cache
      qc.setQueryData(contactKeys.all(), (old = []) => [newContact, ...old])
    },
  })
}

/** Update an existing contact */
export function useUpdateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateContact(id, data),
    onSuccess: (updated) => {
      qc.setQueryData(contactKeys.all(), (old = []) =>
        old.map((c) => (c.id === updated.id ? updated : c))
      )
      qc.setQueryData(contactKeys.detail(updated.id), updated)
    },
  })
}

/** Delete a contact */
export function useDeleteContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteContact,
    onSuccess: (_, id) => {
      qc.setQueryData(contactKeys.all(), (old = []) => old.filter((c) => c.id !== id))
      qc.removeQueries({ queryKey: contactKeys.detail(id) })
    },
  })
}
