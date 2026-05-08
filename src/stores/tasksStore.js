import { create } from 'zustand'

// UI-only state for the Tasks module.
// All server/data state lives in React Query (useTasks / useTask hooks).
export const useTasksStore = create((set, get) => ({
  // ── Filters ────────────────────────────────────────────────────────────────
  searchQuery:    '',
  statusFilter:   'All',
  priorityFilter: 'All',
  assigneeFilter: 'All',
  sortField:      'dueDate',
  sortDir:        'asc',

  // ── UI state ───────────────────────────────────────────────────────────────
  selectedTaskId:  null,
  detailPanelOpen: false,
  addModalOpen:    false,
  editModalOpen:   false,

  // ── Filter actions ─────────────────────────────────────────────────────────
  setSearchQuery:    (q) => set({ searchQuery: q }),
  setStatusFilter:   (s) => set({ statusFilter: s }),
  setPriorityFilter: (p) => set({ priorityFilter: p }),
  setAssigneeFilter: (a) => set({ assigneeFilter: a }),

  setSort: (field) =>
    set((s) => ({
      sortField: field,
      sortDir: s.sortField === field && s.sortDir === 'asc' ? 'desc' : 'asc',
    })),

  clearFilters: () =>
    set({
      searchQuery:    '',
      statusFilter:   'All',
      priorityFilter: 'All',
      assigneeFilter: 'All',
    }),

  // ── Panel / modal actions ──────────────────────────────────────────────────
  openDetail:     (id) => set({ selectedTaskId: id, detailPanelOpen: true }),
  closeDetail:    ()   => set({ detailPanelOpen: false, selectedTaskId: null }),

  openAddModal:   ()   => set({ addModalOpen: true }),
  closeAddModal:  ()   => set({ addModalOpen: false }),

  openEditModal:  (id) => set({ editModalOpen: true, selectedTaskId: id }),
  closeEditModal: ()   => set({ editModalOpen: false }),

  // ── Client-side filter + sort (applied over React Query data) ─────────────
  applyFilters: (tasks = []) => {
    const {
      searchQuery, statusFilter, priorityFilter, assigneeFilter, sortField, sortDir,
    } = get()

    let result = tasks.filter((t) => {
      const q = searchQuery.toLowerCase()
      if (
        q &&
        !t.title.toLowerCase().includes(q) &&
        !(t.relatedLabel || '').toLowerCase().includes(q) &&
        !(t.assignee || '').toLowerCase().includes(q) &&
        !(t.description || '').toLowerCase().includes(q)
      ) return false
      if (statusFilter   !== 'All' && t.status   !== statusFilter)   return false
      if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false
      if (assigneeFilter !== 'All' && t.assignee !== assigneeFilter) return false
      return true
    })

    result.sort((a, b) => {
      let av = a[sortField] ?? ''
      let bv = b[sortField] ?? ''
      // Null dates sort to end
      if (sortField === 'dueDate') {
        if (!av) return 1
        if (!bv) return -1
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1  : -1
      return 0
    })

    return result
  },
}))
