import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore.js'
import { KPI_DATA } from '../lib/dashboardData.js'
import { KpiCard }          from '../components/dashboard/KpiCard.jsx'
import { RevenueChart }     from '../components/dashboard/RevenueChart.jsx'
import { PipelineFunnel }   from '../components/dashboard/PipelineFunnel.jsx'
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline.jsx'
import { TopPerformers }    from '../components/dashboard/TopPerformers.jsx'
import { QuickActions }     from '../components/dashboard/QuickActions.jsx'
import { LeadsChart }       from '../components/dashboard/LeadsChart.jsx'

function WelcomeBanner({ user }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] || 'there'
  return (
    <div className="relative rounded-2xl overflow-hidden p-5 mb-0" style={{ background:'linear-gradient(135deg,#0f1923 0%,#1a2d40 50%,#0d3d35 100%)' }}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-teal-400 text-sm font-medium mb-0.5">{greeting},</p>
          <h2 className="font-display font-bold text-white text-2xl mb-1">{firstName} 👋</h2>
          <p className="text-[#8fa3b8] text-sm">Here's what's happening with your pipeline today.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label:'Open Leads', value:'1,284', color:'bg-teal-500/20 text-teal-300 border-teal-500/30' },
            { label:'Due Today',  value:'8 tasks', color:'bg-amber-500/20 text-amber-300 border-amber-500/30' },
            { label:'Meetings',   value:'3 today', color:'bg-blue-500/20 text-blue-300 border-blue-500/30' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${s.color} text-xs font-medium`}>
              <span>{s.label}:</span><span className="font-bold">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 900); return () => clearTimeout(t) }, [])

  return (
    <div className="space-y-5 max-w-[1600px]">
      <WelcomeBanner user={user} />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_DATA.map(kpi => (
          <KpiCard key={kpi.id} label={kpi.label} value={kpi.value} trend={kpi.trend} period={kpi.period} icon={kpi.icon} color={kpi.color} isLoading={isLoading} />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Revenue + Pipeline */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3"><RevenueChart isLoading={isLoading} /></div>
        <div className="xl:col-span-2"><PipelineFunnel isLoading={isLoading} /></div>
      </div>

      {/* Activity + Performers + Leads */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-1"><ActivityTimeline isLoading={isLoading} /></div>
        <div className="xl:col-span-2 flex flex-col gap-4">
          <TopPerformers isLoading={isLoading} />
          <LeadsChart isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
