// ─── Analytics Data Layer ──────────────────────────────────────────────────────
// Replace the async fetch functions below with Supabase aggregation queries.
// All React Query hooks in useAnalytics.js call only these functions.

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// ── KPI Summary ───────────────────────────────────────────────────────────────

export async function fetchKpiSummary(range) {
  await delay(350)
  const multiplier = range === '7d' ? 0.25 : range === '30d' ? 1 : range === '90d' ? 2.8 : 12
  return {
    totalRevenue:     { value: Math.round(284500 * multiplier), trend: 18.2,  label: 'Total Revenue',     suffix: '' },
    activeLeads:      { value: Math.round(1284  * (multiplier > 1 ? 1.1 : 0.8)), trend: 12.5, label: 'Active Leads',      suffix: '' },
    conversionRate:   { value: 24.8, trend: 3.1,   label: 'Conversion Rate',   suffix: '%' },
    dealsWon:         { value: Math.round(48    * multiplier), trend: -4.2,  label: 'Deals Won',          suffix: '' },
    taskCompletionRate: { value: 68.4, trend: 7.3, label: 'Task Completion',   suffix: '%' },
    meetingsConducted:{ value: Math.round(47    * multiplier), trend: 11.8,  label: 'Meetings Conducted', suffix: '' },
    avgDealSize:      { value: 5927,  trend: 6.4,   label: 'Avg Deal Size',     suffix: '' },
    pipelineValue:    { value: Math.round(4515000 * (multiplier > 1 ? 1.05 : 0.9)), trend: 9.7, label: 'Pipeline Value', suffix: '' },
  }
}

// ── Revenue Time Series ───────────────────────────────────────────────────────

const MONTHLY_REVENUE = [
  { label: 'Jan', revenue: 42000, target: 40000, deals: 18 },
  { label: 'Feb', revenue: 38500, target: 42000, deals: 16 },
  { label: 'Mar', revenue: 51200, target: 44000, deals: 22 },
  { label: 'Apr', revenue: 46800, target: 46000, deals: 20 },
  { label: 'May', revenue: 58400, target: 48000, deals: 26 },
  { label: 'Jun', revenue: 54200, target: 50000, deals: 24 },
  { label: 'Jul', revenue: 63100, target: 52000, deals: 28 },
  { label: 'Aug', revenue: 71500, target: 55000, deals: 32 },
  { label: 'Sep', revenue: 68900, target: 58000, deals: 30 },
  { label: 'Oct', revenue: 79200, target: 62000, deals: 36 },
  { label: 'Nov', revenue: 84500, target: 66000, deals: 38 },
  { label: 'Dec', revenue: 91800, target: 70000, deals: 42 },
]

const WEEKLY_REVENUE = [
  { label: 'Mon', revenue: 8200,  target: 7500,  deals: 3 },
  { label: 'Tue', revenue: 9400,  target: 7500,  deals: 4 },
  { label: 'Wed', revenue: 11200, target: 7500,  deals: 5 },
  { label: 'Thu', revenue: 7800,  target: 7500,  deals: 3 },
  { label: 'Fri', revenue: 13500, target: 7500,  deals: 6 },
  { label: 'Sat', revenue: 4200,  target: 3000,  deals: 2 },
  { label: 'Sun', revenue: 2100,  target: 3000,  deals: 1 },
]

export async function fetchRevenueTimeSeries(range) {
  await delay(300)
  if (range === '7d')  return WEEKLY_REVENUE
  if (range === '30d') return MONTHLY_REVENUE.slice(-4).map((d, i) => ({ ...d, label: `W${i + 1}` }))
  if (range === '90d') return MONTHLY_REVENUE.slice(-3).flatMap((m, mi) =>
    Array.from({ length: 4 }, (_, wi) => ({
      label: `${m.label} W${wi + 1}`,
      revenue: Math.round(m.revenue / 4 * (0.8 + Math.random() * 0.5)),
      target:  Math.round(m.target / 4),
      deals:   Math.round(m.deals / 4),
    }))
  )
  return MONTHLY_REVENUE
}

// ── Lead Funnel ───────────────────────────────────────────────────────────────

export async function fetchLeadFunnel(range) {
  await delay(280)
  const m = range === '7d' ? 0.08 : range === '30d' ? 0.33 : range === '90d' ? 1 : 4
  return [
    { stage: 'New',         count: Math.round(384 * m), color: '#3b82f6' },
    { stage: 'Contacted',   count: Math.round(271 * m), color: '#8b5cf6' },
    { stage: 'Qualified',   count: Math.round(189 * m), color: '#14b8a6' },
    { stage: 'Proposal',    count: Math.round(124 * m), color: '#f59e0b' },
    { stage: 'Negotiation', count: Math.round(87  * m), color: '#f97316' },
    { stage: 'Won',         count: Math.round(48  * m), color: '#10b981' },
    { stage: 'Lost',        count: Math.round(21  * m), color: '#f87171' },
  ]
}

// ── Lead Source Breakdown ─────────────────────────────────────────────────────

export async function fetchLeadsBySource(_range) {
  await delay(250)
  return [
    { name: 'Referral',   value: 312, color: '#14b8a6' },
    { name: 'Website',    value: 287, color: '#6366f1' },
    { name: 'LinkedIn',   value: 198, color: '#0ea5e9' },
    { name: 'Cold Call',  value: 174, color: '#f59e0b' },
    { name: 'Partner',    value: 143, color: '#8b5cf6' },
    { name: 'Trade Show', value: 96,  color: '#f97316' },
  ]
}

// ── Lead Stats Monthly ────────────────────────────────────────────────────────

export async function fetchLeadStats(range) {
  await delay(280)
  const data = [
    { label: 'Jan', new: 62,  won: 18, lost: 12 },
    { label: 'Feb', new: 58,  won: 16, lost: 14 },
    { label: 'Mar', new: 74,  won: 22, lost: 10 },
    { label: 'Apr', new: 68,  won: 20, lost: 16 },
    { label: 'May', new: 82,  won: 26, lost: 12 },
    { label: 'Jun', new: 76,  won: 24, lost: 15 },
    { label: 'Jul', new: 91,  won: 28, lost: 11 },
    { label: 'Aug', new: 96,  won: 32, lost: 14 },
    { label: 'Sep', new: 88,  won: 30, lost: 13 },
    { label: 'Oct', new: 104, won: 36, lost: 16 },
    { label: 'Nov', new: 112, won: 38, lost: 18 },
    { label: 'Dec', new: 124, won: 42, lost: 20 },
  ]
  const n = range === '7d' ? 1 : range === '30d' ? 3 : range === '90d' ? 6 : 12
  return data.slice(-n)
}

// ── Task Statistics ───────────────────────────────────────────────────────────

export async function fetchTaskStats(_range) {
  await delay(250)
  return {
    byStatus: [
      { name: 'Completed',   value: 47, color: '#10b981' },
      { name: 'In Progress', value: 23, color: '#3b82f6' },
      { name: 'Todo',        value: 31, color: '#94a3b8' },
      { name: 'Overdue',     value: 8,  color: '#f87171' },
    ],
    byPriority: [
      { name: 'Urgent', value: 12, color: '#ef4444' },
      { name: 'High',   value: 28, color: '#f97316' },
      { name: 'Medium', value: 43, color: '#f59e0b' },
      { name: 'Low',    value: 26, color: '#94a3b8' },
    ],
    completionTrend: [
      { label: 'W1',  completed: 8,  total: 14 },
      { label: 'W2',  completed: 11, total: 16 },
      { label: 'W3',  completed: 9,  total: 13 },
      { label: 'W4',  completed: 14, total: 19 },
      { label: 'W5',  completed: 12, total: 15 },
      { label: 'W6',  completed: 16, total: 20 },
      { label: 'W7',  completed: 13, total: 17 },
      { label: 'W8',  completed: 18, total: 22 },
    ],
    totalTasks:     109,
    completionRate: 68.4,
    overdueCount:   8,
  }
}

// ── Meeting Statistics ────────────────────────────────────────────────────────

export async function fetchMeetingStats(_range) {
  await delay(260)
  return {
    byStatus: [
      { name: 'Completed',   value: 28, color: '#10b981' },
      { name: 'Scheduled',   value: 14, color: '#3b82f6' },
      { name: 'Rescheduled', value: 4,  color: '#f59e0b' },
      { name: 'Cancelled',   value: 3,  color: '#f87171' },
    ],
    byType: [
      { label: 'Demo',             count: 11, color: '#14b8a6' },
      { label: 'Discovery',        count: 9,  color: '#6366f1' },
      { label: 'Negotiation',      count: 7,  color: '#f97316' },
      { label: 'Technical Review', count: 6,  color: '#8b5cf6' },
      { label: 'Kickoff',          count: 5,  color: '#10b981' },
      { label: 'Proposal',         count: 4,  color: '#0ea5e9' },
      { label: 'Partner Sync',     count: 3,  color: '#ec4899' },
      { label: 'Follow-up',        count: 4,  color: '#94a3b8' },
    ],
    totalMeetings: 49,
    completionRate: 57.1,
    avgDurationMins: 58,
  }
}

// ── Team Performance ──────────────────────────────────────────────────────────

export async function fetchTeamPerformance(_range) {
  await delay(300)
  return [
    { name: 'Alex Rivera',   deals: 14, revenue: 84200, meetings: 12, tasks: 28, quota: 92 },
    { name: 'Morgan Chen',   deals: 11, revenue: 67400, meetings: 10, tasks: 24, quota: 87 },
    { name: 'Jordan Kim',    deals: 9,  revenue: 54800, meetings: 9,  tasks: 21, quota: 78 },
    { name: 'Taylor Brooks', deals: 8,  revenue: 48100, meetings: 8,  tasks: 19, quota: 72 },
  ]
}

// ── Recent Activity ───────────────────────────────────────────────────────────

export async function fetchRecentActivity(_range) {
  await delay(220)
  return [
    { id: 1,  type: 'deal_won',    user: 'Alex Rivera',   action: 'closed a deal with',    subject: 'BlueStar Finance',    detail: '৳980,000 · Enterprise',      time: '2 min ago' },
    { id: 2,  type: 'lead_new',    user: 'Jordan Kim',    action: 'created new lead',       subject: 'Sunrise Agro',        detail: 'Agriculture · Inbound',       time: '18 min ago' },
    { id: 3,  type: 'meeting',     user: 'Taylor Brooks', action: 'scheduled meeting with', subject: 'GreenTech BD',        detail: 'May 13 · 10:00 AM',           time: '1 hr ago' },
    { id: 4,  type: 'task_done',   user: 'Morgan Chen',   action: 'completed task',         subject: 'Harbor Shipping',     detail: 'Sent product brochure',       time: '2 hr ago' },
    { id: 5,  type: 'lead_moved',  user: 'Jordan Kim',    action: 'moved lead to Proposal', subject: 'Apex Retail',         detail: '৳560,000 pipeline',           time: '3 hr ago' },
    { id: 6,  type: 'meeting',     user: 'Alex Rivera',   action: 'completed meeting with', subject: 'Pinnacle Insurance',  detail: 'Partner sync',                time: '4 hr ago' },
    { id: 7,  type: 'deal_lost',   user: 'Taylor Brooks', action: 'marked as lost',         subject: 'Dhaka Motors',        detail: 'Price sensitivity',           time: '5 hr ago' },
    { id: 8,  type: 'task_done',   user: 'Alex Rivera',   action: 'completed onboarding',   subject: 'BlueStar Finance',    detail: 'Kickoff meeting done',        time: '6 hr ago' },
    { id: 9,  type: 'lead_new',    user: 'Morgan Chen',   action: 'qualified lead',         subject: 'Harbor Shipping',     detail: 'Moved to Contacted',          time: '8 hr ago' },
    { id: 10, type: 'meeting',     user: 'Jordan Kim',    action: 'completed demo with',    subject: 'Prime Pharma',        detail: 'Compliance module reviewed',  time: '1 day ago' },
  ]
}

// ── Date Range Constants ──────────────────────────────────────────────────────

export const DATE_RANGES = [
  { value: '7d',  label: 'Last 7 days'  },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y',  label: 'This year'    },
]

// ── Format helpers ────────────────────────────────────────────────────────────

export function fmtCurrency(v) {
  if (v >= 1000000) return `৳${(v / 1000000).toFixed(2)}M`
  if (v >= 1000)    return `৳${(v / 1000).toFixed(0)}K`
  return `৳${v}`
}

export function fmtNum(v) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
  if (v >= 1000)    return `${(v / 1000).toFixed(0)}K`
  return String(v)
}
