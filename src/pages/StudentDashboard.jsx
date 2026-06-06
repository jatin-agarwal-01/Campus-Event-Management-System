import { Link } from 'react-router-dom'
import { AreaChart, Area, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuthStore } from '../store/authStore'
import { useEventStore } from '../store/eventStore'
import { useUIStore } from '../store/uiStore'
import { EVENT_CATEGORIES, MOCK_EVENTS } from '../constants'
import { formatDate } from '../utils'
import Layout from '../components/layout/Layout'
import { StatsCard } from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#14b8a6']

const activityData = [
  { week: 'W1', events: 1 }, { week: 'W2', events: 2 }, { week: 'W3', events: 1 },
  { week: 'W4', events: 3 }, { week: 'W5', events: 2 }, { week: 'W6', events: 4 },
]

const BADGES = [
  { name: 'Early Bird', icon: '🌅', earned: true },
  { name: 'Social Butterfly', icon: '🦋', earned: true },
  { name: 'Hackathon Pro', icon: '💻', earned: false },
  { name: 'Volunteer Star', icon: '⭐', earned: false },
  { name: 'Event Creator', icon: '🎯', earned: false },
]

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const { getUserRegistrations, getEvent, bookmarks, events } = useEventStore()
  const { notifications } = useUIStore()

  const registrations = user ? getUserRegistrations(user.id) : []
  const upcomingRegs = registrations.filter(r => {
    const e = getEvent(r.eventId)
    return e && new Date(e.date) >= new Date() && r.status !== 'cancelled'
  })

  const interestData = (user?.interests || EVENT_CATEGORIES.map(c => c.value).slice(0, 4)).map(cat => ({
    name: EVENT_CATEGORIES.find(c => c.value === cat)?.label || cat,
    value: Math.floor(Math.random() * 5) + 1,
  }))

  const recommended = events.filter(e => user?.interests?.includes(e.category) && e.status === 'live').slice(0, 3)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar name={user?.name} src={user?.avatar} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hey, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-gray-500 text-sm">{user?.department} · Year {user?.year}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Events Registered" value={registrations.length} icon="🎟️" color="blue" change={20} />
          <StatsCard title="Events Attended" value={Math.floor(registrations.length * 0.8)} icon="✅" color="green" change={15} />
          <StatsCard title="Saved Events" value={bookmarks.length} icon="❤️" color="purple" />
          <StatsCard title="XP Points" value={registrations.length * 50 + 120} icon="⚡" color="orange" change={8} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming events */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">📅 Upcoming Events</h2>
                <Link to="/my-events" className="text-sm text-blue-600 hover:underline">View all</Link>
              </div>
              {upcomingRegs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">🎟️</p>
                  <p className="text-gray-500 text-sm">No upcoming events. <Link to="/events" className="text-blue-600 hover:underline">Browse events</Link></p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingRegs.slice(0, 4).map(reg => {
                    const event = getEvent(reg.eventId)
                    if (!event) return null
                    return (
                      <div key={reg.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">🎟️</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{event.title}</p>
                          <p className="text-xs text-gray-500">{formatDate(event.date)} · {event.venue}</p>
                        </div>
                        <Link to={`/events/${event.id}`}><Button size="xs" variant="ghost">→</Button></Link>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Activity chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">📈 Event Activity</h2>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={activityData}>
                  <Area type="monotone" dataKey="events" stroke="#3b82f6" fill="#eff6ff" strokeWidth={2} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recommended */}
            {recommended.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">💡 Recommended for You</h2>
                <div className="space-y-3">
                  {recommended.map(event => (
                    <div key={event.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <img src={event.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{event.title}</p>
                        <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                      </div>
                      <Link to={`/events/${event.id}`}><Button size="xs">View</Button></Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Interest donut */}
            {interestData.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <h2 className="font-bold text-gray-900 dark:text-white text-base mb-4">🎯 Your Interests</h2>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={interestData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value">
                      {interestData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-3">
                  {interestData.map((d, i) => (
                    <span key={d.name} className="text-xs flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />{d.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* XP / Gamification */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-base mb-4">⚡ XP & Level</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">🥈</div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Level 3 — Explorer</p>
                  <p className="text-xs text-gray-500">{registrations.length * 50 + 120} / 500 XP to Level 4</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${Math.min(100, ((registrations.length * 50 + 120) / 500) * 100)}%` }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {BADGES.map(badge => (
                  <div key={badge.name} title={badge.name}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${badge.earned ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-gray-50 grayscale opacity-40 border-2 border-gray-200'}`}>
                    {badge.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Streak */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h2 className="font-bold text-base mb-2">🔥 Streak</h2>
              <p className="text-4xl font-extrabold">7</p>
              <p className="text-blue-200 text-sm">days in a row</p>
              <div className="flex gap-1.5 mt-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-sm">✓</div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-base mb-4">🔔 Recent Notifications</h2>
              <div className="space-y-3">
                {notifications.slice(0, 3).map(n => (
                  <div key={n.id} className={`flex gap-3 items-start ${!n.read ? 'opacity-100' : 'opacity-60'}`}>
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: n.read ? '#d1d5db' : '#3b82f6' }} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
