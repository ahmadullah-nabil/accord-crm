// ─── Settings Data Layer ───────────────────────────────────────────────────────
// Replace these async functions with Supabase calls.
// The React Query hooks in useSettings.js need zero changes.

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms))

// ── Mock settings store ───────────────────────────────────────────────────────
let _settings = {
  // Profile
  profile: {
    name:        'Alex Rivera',
    email:       'admin@nexuscrm.io',
    phone:       '+1 (555) 012-3456',
    title:       'Admin',
    department:  'Leadership',
    bio:         'CRM administrator and sales team lead at Accord.',
    timezone:    'Asia/Dhaka',
    language:    'English',
    dateFormat:  'DD/MM/YYYY',
  },

  // Company
  company: {
    name:        'Accord Technologies',
    website:     'accord.io',
    industry:    'Software / SaaS',
    size:        '11-50 employees',
    address:     'Dhaka, Bangladesh',
    phone:       '+880 2-9999-0000',
    taxId:       '',
    currency:    'BDT',
    fiscalYear:  'January',
  },

  // Notification preferences
  notifications: {
    emailOnLeadAssigned:    true,
    emailOnDealWon:         true,
    emailOnTaskDue:         true,
    emailOnMeetingReminder: true,
    emailOnTeamActivity:    false,
    emailOnSystemUpdate:    true,
    pushLeads:              true,
    pushTasks:              true,
    pushMeetings:           true,
    pushDeals:              true,
    pushSystem:             false,
    digestFrequency:        'daily',  // 'realtime' | 'daily' | 'weekly' | 'never'
  },

  // Appearance
  appearance: {
    theme:           'light',     // 'light' | 'dark' | 'system'
    accentColor:     'teal',      // 'teal' | 'blue' | 'purple' | 'orange'
    fontSize:        'medium',    // 'small' | 'medium' | 'large'
    density:         'comfortable', // 'compact' | 'comfortable' | 'spacious'
    sidebarCollapsed: false,
    animations:      true,
    tableRowHover:   true,
  },

  // Security
  security: {
    twoFactorEnabled:  false,
    sessionTimeout:    '8h',
    loginNotification: true,
    ipWhitelist:       '',
    lastPasswordChange: '2026-01-15',
    activeSessions:    2,
  },

  // Preferences
  preferences: {
    defaultModule:     'dashboard',
    leadsDefaultView:  'table',       // 'table' | 'kanban'
    taskDefaultSort:   'dueDate',
    showWelcomeBanner: true,
    confirmDelete:     true,
    autoSaveDrafts:    true,
    exportFormat:      'xlsx',        // 'xlsx' | 'csv' | 'pdf'
    itemsPerPage:      25,
  },
}

// ── Fetch functions ───────────────────────────────────────────────────────────

export async function fetchSettings() {
  await delay()
  return { ..._settings }
}

export async function fetchProfileSettings() {
  await delay(200)
  return { ..._settings.profile }
}

export async function fetchCompanySettings() {
  await delay(200)
  return { ..._settings.company }
}

export async function fetchNotificationSettings() {
  await delay(200)
  return { ..._settings.notifications }
}

export async function fetchAppearanceSettings() {
  await delay(200)
  return { ..._settings.appearance }
}

export async function fetchSecuritySettings() {
  await delay(200)
  return { ..._settings.security }
}

export async function fetchPreferencesSettings() {
  await delay(200)
  return { ..._settings.preferences }
}

// ── Update functions ──────────────────────────────────────────────────────────

export async function updateProfileSettings(data) {
  await delay(500)
  _settings.profile = { ..._settings.profile, ...data }
  return { ..._settings.profile }
}

export async function updateCompanySettings(data) {
  await delay(500)
  _settings.company = { ..._settings.company, ...data }
  return { ..._settings.company }
}

export async function updateNotificationSettings(data) {
  await delay(400)
  _settings.notifications = { ..._settings.notifications, ...data }
  return { ..._settings.notifications }
}

export async function updateAppearanceSettings(data) {
  await delay(400)
  _settings.appearance = { ..._settings.appearance, ...data }
  return { ..._settings.appearance }
}

export async function updateSecuritySettings(data) {
  await delay(500)
  _settings.security = { ..._settings.security, ...data }
  return { ..._settings.security }
}

export async function updatePreferencesSettings(data) {
  await delay(400)
  _settings.preferences = { ..._settings.preferences, ...data }
  return { ..._settings.preferences }
}

export async function changePassword(currentPassword, newPassword) {
  await delay(700)
  // Mock validation — in production this would verify currentPassword hash
  if (currentPassword === newPassword) {
    throw new Error('New password must differ from current password.')
  }
  if (newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters.')
  }
  _settings.security.lastPasswordChange = new Date().toISOString().split('T')[0]
  return { success: true }
}

// ── Domain constants ──────────────────────────────────────────────────────────

export const SETTINGS_SECTIONS = [
  { id: 'profile',      label: 'Profile',       icon: 'User'      },
  { id: 'company',      label: 'Company',        icon: 'Building2' },
  { id: 'notifications',label: 'Notifications',  icon: 'Bell'      },
  { id: 'appearance',   label: 'Appearance',     icon: 'Palette'   },
  { id: 'security',     label: 'Security',       icon: 'Shield'    },
  { id: 'preferences',  label: 'Preferences',    icon: 'Sliders'   },
]

export const TIMEZONES = [
  'Asia/Dhaka', 'Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore',
  'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles',
  'UTC',
]

export const LANGUAGES = ['English', 'Bengali', 'Hindi', 'Arabic', 'French', 'Spanish']
export const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
export const CURRENCIES = ['BDT', 'USD', 'EUR', 'GBP', 'AED', 'INR', 'SGD']
export const FISCAL_YEARS = ['January', 'April', 'July', 'October']
export const INDUSTRY_OPTIONS = [
  'Software / SaaS', 'Finance / Banking', 'Healthcare',
  'Manufacturing', 'Retail / E-commerce', 'Logistics',
  'Education', 'Real Estate', 'Other',
]
export const COMPANY_SIZES = [
  '1-10 employees', '11-50 employees', '51-200 employees',
  '201-500 employees', '500+ employees',
]
export const SESSION_TIMEOUTS = ['1h', '4h', '8h', '24h', '7d', 'never']
export const DIGEST_FREQUENCIES = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'daily',    label: 'Daily digest' },
  { value: 'weekly',   label: 'Weekly digest' },
  { value: 'never',    label: 'Never' },
]
export const ACCENT_COLORS = [
  { value: 'teal',   label: 'Teal',   hex: '#14b8a6' },
  { value: 'blue',   label: 'Blue',   hex: '#3b82f6' },
  { value: 'purple', label: 'Purple', hex: '#8b5cf6' },
  { value: 'orange', label: 'Orange', hex: '#f97316' },
]
export const MODULE_OPTIONS = [
  { value: 'dashboard',     label: 'Dashboard'     },
  { value: 'leads',         label: 'Leads'         },
  { value: 'contacts',      label: 'Contacts'      },
  { value: 'tasks',         label: 'Tasks'         },
  { value: 'meetings',      label: 'Meetings'      },
  { value: 'analytics',     label: 'Analytics'     },
  { value: 'notifications', label: 'Notifications' },
]
export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100]
export const EXPORT_FORMATS = [
  { value: 'xlsx', label: 'Excel (.xlsx)' },
  { value: 'csv',  label: 'CSV (.csv)'   },
  { value: 'pdf',  label: 'PDF (.pdf)'   },
]
