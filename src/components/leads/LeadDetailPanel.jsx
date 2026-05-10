import React from 'react'
import {
  X, Phone, Mail, Building2, Calendar, Tag,
  DollarSign, TrendingUp, Pencil, Trash2, Globe,
  Plus, Clock, CheckCircle2, XCircle, RefreshCw,
  Activity, UserPlus, ArrowRight, FileText, RotateCcw,
} from 'lucide-react'
import { useLeadsStore, STAGE_COLORS, PRIORITY_COLORS } from '../../stores/leadsStore.js'
import { useMeetingsStore }        from '../../stores/meetingsStore.js'
import { useOpportunitiesStore }   from '../../stores/opportunitiesStore.js'
import { useLeadMeetings }         from '../../hooks/useMeetings.js'
import { useLeadPermissions }      from '../../hooks/usePermissions.js'
import { STATUS_CONFIG, formatMeetingDateTime } from '../../lib/meetingsData.js'
import { TimelinePanel }           from '../timeline/TimelinePanel.jsx'
import { Avatar }                  from '../ui/Avatar.jsx'
import { Skeleton }                from '../ui/Skeleton.jsx'

const fmt = (n) =>
  n >= 1000000
    ? `৳${(n / 1000000).toFixed(2)}M`
    : n >= 1000
    ? `৳${(n / 1000).toFixed(0)}K`
    : `৳${n}`

export function LeadDetailPanel() {
  const {
    detailPanelOpen, closeDetail, getSelectedLead,
    openEditModal, deleteLead, selectedLeadId,
  } = useLeadsStore()

  const { openAddModalWithPrefill: openMeetingWithPrefill, openDetail: openMeetingDetail } = useMeetingsStore()
  const { openAddModalWithPrefill: openOppWithPrefill } = useOpportunitiesStore()

  const lead = getSelectedLead()

  // Permission object — drives all conditional rendering in this panel
  const perms = useLeadPermissions(lead)

  // Fetch meetings linked to this lead (derived from the React Query meetings cache)
  const {
    data: linkedMeetings = [],
    isLoading: meetingsLoading,
  } = useLeadMeetings(detailPanelOpen ? selectedLeadId : null)



  const handleDelete = () => {
    if (confirm(`Delete lead "${lead?.name}"?`)) {
      deleteLead(selectedLeadId)
    }
  }

  const handleScheduleMeeting = () => {
    if (!lead) return
    openMeetingWithPrefill({
      relatedType:  'Lead',
      relatedId:    lead.id,
      relatedLabel: `${lead.name} — ${lead.company}`,
      title:        `Meeting — ${lead.company}`,
      participants: lead.name ? [lead.name] : [],
    })
  }

  const handleConvertToOpportunity = () => {
    if (!lead) return
    openOppWithPrefill({
      title:       `${lead.company} — Opportunity`,
      company:     lead.company,
      email:       lead.email,
      phone:       lead.phone,
      assignee:    lead.assignee,
      value:       String(lead.value || ''),
      sourceLeadId: lead.id,
      stage:       'Qualified',
      probability: 30,
    })
  }

  return (
    <>
      {/* Overlay */}
      {detailPanelOpen && (
        <div className="fixed inset-0 bg-black/20 z-30" onClick={closeDetail} />
      )}

      {/* Panel */}
      <div
        className={`
          fixed inset-y-0 right-0 z-40 w-[400px] max-w-full bg-white shadow-card-lg
          flex flex-col transition-transform duration-300 ease-in-out
          ${detailPanelOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {!lead ? null : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Avatar name={lead.name} size="lg" />
                <div>
                  <h3 className="font-display font-bold text-gray-900 text-base leading-tight">{lead.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                    <Building2 size={12} className="text-gray-400" />
                    {lead.company}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {perms.canConvert && (
                  <button
                    onClick={handleConvertToOpportunity}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
                    title="Convert to Opportunity"
                  >
                    <TrendingUp size={12} /> Convert
                  </button>
                )}
                {perms.canEdit && (
                  <button
                    onClick={() => openEditModal(lead.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                    title="Edit lead"
                  >
                    <Pencil size={15} />
                  </button>
                )}
                {perms.canDelete && (
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete lead"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
                <button
                  onClick={closeDetail}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Close"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">

              {/* Stage + Priority row */}
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${STAGE_COLORS[lead.stage]?.light}`}>
                  {lead.stage}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${PRIORITY_COLORS[lead.priority]}`}>
                  {lead.priority} Priority
                </span>
                <span className="ml-auto font-mono font-bold text-gray-900 text-lg">{fmt(lead.value)}</span>
              </div>

              {/* Contact info */}
              <Section title="Contact">
                <InfoRow icon={Mail} label="Email" value={lead.email} href={`mailto:${lead.email}`} />
                <InfoRow icon={Phone} label="Phone" value={lead.phone} href={`tel:${lead.phone}`} />
                <InfoRow icon={Globe} label="Source" value={lead.source} />
              </Section>

              {/* Deal info */}
              <Section title="Deal">
                <InfoRow icon={DollarSign} label="Value" value={fmt(lead.value)} />
                <InfoRow icon={Calendar} label="Created" value={lead.createdAt} />
                <InfoRow icon={TrendingUp} label="Last Activity" value={lead.lastActivity} />
                <InfoRow icon={TrendingUp} label="Lead ID" value={lead.id} />
              </Section>

              {/* Assignee */}
              <Section title="Assignee">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Avatar name={lead.assignee} size="md" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lead.assignee}</p>
                    <p className="text-xs text-gray-500">Sales Representative</p>
                  </div>
                </div>
              </Section>

              {/* Tags */}
              {lead.tags?.length > 0 && (
                <Section title="Tags">
                  <div className="flex flex-wrap gap-2">
                    {lead.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {/* Notes */}
              {lead.notes && (
                <Section title="Notes">
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">
                    {lead.notes}
                  </p>
                </Section>
              )}

              {/* ── Related Meetings ───────────────────────────────────────── */}
              <Section
                title="Meetings"
                action={
                  perms.canSchedule ? (
                    <button
                      onClick={handleScheduleMeeting}
                      className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                      title="Schedule a meeting for this lead"
                    >
                      <Plus size={12} />
                      Schedule
                    </button>
                  ) : null
                }
              >
                {meetingsLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-14 w-full rounded-xl" />
                    <Skeleton className="h-14 w-full rounded-xl" />
                  </div>
                ) : linkedMeetings.length === 0 ? (
                  <div className="text-center py-4 px-3 bg-gray-50 rounded-xl">
                    <Calendar size={18} className="text-gray-300 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-400">No meetings scheduled</p>
                    <button
                      onClick={handleScheduleMeeting}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium mt-1 transition-colors"
                    >
                      Schedule one now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {linkedMeetings.map((meeting) => (
                      <MeetingCard
                        key={meeting.id}
                        meeting={meeting}
                        onClick={() => openMeetingDetail(meeting.id)}
                      />
                    ))}
                  </div>
                )}
              </Section>

              {/* ── Unified Timeline ─────────────────────────────────────────── */}
              <TimelinePanel
                entityType="lead"
                entityId={selectedLeadId}
                entityLabel={lead?.company || lead?.name || ''}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}

function ActivityEntry({ event, isLast }) {
  const cfg = ACT_CONFIG[event.type] || { icon: Activity, bg: 'bg-gray-100', color: 'text-gray-400' }
  const Icon = cfg.icon

  return (
    <div className="flex gap-2.5 group">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={12} className={cfg.color} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-gray-100 mt-1.5 mb-1" />}
      </div>
      <div className={`flex-1 min-w-0 ${!isLast ? 'pb-3' : ''}`}>
        <p className="text-xs text-gray-700 leading-snug">
          <span className="font-semibold text-gray-900">{event.actor}</span>
          {' '}
          <span className="text-gray-500">{event.action}</span>
          {event.subject && event.subject !== event.actor && (
            <><span> </span><span className="font-medium text-gray-800">{event.subject}</span></>
          )}
        </p>
        {event.detail && (
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{event.detail}</p>
        )}
        <p className="text-[10px] text-gray-300 mt-0.5">{relativeTime(event.occurredAt)}</p>
      </div>
    </div>
  )
}

// ── Related meeting card ──────────────────────────────────────────────────────
function MeetingCard({ meeting, onClick }) {
  const sc = STATUS_CONFIG[meeting.status] || STATUS_CONFIG['Scheduled']

  const StatusIcon =
    meeting.status === 'Completed'   ? CheckCircle2 :
    meeting.status === 'Cancelled'   ? XCircle      :
    meeting.status === 'Rescheduled' ? RefreshCw    :
                                       Clock

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-150 group"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-gray-900 leading-snug group-hover:text-teal-700 transition-colors truncate">
          {meeting.title}
        </p>
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${sc.color}`}>
          <StatusIcon size={9} />
          {sc.label}
        </span>
      </div>

      <p className="text-[11px] text-gray-500 mt-1">
        {meeting.scheduledDate
          ? formatMeetingDateTime(meeting.scheduledDate, meeting.scheduledTime)
          : 'No date set'}
      </p>

      {meeting.organizer && (
        <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
          <Avatar name={meeting.organizer} size="xs" />
          {meeting.organizer}
        </p>
      )}
    </button>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children, action }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 flex items-center gap-1">
          {Icon && <Icon size={10} className="text-gray-300" />}
          {title}
        </p>
        {action}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

// ── InfoRow ───────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, href }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <Icon size={14} className="text-gray-400 flex-shrink-0" />
      <span className="text-xs text-gray-500 w-24 flex-shrink-0">{label}</span>
      {href ? (
        <a href={href} className="text-sm text-teal-600 hover:underline font-medium truncate">{value}</a>
      ) : (
        <span className="text-sm text-gray-800 font-medium truncate">{value}</span>
      )}
    </div>
  )
}
