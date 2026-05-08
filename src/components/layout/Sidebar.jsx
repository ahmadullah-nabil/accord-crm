import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  BarChart2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Target,
  Bell,
  Zap,
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore.js'
import { useUiStore }   from '../../stores/uiStore.js'
import { Avatar }       from '../ui/Avatar.jsx'
import { Badge }        from '../ui/Badge.jsx'

const NAV_ITEMS = [
  { label: 'Dashboard',  to: '/dashboard',  icon: LayoutDashboard },
  { label: 'Leads',      to: '/leads',      icon: Target },
  { label: 'Contacts',   to: '/contacts',   icon: Users },
  { label: 'Meetings',   to: '/meetings',   icon: Calendar },
  { label: 'Tasks',      to: '/tasks',      icon: CheckSquare },
  { label: 'Analytics',  to: '/analytics',  icon: BarChart2 },
]

const BOTTOM_ITEMS = [
  { label: 'Settings', to: '/settings', icon: Settings },
]

export function Sidebar() {
  const { user, logout }    = useAuthStore()
  const { sidebarCollapsed, toggleSidebar } = useUiStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside
      className={`
        relative flex flex-col h-full
        transition-all duration-300 ease-in-out flex-shrink-0
        ${sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'}
      `}
      style={{ background: '#0f1923' }}
    >
      {/* Logo */}
      <div
        className={`
          flex items-center h-16 px-4 border-b flex-shrink-0
          ${sidebarCollapsed ? 'justify-center' : 'gap-3'}
        `}
        style={{ borderColor: '#1e2d40' }}
      >
        <div className="w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-teal">
          <Zap size={16} fill="white" className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="font-display font-700 text-white text-lg tracking-tight whitespace-nowrap">
            Accord<span className="text-teal-400">CRM</span>
          </span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="
          absolute -right-3 top-[72px] z-10
          w-6 h-6 bg-white rounded-full shadow-card-md
          flex items-center justify-center
          text-gray-500 hover:text-teal-600
          transition-colors duration-200
          border border-gray-200
        "
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed
          ? <ChevronRight size={12} />
          : <ChevronLeft  size={12} />
        }
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-0.5 scrollbar-hide">
        {!sidebarCollapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 select-none"
             style={{ color: '#4a637a' }}>
            Main Menu
          </p>
        )}

        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <SidebarNavItem
            key={to}
            to={to}
            icon={Icon}
            label={label}
            collapsed={sidebarCollapsed}
          />
        ))}

        {!sidebarCollapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest px-3 pt-4 mb-2 select-none"
             style={{ color: '#4a637a' }}>
            System
          </p>
        )}
        {sidebarCollapsed && <div className="my-3 border-t" style={{ borderColor: '#1e2d40' }} />}

        {BOTTOM_ITEMS.map(({ label, to, icon: Icon }) => (
          <SidebarNavItem
            key={to}
            to={to}
            icon={Icon}
            label={label}
            collapsed={sidebarCollapsed}
          />
        ))}
      </nav>

      {/* User section */}
      <div
        className={`
          border-t flex-shrink-0 p-3
          ${sidebarCollapsed ? 'flex flex-col items-center gap-2' : ''}
        `}
        style={{ borderColor: '#1e2d40' }}
      >
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[#1a2535] transition-colors duration-200">
            <Avatar name={user?.name || 'User'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
              <Badge variant={user?.role} className="mt-0.5">{user?.role}</Badge>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#4a637a] hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <>
            <Avatar name={user?.name || 'User'} size="sm" />
            <button
              onClick={handleLogout}
              className="text-[#4a637a] hover:text-red-400 transition-colors p-2 rounded-xl hover:bg-red-400/10"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </>
        )}
      </div>
    </aside>
  )
}

function SidebarNavItem({ to, icon: Icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
         transition-all duration-200 cursor-pointer whitespace-nowrap
         ${collapsed ? 'justify-center' : ''}
         ${isActive
           ? 'bg-teal-500/10 text-teal-400'
           : 'text-[#8fa3b8] hover:bg-[#1a2535] hover:text-white'
         }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={18} className={isActive ? 'text-teal-400' : ''} />
          {!collapsed && <span>{label}</span>}
          {!collapsed && isActive && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
          )}
        </>
      )}
    </NavLink>
  )
}

export default Sidebar
