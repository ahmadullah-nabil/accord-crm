// ─── CRM Users / Team Members ─────────────────────────────────────────────────
//
// Single source of truth for the team member roster used across:
//   • Lead assignee dropdown  (LeadFormModal)
//   • Task assignee dropdown  (TaskFormModal)
//   • Meeting organizer dropdown (MeetingFormModal)
//   • Filter selectors
//   • Activity actor defaults
//
// Future RBAC path
// ────────────────
// When real multi-user auth is fully wired, replace TEAM_MEMBERS with a
// Supabase query:
//
//   const { data } = await supabase.from('profiles').select('id, name, role')
//
// and expose it via a useTeamMembers() React Query hook (see below stub).
// All UI dropdowns already iterate over the array — no template changes needed.

// ── Static roster (matches demo auth accounts in authStore mock) ──────────────
export const TEAM_MEMBERS = [
  { id: '1', name: 'Alex Rivera',   role: 'Admin',     email: 'admin@nexuscrm.io'   },
  { id: '2', name: 'Jordan Kim',    role: 'AGM',       email: 'agm@nexuscrm.io'     },
  { id: '3', name: 'Morgan Chen',   role: 'Manager',   email: 'manager@nexuscrm.io' },
  { id: '4', name: 'Taylor Brooks', role: 'Executive', email: 'exec@nexuscrm.io'    },
]

/** Just the display names — used by existing SELECT dropdowns */
export const TEAM_MEMBER_NAMES = TEAM_MEMBERS.map((m) => m.name)

/** Look up a team member by name */
export function getMemberByName(name) {
  return TEAM_MEMBERS.find((m) => m.name === name) ?? null
}

/** Look up a team member by id */
export function getMemberById(id) {
  return TEAM_MEMBERS.find((m) => m.id === String(id)) ?? null
}

// ── Ownership helper ──────────────────────────────────────────────────────────
// Returns the ownership metadata to stamp onto a newly created record.
// Pass the Zustand auth user object (which has { id, name, role }).
//
// Usage in leadsStore.addLead():
//   const { createdBy, ownerId, ownerName } = ownershipStamp(authUser)
//   await insertLead({ ...payload, createdBy, ownerId })
//
export function ownershipStamp(user) {
  if (!user) return { createdBy: '', ownerId: null, ownerName: '' }
  return {
    createdBy: user.name ?? '',
    ownerId:   user.id   ?? null,
    ownerName: user.name ?? '',
  }
}

// ── Future hook stub (no-op until profiles table query is set up) ─────────────
// When ready, wire this to a Supabase profiles query and replace all references
// to TEAM_MEMBERS with the hook data.
//
// export function useTeamMembers() {
//   const isAuthenticated = useAuthStore(s => s.isAuthenticated)
//   return useQuery({
//     queryKey: ['team_members'],
//     queryFn:  () => supabase.from('profiles').select('id, name, role').then(r => r.data),
//     enabled:   isAuthenticated,
//     staleTime: 1000 * 60 * 10,
//   })
// }
