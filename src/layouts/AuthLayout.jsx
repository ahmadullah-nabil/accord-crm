import React from 'react'
import { Outlet } from 'react-router-dom'
import { Zap } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0f1923] to-gray-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-teal-600/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo mark at top */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center shadow-glow-teal">
              <Zap size={20} fill="white" className="text-white" />
            </div>
            <span className="font-display font-700 text-white text-2xl tracking-tight">
              Accord<span className="text-teal-400">CRM</span>
            </span>
          </div>
        </div>

        {/* Auth card */}
        <div className="bg-white rounded-2xl shadow-card-lg overflow-hidden animate-fade-in">
          <Outlet />
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} AccordCRM. Enterprise sales intelligence.
        </p>
      </div>
    </div>
  )
}

export default AuthLayout
