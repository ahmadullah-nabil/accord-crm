import { create } from 'zustand'

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_LEADS = [
  {
    id: 'L-001', name: 'Farhan Hossain', company: 'GreenTech BD', email: 'farhan@greentech.bd',
    phone: '+880 1711-234567', stage: 'New', value: 850000, source: 'Referral',
    assignee: 'Taylor Brooks', assigneeId: '4', priority: 'High',
    createdAt: '2026-04-10', lastActivity: '2026-05-05', tags: ['Enterprise', 'Q2'],
    notes: 'Interested in full ERP suite. Decision maker confirmed.',
  },
  {
    id: 'L-002', name: 'Sadia Islam', company: 'Nova Logistics', email: 'sadia@novalogistics.com',
    phone: '+880 1812-345678', stage: 'Contacted', value: 420000, source: 'Website',
    assignee: 'Morgan Chen', assigneeId: '3', priority: 'Medium',
    createdAt: '2026-04-15', lastActivity: '2026-05-06', tags: ['SME'],
    notes: 'Requested demo for Q3. Budget approved internally.',
  },
  {
    id: 'L-003', name: 'Tanvir Ahmed', company: 'Prime Pharma', email: 'tanvir@primepharma.bd',
    phone: '+880 1911-456789', stage: 'Qualified', value: 1200000, source: 'Cold Call',
    assignee: 'Jordan Kim', assigneeId: '2', priority: 'High',
    createdAt: '2026-03-28', lastActivity: '2026-05-07', tags: ['Enterprise', 'Healthcare'],
    notes: 'Compliance module is top priority. IT team involved.',
  },
  {
    id: 'L-004', name: 'Maliha Chowdhury', company: 'Apex Retail', email: 'maliha@apexretail.bd',
    phone: '+880 1612-567890', stage: 'Proposal', value: 560000, source: 'LinkedIn',
    assignee: 'Taylor Brooks', assigneeId: '4', priority: 'Medium',
    createdAt: '2026-04-02', lastActivity: '2026-05-04', tags: ['Retail', 'Q2'],
    notes: 'Proposal sent. Awaiting CFO sign-off.',
  },
  {
    id: 'L-005', name: 'Rafiq Uddin', company: 'Sigma Textiles', email: 'rafiq@sigmatex.com',
    phone: '+880 1755-678901', stage: 'Negotiation', value: 750000, source: 'Trade Show',
    assignee: 'Morgan Chen', assigneeId: '3', priority: 'High',
    createdAt: '2026-03-15', lastActivity: '2026-05-08', tags: ['Manufacturing'],
    notes: 'Final pricing discussion. Wants 15% discount on modules.',
  },
  {
    id: 'L-006', name: 'Nusrat Jahan', company: 'BlueStar Finance', email: 'nusrat@bluestar.bd',
    phone: '+880 1833-789012', stage: 'Won', value: 980000, source: 'Partner',
    assignee: 'Alex Rivera', assigneeId: '1', priority: 'High',
    createdAt: '2026-02-20', lastActivity: '2026-04-30', tags: ['Finance', 'Enterprise'],
    notes: 'Contract signed. Onboarding scheduled for June.',
  },
  {
    id: 'L-007', name: 'Kabir Hasan', company: 'Dhaka Motors', email: 'kabir@dhakamotors.com',
    phone: '+880 1944-890123', stage: 'Lost', value: 340000, source: 'Website',
    assignee: 'Taylor Brooks', assigneeId: '4', priority: 'Low',
    createdAt: '2026-03-01', lastActivity: '2026-04-20', tags: ['Auto'],
    notes: 'Went with competitor. Price sensitivity was the blocker.',
  },
  {
    id: 'L-008', name: 'Sharmin Akter', company: 'EduNet Bangladesh', email: 'sharmin@edunet.bd',
    phone: '+880 1677-901234', stage: 'New', value: 220000, source: 'Referral',
    assignee: 'Jordan Kim', assigneeId: '2', priority: 'Low',
    createdAt: '2026-05-01', lastActivity: '2026-05-08', tags: ['Education'],
    notes: 'Startup. Exploring student management + billing.',
  },
  {
    id: 'L-009', name: 'Imran Karim', company: 'Harbor Shipping', email: 'imran@harborshipping.com',
    phone: '+880 1722-012345', stage: 'Contacted', value: 670000, source: 'Cold Call',
    assignee: 'Morgan Chen', assigneeId: '3', priority: 'Medium',
    createdAt: '2026-04-25', lastActivity: '2026-05-06', tags: ['Logistics'],
    notes: 'Introductory call done. Follow-up call set for next week.',
  },
  {
    id: 'L-010', name: 'Parveen Sultana', company: 'National Ceramics', email: 'parveen@natcer.bd',
    phone: '+880 1855-123456', stage: 'Qualified', value: 490000, source: 'LinkedIn',
    assignee: 'Alex Rivera', assigneeId: '1', priority: 'Medium',
    createdAt: '2026-04-08', lastActivity: '2026-05-05', tags: ['Manufacturing', 'Q2'],
    notes: 'Needs inventory and procurement integration.',
  },
]

let nextId = 11

// ─── Store ────────────────────────────────────────────────────────────────────
export const useLeadsStore = create((set, get) => ({
  leads: MOCK_LEADS,
  isLoading: false,

  // Filters
  searchQuery: '',
  stageFilter: 'All',
  priorityFilter: 'All',
  sourceFilter: 'All',
  assigneeFilter: 'All',
  sortField: 'lastActivity',
  sortDir: 'desc',

  // UI state
  viewMode: 'table',           // 'table' | 'kanban'
  selectedLeadId: null,
  detailPanelOpen: false,
  addModalOpen: false,
  editModalOpen: false,

  // ── Actions ──────────────────────────────────────────────────────────────
  setSearchQuery: (q) => set({ searchQuery: q }),
  setStageFilter: (s) => set({ stageFilter: s }),
  setPriorityFilter: (p) => set({ priorityFilter: p }),
  setSourceFilter: (s) => set({ sourceFilter: s }),
  setAssigneeFilter: (a) => set({ assigneeFilter: a }),
  setViewMode: (m) => set({ viewMode: m }),

  setSort: (field) =>
    set((s) => ({
      sortField: field,
      sortDir: s.sortField === field && s.sortDir === 'asc' ? 'desc' : 'asc',
    })),

  openDetail: (id) => set({ selectedLeadId: id, detailPanelOpen: true }),
  closeDetail: () => set({ detailPanelOpen: false, selectedLeadId: null }),

  openAddModal: () => set({ addModalOpen: true }),
  closeAddModal: () => set({ addModalOpen: false }),

  openEditModal: (id) => set({ editModalOpen: true, selectedLeadId: id }),
  closeEditModal: () => set({ editModalOpen: false }),

  addLead: (data) => {
    const id = `L-${String(nextId++).padStart(3, '0')}`
    const lead = {
      ...data,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      tags: data.tags || [],
      notes: data.notes || '',
    }
    set((s) => ({ leads: [lead, ...s.leads], addModalOpen: false }))
  },

  updateLead: (id, data) => {
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === id
          ? { ...l, ...data, lastActivity: new Date().toISOString().split('T')[0] }
          : l
      ),
      editModalOpen: false,
    }))
  },

  updateStage: (id, stage) => {
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === id
          ? { ...l, stage, lastActivity: new Date().toISOString().split('T')[0] }
          : l
      ),
    }))
  },

  deleteLead: (id) => {
    set((s) => ({
      leads: s.leads.filter((l) => l.id !== id),
      detailPanelOpen: s.selectedLeadId === id ? false : s.detailPanelOpen,
      selectedLeadId: s.selectedLeadId === id ? null : s.selectedLeadId,
    }))
  },

  clearFilters: () =>
    set({
      searchQuery: '',
      stageFilter: 'All',
      priorityFilter: 'All',
      sourceFilter: 'All',
      assigneeFilter: 'All',
    }),

  // ── Derived: filtered + sorted leads ─────────────────────────────────────
  getFilteredLeads: () => {
    const {
      leads, searchQuery, stageFilter, priorityFilter,
      sourceFilter, assigneeFilter, sortField, sortDir,
    } = get()

    let result = leads.filter((l) => {
      const q = searchQuery.toLowerCase()
      if (q && !l.name.toLowerCase().includes(q) &&
          !l.company.toLowerCase().includes(q) &&
          !l.email.toLowerCase().includes(q)) return false
      if (stageFilter !== 'All' && l.stage !== stageFilter) return false
      if (priorityFilter !== 'All' && l.priority !== priorityFilter) return false
      if (sourceFilter !== 'All' && l.source !== sourceFilter) return false
      if (assigneeFilter !== 'All' && l.assignee !== assigneeFilter) return false
      return true
    })

    result.sort((a, b) => {
      let av = a[sortField] ?? ''
      let bv = b[sortField] ?? ''
      if (sortField === 'value') { av = Number(av); bv = Number(bv) }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  },

  getSelectedLead: () => {
    const { leads, selectedLeadId } = get()
    return leads.find((l) => l.id === selectedLeadId) || null
  },
}))

// ─── Constants ────────────────────────────────────────────────────────────────
export const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']
export const PRIORITIES = ['High', 'Medium', 'Low']
export const SOURCES = ['Referral', 'Website', 'Cold Call', 'LinkedIn', 'Partner', 'Trade Show']
export const ASSIGNEES = ['Alex Rivera', 'Jordan Kim', 'Morgan Chen', 'Taylor Brooks']

export const STAGE_COLORS = {
  New:         { badge: 'New',         bg: 'bg-blue-500',    light: 'bg-blue-50 text-blue-700' },
  Contacted:   { badge: 'Contacted',   bg: 'bg-indigo-500',  light: 'bg-indigo-50 text-indigo-700' },
  Qualified:   { badge: 'Qualified',   bg: 'bg-teal-500',    light: 'bg-teal-50 text-teal-700' },
  Proposal:    { badge: 'Proposal',    bg: 'bg-amber-500',   light: 'bg-amber-50 text-amber-700' },
  Negotiation: { badge: 'Negotiation', bg: 'bg-orange-500',  light: 'bg-orange-50 text-orange-700' },
  Won:         { badge: 'Won',         bg: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-700' },
  Lost:        { badge: 'Lost',        bg: 'bg-red-500',     light: 'bg-red-50 text-red-700' },
}

export const PRIORITY_COLORS = {
  High:   'bg-red-50 text-red-700',
  Medium: 'bg-amber-50 text-amber-700',
  Low:    'bg-gray-100 text-gray-600',
}
