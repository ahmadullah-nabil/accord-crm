// ─── Notifications & Activity Data Layer ──────────────────────────────────────
// Replace async functions with Supabase calls — useNotifications.js hooks need
// zero changes because they only call these functions.

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

// ── Mock data store ───────────────────────────────────────────────────────────
let _notifications = [
  {
    id: 'N-001',
    category: 'Deals',
    type: 'deal_won',
    title: 'Deal Won — BlueStar Finance',
    body: 'Alex Rivera closed a ৳980,000 deal with BlueStar Finance. Contract signed and onboarding scheduled.',
    actor: 'Alex Rivera',
    subject: 'BlueStar Finance',
    relatedModule: 'leads',
    relatedId: 'L-006',
    isRead: false,
    isPinned: true,
    createdAt: '2026-05-09T08:14:00',
    tags: ['Enterprise', 'Finance'],
  },
  {
    id: 'N-002',
    category: 'Meetings',
    type: 'meeting_scheduled',
    title: 'Meeting Scheduled — GreenTech BD',
    body: 'ERP Demo with GreenTech BD has been scheduled for May 13 at 10:00 AM on Google Meet.',
    actor: 'Taylor Brooks',
    subject: 'GreenTech BD',
    relatedModule: 'meetings',
    relatedId: 'M-001',
    isRead: false,
    isPinned: false,
    createdAt: '2026-05-09T07:52:00',
    tags: ['Demo', 'Enterprise'],
  },
  {
    id: 'N-003',
    category: 'Tasks',
    type: 'task_overdue',
    title: 'Task Overdue — CFO Sign-off',
    body: 'The task "Get CFO sign-off on Apex Retail proposal" is now overdue. It was due on May 7.',
    actor: 'System',
    subject: 'Apex Retail',
    relatedModule: 'tasks',
    relatedId: 'T-004',
    isRead: false,
    isPinned: false,
    createdAt: '2026-05-09T07:00:00',
    tags: ['Urgent', 'Approval'],
  },
  {
    id: 'N-004',
    category: 'Leads',
    type: 'lead_moved',
    title: 'Lead Moved — Sigma Textiles',
    body: 'Rafiq Uddin (Sigma Textiles) moved from Qualified to Negotiation stage. Deal value: ৳750,000.',
    actor: 'Morgan Chen',
    subject: 'Sigma Textiles',
    relatedModule: 'leads',
    relatedId: 'L-005',
    isRead: false,
    isPinned: false,
    createdAt: '2026-05-08T17:30:00',
    tags: ['Negotiation', 'Manufacturing'],
  },
  {
    id: 'N-005',
    category: 'Team Activity',
    type: 'team_activity',
    title: 'New Contact Added — Roksana Begum',
    body: 'Jordan Kim added Roksana Begum (Sunrise Agro) as a new contact. Inbound inquiry via website.',
    actor: 'Jordan Kim',
    subject: 'Roksana Begum',
    relatedModule: 'contacts',
    relatedId: 'C-012',
    isRead: true,
    isPinned: false,
    createdAt: '2026-05-08T15:10:00',
    tags: ['Agriculture'],
  },
  {
    id: 'N-006',
    category: 'Meetings',
    type: 'meeting_cancelled',
    title: 'Meeting Cancelled — Pinnacle Insurance',
    body: 'Partner sync with Alamgir Hossain (Pinnacle Insurance) was cancelled due to internal board meeting.',
    actor: 'Alex Rivera',
    subject: 'Pinnacle Insurance',
    relatedModule: 'meetings',
    relatedId: 'M-009',
    isRead: true,
    isPinned: false,
    createdAt: '2026-05-08T12:45:00',
    tags: ['Partner', 'Finance'],
  },
  {
    id: 'N-007',
    category: 'Tasks',
    type: 'task_completed',
    title: 'Task Completed — Onboarding Kickoff',
    body: 'Alex Rivera completed the onboarding kickoff task for BlueStar Finance. Go-live target: June 30.',
    actor: 'Alex Rivera',
    subject: 'BlueStar Finance',
    relatedModule: 'tasks',
    relatedId: 'T-006',
    isRead: true,
    isPinned: false,
    createdAt: '2026-05-08T11:00:00',
    tags: ['Onboarding', 'Finance'],
  },
  {
    id: 'N-008',
    category: 'Leads',
    type: 'lead_created',
    title: 'New Lead — Sunrise Agro',
    body: 'A new lead has been created for Roksana Begum from Sunrise Agro via website inquiry.',
    actor: 'System',
    subject: 'Sunrise Agro',
    relatedModule: 'leads',
    relatedId: 'L-012',
    isRead: true,
    isPinned: false,
    createdAt: '2026-05-08T09:20:00',
    tags: ['Agriculture', 'Inbound'],
  },
  {
    id: 'N-009',
    category: 'System',
    type: 'system_update',
    title: 'System Update — v2.4.1',
    body: 'Accord CRM has been updated to v2.4.1. New features include bulk import, improved analytics, and bug fixes.',
    actor: 'System',
    subject: 'Accord CRM',
    relatedModule: null,
    relatedId: null,
    isRead: true,
    isPinned: false,
    createdAt: '2026-05-07T18:00:00',
    tags: ['System'],
  },
  {
    id: 'N-010',
    category: 'Deals',
    type: 'deal_lost',
    title: 'Deal Lost — Dhaka Motors',
    body: 'The deal with Kabir Hasan (Dhaka Motors) has been marked as lost. Reason: price sensitivity.',
    actor: 'Taylor Brooks',
    subject: 'Dhaka Motors',
    relatedModule: 'leads',
    relatedId: 'L-007',
    isRead: true,
    isPinned: false,
    createdAt: '2026-05-07T14:30:00',
    tags: ['Auto'],
  },
  {
    id: 'N-011',
    category: 'Meetings',
    type: 'meeting_scheduled',
    title: 'Meeting Rescheduled — Apex Retail',
    body: 'Pricing negotiation with Maliha Chowdhury rescheduled to May 14 at 3:00 PM due to CFO travel.',
    actor: 'Taylor Brooks',
    subject: 'Apex Retail',
    relatedModule: 'meetings',
    relatedId: 'M-004',
    isRead: true,
    isPinned: false,
    createdAt: '2026-05-07T10:15:00',
    tags: ['Negotiation', 'Retail'],
  },
  {
    id: 'N-012',
    category: 'Team Activity',
    type: 'team_activity',
    title: 'Proposal Sent — GreenTech BD',
    body: 'Taylor Brooks sent the full ERP proposal to Farhan Hossain (GreenTech BD). Awaiting board review.',
    actor: 'Taylor Brooks',
    subject: 'GreenTech BD',
    relatedModule: 'leads',
    relatedId: 'L-001',
    isRead: true,
    isPinned: false,
    createdAt: '2026-05-06T16:00:00',
    tags: ['Proposal', 'Enterprise'],
  },
  {
    id: 'N-013',
    category: 'Tasks',
    type: 'task_overdue',
    title: 'Task Overdue — Partner Sync',
    body: 'The monthly sync with Pinnacle Insurance (Alamgir Hossain) is now overdue by 4 days.',
    actor: 'System',
    subject: 'Pinnacle Insurance',
    relatedModule: 'tasks',
    relatedId: 'T-011',
    isRead: true,
    isPinned: false,
    createdAt: '2026-05-06T09:00:00',
    tags: ['Partner'],
  },
  {
    id: 'N-014',
    category: 'Leads',
    type: 'lead_created',
    title: 'New Lead — EduNet Bangladesh',
    body: 'Sharmin Akter (EduNet Bangladesh) created as a new lead via referral. Potential: ৳220,000.',
    actor: 'Jordan Kim',
    subject: 'EduNet Bangladesh',
    relatedModule: 'leads',
    relatedId: 'L-008',
    isRead: true,
    isPinned: false,
    createdAt: '2026-05-05T14:20:00',
    tags: ['Education', 'Startup'],
  },
  {
    id: 'N-015',
    category: 'System',
    type: 'system_update',
    title: 'Backup Completed',
    body: 'Scheduled data backup completed successfully. All CRM data is secure and up to date.',
    actor: 'System',
    subject: 'Database Backup',
    relatedModule: null,
    relatedId: null,
    isRead: true,
    isPinned: false,
    createdAt: '2026-05-05T02:00:00',
    tags: ['System'],
  },
]

// ── CRUD functions ────────────────────────────────────────────────────────────

export async function fetchNotifications() {
  await delay()
  return [..._notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
}

export async function fetchNotificationById(id) {
  await delay(150)
  return _notifications.find((n) => n.id === id) ?? null
}

export async function markAsRead(id) {
  await delay(150)
  _notifications = _notifications.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  )
  return _notifications.find((n) => n.id === id)
}

export async function markAsUnread(id) {
  await delay(150)
  _notifications = _notifications.map((n) =>
    n.id === id ? { ...n, isRead: false } : n
  )
  return _notifications.find((n) => n.id === id)
}

export async function markAllAsRead() {
  await delay(200)
  _notifications = _notifications.map((n) => ({ ...n, isRead: true }))
  return [..._notifications]
}

export async function clearNotification(id) {
  await delay(200)
  _notifications = _notifications.filter((n) => n.id !== id)
  return { id }
}

export async function clearAllRead() {
  await delay(250)
  _notifications = _notifications.filter((n) => !n.isRead)
  return [..._notifications]
}

export async function togglePin(id) {
  await delay(150)
  _notifications = _notifications.map((n) =>
    n.id === id ? { ...n, isPinned: !n.isPinned } : n
  )
  return _notifications.find((n) => n.id === id)
}

// ── Domain constants ──────────────────────────────────────────────────────────

export const NOTIFICATION_CATEGORIES = [
  'Leads', 'Tasks', 'Meetings', 'Deals', 'System', 'Team Activity',
]

export const NOTIFICATION_TYPES = [
  'deal_won', 'deal_lost', 'lead_created', 'lead_moved',
  'task_completed', 'task_overdue', 'meeting_scheduled',
  'meeting_cancelled', 'team_activity', 'system_update',
]

export const CATEGORY_CONFIG = {
  'Leads':         { color: 'bg-blue-50 text-blue-700',    dot: 'bg-blue-500',    icon: 'Target'    },
  'Tasks':         { color: 'bg-amber-50 text-amber-700',  dot: 'bg-amber-500',   icon: 'CheckSquare'},
  'Meetings':      { color: 'bg-teal-50 text-teal-700',    dot: 'bg-teal-500',    icon: 'Calendar'  },
  'Deals':         { color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', icon: 'TrendingUp'},
  'System':        { color: 'bg-gray-100 text-gray-600',   dot: 'bg-gray-400',    icon: 'Settings'  },
  'Team Activity': { color: 'bg-purple-50 text-purple-700',dot: 'bg-purple-500',  icon: 'Users'     },
}

export const TYPE_CONFIG = {
  'deal_won':          { label: 'Deal Won',          iconColor: 'text-emerald-500', bg: 'bg-emerald-50' },
  'deal_lost':         { label: 'Deal Lost',         iconColor: 'text-red-400',     bg: 'bg-red-50'     },
  'lead_created':      { label: 'Lead Created',      iconColor: 'text-blue-500',    bg: 'bg-blue-50'    },
  'lead_moved':        { label: 'Lead Moved',        iconColor: 'text-indigo-500',  bg: 'bg-indigo-50'  },
  'task_completed':    { label: 'Task Completed',    iconColor: 'text-teal-500',    bg: 'bg-teal-50'    },
  'task_overdue':      { label: 'Task Overdue',      iconColor: 'text-orange-500',  bg: 'bg-orange-50'  },
  'meeting_scheduled': { label: 'Meeting Scheduled', iconColor: 'text-blue-500',    bg: 'bg-blue-50'    },
  'meeting_cancelled': { label: 'Meeting Cancelled', iconColor: 'text-red-400',     bg: 'bg-red-50'     },
  'team_activity':     { label: 'Team Activity',     iconColor: 'text-purple-500',  bg: 'bg-purple-50'  },
  'system_update':     { label: 'System',            iconColor: 'text-gray-400',    bg: 'bg-gray-100'   },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatNotifTime(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now  = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60)           return 'just now'
  if (diff < 3600)         return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)        return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 7)    return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function formatNotifDate(isoString) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}
