import React from 'react'
import { Target } from 'lucide-react'

export function LeadsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
        <Target size={28} className="text-blue-500" />
      </div>
      <h2 className="font-display text-2xl font-700 text-gray-900 mb-2">Leads</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        Lead management with table, filters, pipeline stages, and detail view — coming in Step 3.
      </p>
    </div>
  )
}

export default LeadsPage
