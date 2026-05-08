import React from 'react'
import {
  Trophy, UserCheck, Calendar, FileText,
  UserPlus, XCircle, Phone,
} from 'lucide-react'
import { ACTIVITY_DATA } from '../../lib/dashboardData.js'
import { Avatar } from '../ui/Avatar.jsx'
import { Skeleton } from '../ui/Skeleton.jsx'

const TYPE_CONFIG = {
  deal_won:          { icon: Trophy,    bg: 'bg-emerald-50', color: 'text-emerald-600', dot: 'bg-emerald-400' },
  lead_qualified:    { icon: UserCheck, bg: 'bg-teal-50',    color: 'text-teal-600',    dot: 'bg-teal-400'    },
  meeting_scheduled: { icon: Calendar,  bg: 'bg-blue-50',    color: 'text-blue-600',    dot: 'bg-blue-400'    },
  note_added:        { icon: FileText,  bg: 'bg-amber-50',   color: 'text-amber-600',   dot: 'bg-amber-400'   },
  lead_created:      { icon: UserPlus,  bg: 'bg-indigo-50',  color: 'text-indigo-600',  dot: 'bg-indigo-400'  },
  deal_lost:         { icon: XCircle,   bg: 'bg-red-50',     color: 'text-red-500',     dot: 'bg-red-400'     },
  follow_up:         { icon: Phone,     bg: 'bg-purple-50',  color: 'text-purple-600',  dot: 'bg-purple-400'  },
}

function ActivityItem({ item, isLast }) {
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.note_added
  const Icon = cfg.icon

  return (
    <div className="flex gap-3 group">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}>
          <Icon size={14} className={cfg.color} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-gray-100 mt-2 mb-1" />}
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${!isLast ? 'pb-4' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 leading-snug">
              <span className="font-semibold text-gray-900">{item.user}</span>
              {' '}
              <span className="text-gray-500">{item.action}</span>
              {' '}
              <span className="font-medium text-gray-800">{item.subject}</span>
            </p>
            {item.detail && (
              <p className="text-xs text-gray-400 mt-0.5 truncate">{item.detail}</p>
            )}
          </div>
          <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">{item.time}</span>
        </div>
      </div>
    </div>
  )
}

export function ActivityTimeline({ isLoading = false, maxItems = 7 }) {
  if (isLoading) {
    return (
      <div className="card p-5">
        <Skeleton className="h-4 w-36 mb-1.5" />
        <Skeleton className="h-3 w-48 mb-5" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3 mb-4">
            <Skeleton className="w-8 h-8 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const items = ACTIVITY_DATA.slice(0, maxItems)

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-bold text-gray-900 text-base">Recent Activity</h3>
          <p className="text-xs text-gray-400 mt-0.5">Live team updates</p>
        </div>
        <button className="text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors">
          View all
        </button>
      </div>

      {/* Timeline */}
      <div>
        {items.map((item, idx) => (
          <ActivityItem key={item.id} item={item} isLast={idx === items.length - 1} />
        ))}
      </div>
    </div>
  )
}

export default ActivityTimeline
