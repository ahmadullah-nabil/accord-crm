import React from 'react'
import { Search, SlidersHorizontal, Plus, LayoutList, Kanban, X } from 'lucide-react'
import { useLeadsStore, STAGES, PRIORITIES, SOURCES, ASSIGNEES } from '../../stores/leadsStore.js'

export function LeadsToolbar() {
  const {
    searchQuery, setSearchQuery,
    stageFilter, setStageFilter,
    priorityFilter, setPriorityFilter,
    sourceFilter, setSourceFilter,
    assigneeFilter, setAssigneeFilter,
    viewMode, setViewMode,
    openAddModal, clearFilters,
  } = useLeadsStore()

  const hasFilters =
    searchQuery || stageFilter !== 'All' || priorityFilter !== 'All' ||
    sourceFilter !== 'All' || assigneeFilter !== 'All'

  return (
    <div className="card px-4 py-3 space-y-3">
      {/* Row 1: search + view toggle + add */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search leads by name, company or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-base pl-9 py-2 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
              ${viewMode === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutList size={13} /> Table
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
              ${viewMode === 'kanban' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Kanban size={13} /> Kanban
          </button>
        </div>

        {/* Add Lead */}
        <button onClick={openAddModal} className="btn-primary py-2 text-sm flex-shrink-0">
          <Plus size={15} /> Add Lead
        </button>
      </div>

      {/* Row 2: filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal size={13} className="text-gray-400 flex-shrink-0" />

        <FilterSelect label="Stage"    value={stageFilter}    onChange={setStageFilter}    options={STAGES} />
        <FilterSelect label="Priority" value={priorityFilter} onChange={setPriorityFilter} options={PRIORITIES} />
        <FilterSelect label="Source"   value={sourceFilter}   onChange={setSourceFilter}   options={SOURCES} />
        <FilterSelect label="Assignee" value={assigneeFilter} onChange={setAssigneeFilter} options={ASSIGNEES} />

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium ml-1"
          >
            <X size={11} /> Clear
          </button>
        )}
      </div>
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`text-xs font-medium rounded-lg px-2.5 py-1.5 border outline-none cursor-pointer transition-all duration-150
        ${value !== 'All'
          ? 'bg-teal-50 border-teal-300 text-teal-700'
          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
        }`}
    >
      <option value="All">{label}: All</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}
