import React from 'react'
import { Target } from 'lucide-react'
import { LeadsSummaryBar } from '../components/leads/LeadsSummaryBar.jsx'
import { LeadsToolbar }   from '../components/leads/LeadsToolbar.jsx'
import { LeadsTable }     from '../components/leads/LeadsTable.jsx'
import { LeadsKanban }    from '../components/leads/LeadsKanban.jsx'
import { LeadDetailPanel } from '../components/leads/LeadDetailPanel.jsx'
import { LeadFormModal }   from '../components/leads/LeadFormModal.jsx'
import { useLeadsStore }   from '../stores/leadsStore.js'

export function LeadsPage() {
  const { viewMode } = useLeadsStore()

  return (
    <>
      <div className="space-y-4 max-w-[1600px]">
        {/* Page heading */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center ring-1 ring-blue-200">
            <Target size={18} className="text-blue-600" />
          </div>
          <div>
            <h1 className="font-display font-bold text-gray-900 text-xl leading-tight">Leads</h1>
            <p className="text-xs text-gray-500">Manage and track your sales pipeline</p>
          </div>
        </div>

        {/* Pipeline summary */}
        <LeadsSummaryBar />

        {/* Toolbar */}
        <LeadsToolbar />

        {/* View: table or kanban */}
        {viewMode === 'table' ? <LeadsTable /> : <LeadsKanban />}
      </div>

      {/* Detail slide-in panel */}
      <LeadDetailPanel />

      {/* Add / Edit modal */}
      <LeadFormModal />
    </>
  )
}

export default LeadsPage
