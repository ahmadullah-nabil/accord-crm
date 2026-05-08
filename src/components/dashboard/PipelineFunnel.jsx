import React from 'react'
import { PIPELINE_DATA } from '../../lib/dashboardData.js'
import { Skeleton } from '../ui/Skeleton.jsx'

function formatValue(v) {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`
  if (v >= 1000)    return `$${(v / 1000).toFixed(0)}K`
  return `$${v}`
}

export function PipelineFunnel({ isLoading = false }) {
  if (isLoading) {
    return (
      <div className="card p-5">
        <Skeleton className="h-4 w-36 mb-1.5" />
        <Skeleton className="h-3 w-48 mb-5" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 mb-3">
            <Skeleton className="h-8 rounded-lg" style={{ width: `${100 - i * 14}%` }} />
          </div>
        ))}
      </div>
    )
  }

  const maxCount = PIPELINE_DATA[0].count

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="mb-5">
        <h3 className="font-display font-bold text-gray-900 text-base">Pipeline Funnel</h3>
        <p className="text-xs text-gray-400 mt-0.5">Lead progression across stages</p>
      </div>

      {/* Funnel bars */}
      <div className="space-y-2.5">
        {PIPELINE_DATA.map((stage, idx) => {
          const barWidth = (stage.count / maxCount) * 100
          const dropOff = idx > 0
            ? Math.round(((PIPELINE_DATA[idx - 1].count - stage.count) / PIPELINE_DATA[idx - 1].count) * 100)
            : 0

          return (
            <div key={stage.stage} className="group">
              {/* Drop-off indicator */}
              {idx > 0 && (
                <div className="flex items-center gap-2 mb-1.5 pl-1">
                  <div className="w-px h-3 bg-gray-200 ml-1" />
                  <span className="text-[10px] text-gray-400 font-medium">↓ {dropOff}% drop-off</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                {/* Stage label */}
                <div className="w-24 flex-shrink-0">
                  <span className="text-xs font-semibold text-gray-700">{stage.stage}</span>
                </div>

                {/* Bar container */}
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-100 rounded-lg h-9 overflow-hidden">
                    <div
                      className="h-full rounded-lg flex items-center justify-end pr-2.5 transition-all duration-700"
                      style={{
                        width: `${barWidth}%`,
                        background: stage.color,
                        opacity: 0.85 + (idx * 0.02),
                      }}
                    >
                      <span className="text-[11px] font-bold text-white whitespace-nowrap">
                        {stage.count}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Value */}
                <div className="w-16 text-right flex-shrink-0">
                  <span className="text-xs font-semibold text-gray-600">{formatValue(stage.value)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary footer */}
      <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-xs text-gray-400">Total Leads</p>
          <p className="font-bold text-gray-900 text-sm mt-0.5">
            {PIPELINE_DATA[0].count.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Win Rate</p>
          <p className="font-bold text-teal-600 text-sm mt-0.5">
            {((PIPELINE_DATA[PIPELINE_DATA.length - 1].count / PIPELINE_DATA[0].count) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Pipeline Value</p>
          <p className="font-bold text-gray-900 text-sm mt-0.5">
            {formatValue(PIPELINE_DATA[0].value)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PipelineFunnel
