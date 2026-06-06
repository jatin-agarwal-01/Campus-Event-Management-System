import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const tabs = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/events', label: 'Events', icon: '🎟️' },
  { to: '/calendar', label: 'Calendar', icon: '📅' },
  { to: '/clubs', label: 'Clubs', icon: '👥' },
  { to: '/dashboard', label: 'Me', icon: '👤', authRequired: true },
  { to: '/login', label: 'Login', icon: '🔑', guestOnly: true },
]

export default function MobileNav() {
  const { isAuthenticated } = useAuthStore()
  const visible = tabs.filter(t =>
    (!t.authRequired && !t.guestOnly) ||
    (t.authRequired && isAuthenticated) ||
    (t.guestOnly && !isAuthenticated)
  )

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-30 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {visible.slice(0, 5).map(tab => (
          <NavLink key={tab.to} to={tab.to} end={tab.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'}`
            }>
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
