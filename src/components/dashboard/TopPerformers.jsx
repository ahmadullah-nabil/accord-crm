import React from 'react'
import { Trophy } from 'lucide-react'
import { PERFORMERS_DATA } from '../../lib/dashboardData.js'
import { Avatar } from '../ui/Avatar.jsx'
import { Badge } from '../ui/Badge.jsx'
import { Skeleton } from '../ui/Skeleton.jsx'

function QuotaBar({ value, color = '#14b8a6' }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-[11px] font-semibold text-gray-600 w-8 text-right">{value}%</span>
    </div>
  )
}

const QUOTA_COLORS = ['#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', '#f97316']
const RANK_MEDALS = ['🥇', '🥈', '🥉']

function formatRevenue(v) {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`
  return `$${v}`
}

export function TopPerformers({ isLoading = false }) {
  if (isLoading) {
    return (
      <div className="card p-5">
        <Skeleton className="h-4 w-32 mb-1.5" />
        <Skeleton className="h-3 w-44 mb-5" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 mb-4">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-12" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-bold text-gray-900 text-base">Top Performers</h3>
          <p className="text-xs text-gray-400 mt-0.5">Quota attainment this month</p>
        </div>
        <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
          <Trophy size={15} className="text-amber-500" />
        </div>
      </div>

      {/* Performers list */}
      <div className="space-y-4">
        {PERFORMERS_DATA.map((p, idx) => (
          <div key={p.id} className="group">
            <div className="flex items-center gap-3 mb-1.5">
              {/* Rank + avatar */}
              <div className="relative flex-shrink-0">
                <Avatar name={p.name} size="sm" />
                {idx < 3 && (
                  <span className="absolute -top-1 -right-1 text-[10px] leading-none">{RANK_MEDALS[idx]}</span>
                )}
              </div>

              {/* Name + role */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-gray-800 truncate">{p.name}</span>
                  <span className="text-xs font-semibold text-gray-700">{formatRevenue(p.revenue)}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant={p.role} className="text-[10px] px-1.5 py-0">{p.role}</Badge>
                  <span className="text-[10px] text-gray-400">{p.deals} deals</span>
                </div>
              </div>
            </div>

            {/* Quota bar */}
            <div className="pl-11">
              <QuotaBar value={p.quota} color={QUOTA_COLORS[idx % QUOTA_COLORS.length]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopPerformers
