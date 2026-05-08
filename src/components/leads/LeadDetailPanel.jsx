import React from 'react'
import {
  X, Phone, Mail, Building2, Calendar, Tag,
  DollarSign, TrendingUp, Pencil, Trash2, Globe,
} from 'lucide-react'
import { useLeadsStore, STAGE_COLORS, PRIORITY_COLORS } from '../../stores/leadsStore.js'
import { Avatar } from '../ui/Avatar.jsx'
import { Badge } from '../ui/Badge.jsx'

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

  const lead = getSelectedLead()

  const handleDelete = () => {
    if (confirm(`Delete lead "${lead?.name}"?`)) {
      deleteLead(selectedLeadId)
    }
  }

  return (
    <>
      {/* Overlay */}
      {detailPanelOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={closeDetail}
        />
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
            <div className="flex items-start justify-between p-5 border-b border-gray-100">
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
                <button
                  onClick={() => openEditModal(lead.id)}
                  className="p-2 rounded-xl text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  onClick={closeDetail}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
            </div>
          </>
        )}
      </div>
    </>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

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
