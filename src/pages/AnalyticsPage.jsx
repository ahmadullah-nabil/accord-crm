import React from 'react'
import { BarChart2 } from 'lucide-react'
export function AnalyticsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
        <BarChart2 size={28} className="text-indigo-500" />
      </div>
      <h2 className="font-display text-2xl font-700 text-gray-900 mb-2">Analytics</h2>
      <p className="text-sm text-gray-500 max-w-xs">Reports and insights coming soon.</p>
    </div>
  )
}
export default AnalyticsPage
