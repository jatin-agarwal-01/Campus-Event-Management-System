import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../store/uiStore'
import { timeAgo } from '../../utils'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'

const iconMap = {
  registration_confirmed: '✅',
  event_reminder: '⏰',
  event_updated: '📝',
  event_cancelled: '❌',
  approval_result: '📋',
  new_club_event: '🎟️',
  waitlist_slot: '🎫',
  permission_update: '🔐',
}

export default function NotifDrawer() {
  const { notifDrawerOpen, closeNotifDrawer, notifications, markNotifRead, markAllRead } = useUIStore()

  return (
    <AnimatePresence>
      {notifDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30" onClick={closeNotifDrawer} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Notifications</h2>
              <div className="flex items-center gap-2">
                <button onClick={markAllRead} className="text-xs text-blue-600 font-medium hover:underline">Mark all read</button>
                <button onClick={closeNotifDrawer} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">✕</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <EmptyState type="notifications" />
              ) : (
                <ul>
                  {notifications.map(n => (
                    <li key={n.id}
                      onClick={() => markNotifRead(n.id)}
                      className={`flex gap-4 px-5 py-4 border-b border-gray-50 dark:border-gray-800 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                      <span className="text-2xl flex-shrink-0">{iconMap[n.type] || '🔔'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium ${!n.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{n.title}</p>
                          {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{timeAgo(n.time)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
