import React from 'react'
import { CheckSquare } from 'lucide-react'
export function TasksPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
        <CheckSquare size={28} className="text-emerald-500" />
      </div>
      <h2 className="font-display text-2xl font-700 text-gray-900 mb-2">Tasks</h2>
      <p className="text-sm text-gray-500 max-w-xs">Task management coming soon.</p>
    </div>
  )
}
export default TasksPage
