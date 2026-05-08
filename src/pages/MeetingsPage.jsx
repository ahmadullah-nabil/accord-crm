import React from 'react'
import { Calendar } from 'lucide-react'
import { useMeetings }           from '../hooks/useMeetings.js'
import { useMeetingsStore }      from '../stores/meetingsStore.js'
import { MeetingsSummaryBar }    from '../components/meetings/MeetingsSummaryBar.jsx'
import { MeetingsToolbar }       from '../components/meetings/MeetingsToolbar.jsx'
import { MeetingsTable }         from '../components/meetings/MeetingsTable.jsx'
import { MeetingDetailPanel }    from '../components/meetings/MeetingDetailPanel.jsx'
import { MeetingFormModal }      from '../components/meetings/MeetingFormModal.jsx'

export function MeetingsPage() {
  const { data: allMeetings = [], isLoading, isError } = useMeetings()
  const { applyFilters } = useMeetingsStore()

  const filtered = applyFilters(allMeetings)

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-sm text-red-500">Failed to load meetings. Please try again.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4 max-w-[1600px]">
        {/* Page heading */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center ring-1 ring-amber-200">
            <Calendar size={18} className="text-amber-600" />
          </div>
          <div>
            <h1 className="font-display font-bold text-gray-900 text-xl leading-tight">Meetings</h1>
            <p className="text-xs text-gray-500">Schedule and track all client meetings</p>
          </div>
        </div>

        {/* Status summary */}
        <MeetingsSummaryBar meetings={allMeetings} />

        {/* Toolbar */}
        <MeetingsToolbar total={allMeetings.length} filtered={filtered.length} />

        {/* Table */}
        <MeetingsTable meetings={filtered} isLoading={isLoading} />
      </div>

      {/* Detail panel */}
      <MeetingDetailPanel />

      {/* Add / Edit modal */}
      <MeetingFormModal />
    </>
  )
}

export default MeetingsPage
