import React, { useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Menu,
  X,
  Check,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { useAuthStore }    from '../../stores/authStore.js'
import { useUiStore }      from '../../stores/uiStore.js'
import { Avatar }          from '../ui/Avatar.jsx'
import { Badge }           from '../ui/Badge.jsx'
import { useNotifications } from '../../hooks/useNotifications.js'

const PAGE_TITLES = {
  '/dashboard':     { title: 'Dashboard',      sub: 'Overview of your pipeline'  },
  '/leads':         { title: 'Leads',          sub: 'Manage and track leads'     },
  '/contacts':      { title: 'Contacts',       sub: 'Your contact directory'     },
  '/meetings':      { title: 'Meetings',       sub: 'Scheduled meetings'         },
  '/tasks':         { title: 'Tasks',          sub: 'Pending tasks & follow-ups' },
  '/opportunities': { title: 'Opportunities',  sub: 'Deals pipeline'             },
  '/analytics':     { title: 'Analytics',      sub: 'Reports & insights'         },
  '/notifications': { title: 'Notifications',  sub: 'Activity & alerts'          },
  '/settings':      { title: 'Settings',       sub: 'Account & preferences'      },
}

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'success',
    title: 'Lead qualified',
    body:  'TechCorp Inc. moved to Qualified stage',
    time:  '2m ago',
    read:  false,
  },
  {
    id: 2,
    type: 'info',
    title: 'Meeting reminder',
    body:  'Demo call with Acme in 30 minutes',
    time:  '28m ago',
    read:  false,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Follow-up due',
    body:  '3 leads have overdue follow-ups',
    time:  '1h ago',
    read:  true,
  },
  {
    id: 4,
    type: 'success',
    title: 'Deal won!',
    body:  'GlobalX — $24,000 deal marked as Won',
    time:  '3h ago',
    read:  true,
  },
]

export function Navbar() {
  const { user, logout }    = useAuthStore()
  const {
    notificationsOpen,
    profileMenuOpen,
    toggleNotifications,
    toggleProfileMenu,
    closeAllDropdowns,
    toggleMobileMenu,
    mobileMenuOpen,
  } = useUiStore()

  const navigate   = useNavigate()
  const location   = useLocation()
  const notifRef   = useRef(null)
  const profileRef = useRef(null)

  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'Accord CRM', sub: '' }
  const { data: notifs = [] } = useNotifications()
  const unread   = notifs.filter((n) => !n.isRead).length

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        notifRef.current   && !notifRef.current.contains(e.target) &&
        profileRef.current && !profileRef.current.contains(e.target)
      ) {
        closeAllDropdowns()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [closeAllDropdowns])

  const handleLogout = () => {
    closeAllDropdowns()
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0 z-20">
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden btn-ghost p-2"
        onClick={toggleMobileMenu}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0 hidden sm:block">
        <h1 className="font-display font-700 text-gray-900 text-xl leading-tight">
          {pageInfo.title}
        </h1>
        {pageInfo.sub && (
          <p className="text-xs text-gray-400 leading-tight">{pageInfo.sub}</p>
        )}
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-xs hidden md:block">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search leads, contacts…"
          className="input-base pl-9 py-2 text-xs h-9 bg-gray-50 border-gray-100"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 ml-auto sm:ml-0">

        {/* Notifications — navigate to full page */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { closeAllDropdowns(); navigate('/notifications') }}
            className="relative btn-ghost p-2 rounded-xl"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={toggleProfileMenu}
            className="flex items-center gap-2 btn-ghost px-2 py-1.5 rounded-xl"
          >
            <Avatar name={user?.name || 'User'} size="sm" />
            <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
              {user?.name || 'User'}
            </span>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {profileMenuOpen && (
            <ProfileDropdown user={user} onLogout={handleLogout} onClose={closeAllDropdowns} navigate={navigate} />
          )}
        </div>
      </div>
    </header>
  )
}

function NotificationsDropdown({ notifications, onClose }) {
  const iconMap = {
    success: <Check size={14} className="text-emerald-500" />,
    info:    <Clock  size={14} className="text-blue-500"  />,
    warning: <AlertCircle size={14} className="text-amber-500" />,
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-80 card shadow-card-lg py-1 z-50 animate-fade-in">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">Notifications</span>
        <Badge variant="primary">{notifications.filter((n) => !n.read).length} new</Badge>
      </div>

      <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors
              ${!n.read ? 'bg-teal-50/40' : ''}`}
          >
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0
              ${n.type === 'success' ? 'bg-emerald-50'
              : n.type === 'warning' ? 'bg-amber-50'
              : 'bg-blue-50'}`}
            >
              {iconMap[n.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800">{n.title}</p>
              <p className="text-xs text-gray-500 truncate">{n.body}</p>
            </div>
            <span className="text-[10px] text-gray-400 whitespace-nowrap">{n.time}</span>
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-gray-100">
        <button className="text-xs text-teal-600 font-medium hover:text-teal-700" onClick={onClose}>
          Mark all as read
        </button>
      </div>
    </div>
  )
}

function ProfileDropdown({ user, onLogout, onClose, navigate }) {
  return (
    <div className="absolute right-0 top-full mt-2 w-56 card shadow-card-lg py-1 z-50 animate-fade-in">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        <Badge variant={user?.role} className="mt-1">{user?.role}</Badge>
      </div>

      <div className="py-1">
        <button
          onClick={() => { navigate('/settings'); onClose() }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <User size={15} className="text-gray-400" />
          My Profile
        </button>
        <button
          onClick={() => { navigate('/settings'); onClose() }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Settings size={15} className="text-gray-400" />
          Settings
        </button>
      </div>

      <div className="border-t border-gray-100 py-1">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default Navbar
