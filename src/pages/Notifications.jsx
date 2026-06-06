import { useUIStore } from '../store/uiStore'
import { timeAgo } from '../utils'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'

const iconMap = {
  registration_confirmed: '✅', event_reminder: '⏰', event_updated: '📝',
  event_cancelled: '❌', approval_result: '📋', new_club_event: '🎟️',
  waitlist_slot: '🎫', permission_update: '🔐',
}

export default function Notifications() {
  const { notifications, markAllRead, markNotifRead } = useUIStore()

  const today = notifications.filter(n => new Date(n.time) > new Date(Date.now() - 86400000))
  const yesterday = notifications.filter(n => {
    const t = new Date(n.time)
    return t <= new Date(Date.now() - 86400000) && t > new Date(Date.now() - 172800000)
  })
  const older = notifications.filter(n => new Date(n.time) <= new Date(Date.now() - 172800000))

  const Section = ({ title, items }) => items.length === 0 ? null : (
    <div className="mb-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-2">{title}</p>
      <div className="space-y-2">
        {items.map(n => (
          <div key={n.id} onClick={() => markNotifRead(n.id)} className={`flex gap-4 p-4 rounded-2xl cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${!n.read ? 'bg-blue-50/60 dark:bg-blue-900/10' : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800'}`}>
            <span className="text-2xl flex-shrink-0">{iconMap[n.type] || '🔔'}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-sm font-semibold ${!n.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{n.title}</p>
                {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{timeAgo(n.time)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <Button variant="ghost" size="sm" onClick={markAllRead}>Mark all read</Button>
        </div>
        {notifications.length === 0 ? <EmptyState type="notifications" /> : (
          <>
            <Section title="Today" items={today} />
            <Section title="Yesterday" items={yesterday} />
            <Section title="Older" items={older} />
          </>
        )}
      </div>
    </Layout>
  )
}
