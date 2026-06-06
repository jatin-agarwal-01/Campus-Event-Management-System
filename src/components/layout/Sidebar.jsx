import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../store/uiStore'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { to: '/', label: 'Home', icon: '🏠', roles: ['all'] },
  { to: '/events', label: 'Events', icon: '🎟️', roles: ['all'] },
  { to: '/calendar', label: 'Calendar', icon: '📅', roles: ['all'] },
  { to: '/clubs', label: 'Clubs', icon: '👥', roles: ['all'] },
  { to: '/dashboard', label: 'My Dashboard', icon: '📊', roles: ['student', 'organizer', 'faculty', 'hod', 'super_admin'] },
  { to: '/my-events', label: 'My Registrations', icon: '📋', roles: ['student', 'organizer'] },
  { to: '/organizer/dashboard', label: 'Organizer Panel', icon: '🎯', roles: ['organizer', 'faculty', 'hod', 'super_admin'] },
  { to: '/permissions', label: 'Permissions', icon: '🔐', roles: ['organizer', 'faculty', 'hod', 'super_admin'] },
  { to: '/venues', label: 'Venues', icon: '🏛️', roles: ['all'] },
  { to: '/leaderboard', label: 'Leaderboard', icon: '🏆', roles: ['all'] },
  { to: '/admin', label: 'Admin Panel', icon: '⚙️', roles: ['super_admin', 'hod'] },
]

export default function Sidebar() {
  const { sidebarOpen } = useUIStore()
  const { user } = useAuthStore()

  const visible = navItems.filter(item =>
    item.roles.includes('all') || (user && item.roles.includes(user.role))
  )

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside initial={{ x: -240, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -240, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="hidden lg:flex flex-col w-60 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="flex-1 py-4 px-3">
            {visible.map(item => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5 ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`
                }>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400">CEMS v2.0 · React + Tailwind</p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
