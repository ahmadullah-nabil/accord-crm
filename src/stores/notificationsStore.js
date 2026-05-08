import { create } from 'zustand'

// UI-only state for the Notifications module.
// All notification data lives in React Query (useNotifications hooks).
export const useNotificationsStore = create((set, get) => ({
  // ── Filters ────────────────────────────────────────────────────────────────
  searchQuery:      '',
  categoryFilter:   'All',
  readFilter:       'All',   // 'All' | 'Unread' | 'Read'

  // ── UI state ───────────────────────────────────────────────────────────────
  selectedNotifId:  null,
  detailPanelOpen:  false,

  // ── Filter actions ─────────────────────────────────────────────────────────
  setSearchQuery:    (q) => set({ searchQuery: q }),
  setCategoryFilter: (c) => set({ categoryFilter: c }),
  setReadFilter:     (r) => set({ readFilter: r }),

  clearFilters: () =>
    set({ searchQuery: '', categoryFilter: 'All', readFilter: 'All' }),

  // ── Panel actions ──────────────────────────────────────────────────────────
  openDetail:  (id) => set({ selectedNotifId: id, detailPanelOpen: true }),
  closeDetail: ()   => set({ detailPanelOpen: false, selectedNotifId: null }),

  // ── Client-side filter (applied over React Query data) ────────────────────
  applyFilters: (notifications = []) => {
    const { searchQuery, categoryFilter, readFilter } = get()

    return notifications.filter((n) => {
      const q = searchQuery.toLowerCase()
      if (
        q &&
        !n.title.toLowerCase().includes(q) &&
        !n.body.toLowerCase().includes(q) &&
        !n.actor.toLowerCase().includes(q) &&
        !n.subject.toLowerCase().includes(q)
      ) return false

      if (categoryFilter !== 'All' && n.category !== categoryFilter) return false

      if (readFilter === 'Unread' && n.isRead)  return false
      if (readFilter === 'Read'   && !n.isRead) return false

      return true
    })
  },
}))
