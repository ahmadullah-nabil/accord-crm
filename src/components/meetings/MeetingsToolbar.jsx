import React from 'react'
import { Search, SlidersHorizontal, Plus, X } from 'lucide-react'
import { useMeetingsStore }                    from '../../stores/meetingsStore.js'
import { MEETING_STATUSES, MEETING_TYPES, MEETING_ORGANIZERS } from '../../lib/meetingsData.js'

export function MeetingsToolbar({ total, filtered }) {
  const {
    searchQuery,     setSearchQuery,
    statusFilter,    setStatusFilter,
    typeFilter,      setTypeFilter,
    organizerFilter, setOrganizerFilter,
    openAddModal,    clearFilters,
  } = useMeetingsStore()

  const hasFilters =
    searchQuery ||
    statusFilter    !== 'All' ||
    typeFilter      !== 'All' ||
    organizerFilter !== 'All'

  return (
    <div className="card px-4 py-3 space-y-3">
      {/* Row 1: search + count + add */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by title, organizer, location or contact…"
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

        {total !== undefined && (
          <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:inline">
            {filtered} of {total}
          </span>
        )}

        <button onClick={openAddModal} className="btn-primary py-2 text-sm flex-shrink-0">
          <Plus size={15} /> Add Meeting
        </button>
      </div>

      {/* Row 2: filter selects */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal size={13} className="text-gray-400 flex-shrink-0" />

        <FilterSelect
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={MEETING_STATUSES}
        />
        <FilterSelect
          label="Type"
          value={typeFilter}
          onChange={setTypeFilter}
          options={MEETING_TYPES}
        />
        <FilterSelect
          label="Organizer"
          value={organizerFilter}
          onChange={setOrganizerFilter}
          options={MEETING_ORGANIZERS}
        />

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
      className={`text-xs font-medium rounded-lg px-2.5 py-1.5 border outline-none cursor-pointer
        transition-all duration-150
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
