import { create } from 'zustand'

// UI-only state for the Meetings module.
// All server/data state lives in React Query (useMeetings / useMeeting hooks).
export const useMeetingsStore = create((set, get) => ({
  // ── Filters ────────────────────────────────────────────────────────────────
  searchQuery:     '',
  statusFilter:    'All',
  typeFilter:      'All',
  organizerFilter: 'All',
  sortField:       'scheduledDate',
  sortDir:         'asc',

  // ── UI state ───────────────────────────────────────────────────────────────
  selectedMeetingId: null,
  detailPanelOpen:   false,
  addModalOpen:      false,
  editModalOpen:     false,

  // ── Filter actions ─────────────────────────────────────────────────────────
  setSearchQuery:     (q) => set({ searchQuery: q }),
  setStatusFilter:    (s) => set({ statusFilter: s }),
  setTypeFilter:      (t) => set({ typeFilter: t }),
  setOrganizerFilter: (o) => set({ organizerFilter: o }),

  setSort: (field) =>
    set((s) => ({
      sortField: field,
      sortDir: s.sortField === field && s.sortDir === 'asc' ? 'desc' : 'asc',
    })),

  clearFilters: () =>
    set({
      searchQuery:     '',
      statusFilter:    'All',
      typeFilter:      'All',
      organizerFilter: 'All',
    }),

  // ── Panel / modal actions ──────────────────────────────────────────────────
  openDetail:     (id) => set({ selectedMeetingId: id, detailPanelOpen: true }),
  closeDetail:    ()   => set({ detailPanelOpen: false, selectedMeetingId: null }),

  openAddModal:   ()   => set({ addModalOpen: true }),
  closeAddModal:  ()   => set({ addModalOpen: false }),

  openEditModal:  (id) => set({ editModalOpen: true, selectedMeetingId: id }),
  closeEditModal: ()   => set({ editModalOpen: false }),

  // ── Client-side filter + sort (applied over React Query data) ─────────────
  applyFilters: (meetings = []) => {
    const {
      searchQuery, statusFilter, typeFilter, organizerFilter, sortField, sortDir,
    } = get()

    let result = meetings.filter((m) => {
      const q = searchQuery.toLowerCase()
      if (
        q &&
        !m.title.toLowerCase().includes(q) &&
        !(m.relatedLabel || '').toLowerCase().includes(q) &&
        !(m.organizer || '').toLowerCase().includes(q) &&
        !(m.location || '').toLowerCase().includes(q) &&
        !(m.description || '').toLowerCase().includes(q)
      ) return false
      if (statusFilter    !== 'All' && m.status    !== statusFilter)    return false
      if (typeFilter      !== 'All' && m.type       !== typeFilter)      return false
      if (organizerFilter !== 'All' && m.organizer  !== organizerFilter) return false
      return true
    })

    result.sort((a, b) => {
      let av = a[sortField] ?? ''
      let bv = b[sortField] ?? ''
      // Combine date + time for accurate datetime sort
      if (sortField === 'scheduledDate') {
        av = `${a.scheduledDate || ''}T${a.scheduledTime || '00:00'}`
        bv = `${b.scheduledDate || ''}T${b.scheduledTime || '00:00'}`
        if (!a.scheduledDate) return 1
        if (!b.scheduledDate) return -1
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1  : -1
      return 0
    })

    return result
  },
}))
