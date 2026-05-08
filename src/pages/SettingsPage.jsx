import React from 'react'
import { Settings } from 'lucide-react'
export function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <Settings size={28} className="text-gray-500" />
      </div>
      <h2 className="font-display text-2xl font-700 text-gray-900 mb-2">Settings</h2>
      <p className="text-sm text-gray-500 max-w-xs">Account and preferences coming soon.</p>
    </div>
  )
}
export default SettingsPage
