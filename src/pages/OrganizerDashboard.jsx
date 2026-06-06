import { Link } from 'react-router-dom'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuthStore } from '../store/authStore'
import { useEventStore } from '../store/eventStore'
import { EVENT_STATUS } from '../constants'
import { formatDate, statusColor, downloadCSV } from '../utils'
import Layout from '../components/layout/Layout'
import { StatsCard } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import toast from 'react-hot-toast'

const regTrend = [
  { day: 'Mon', regs: 12 }, { day: 'Tue', regs: 19 }, { day: 'Wed', regs: 8 },
  { day: 'Thu', regs: 27 }, { day: 'Fri', regs: 35 }, { day: 'Sat', regs: 42 }, { day: 'Sun', regs: 22 },
]
const demoData = [
  { dept: 'CSE', count: 120 }, { dept: 'ECE', count: 80 }, { dept: 'ME', count: 45 },
  { dept: 'CE', count: 38 }, { dept: 'IT', count: 62 },
]

const STATUS_LABEL = {
  draft: 'Draft', pending_approval: 'Pending', live: 'Live', cancelled: 'Cancelled', past: 'Past',
}

export default function OrganizerDashboard() {
  const { user } = useAuthStore()
  const { events, getEventRegistrations, deleteEvent, updateEvent } = useEventStore()

  const myEvents = events.filter(e => e.organizerId === user?.id || user?.role !== 'student')
    .slice(0, 8)

  const totalRegs = myEvents.reduce((sum, e) => sum + (e.registered || 0), 0)
  const liveEvents = myEvents.filter(e => e.status === 'live').length
  const pendingEvents = myEvents.filter(e => e.status === 'pending_approval').length

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Organizer Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your events and track performance</p>
          </div>
          <Link to="/events/create"><Button icon="➕">Create Event</Button></Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Events" value={myEvents.length} icon="📅" color="blue" />
          <StatsCard title="Live Events" value={liveEvents} icon="🟢" color="green" />
          <StatsCard title="Total Registrations" value={totalRegs} icon="👥" color="purple" change={12} />
          <StatsCard title="Pending Approval" value={pendingEvents} icon="⏳" color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Registration trend */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">📈 Registration Trend (Last 7 days)</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={regTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Line type="monotone" dataKey="regs" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Events list */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">📋 My Events</h2>
              </div>
              <div className="space-y-3">
                {myEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <img src={event.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{event.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(event.date)} · {event.registered}/{event.capacity} regs</p>
                    </div>
                    <span className={`badge ${statusColor(event.status)} flex-shrink-0`}>{STATUS_LABEL[event.status] || event.status}</span>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <Link to={`/events/${event.id}/manage`}><Button size="xs" variant="ghost">Manage</Button></Link>
                      <Button size="xs" variant="ghost" onClick={() => {
                        const regs = getEventRegistrations(event.id)
                        downloadCSV(regs.map(r => ({ id: r.id, eventId: r.eventId, userId: r.userId, ticket: r.ticketType, status: r.status })), `${event.title}-registrations.csv`)
                        toast.success('Downloaded registrations CSV!')
                      }}>⬇ CSV</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Demographic breakdown */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-base mb-4">👥 Registrant Departments</h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={demoData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="dept" tick={{ fontSize: 11 }} width={35} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick actions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-base mb-4">⚡ Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: 'Create New Event', to: '/events/create', icon: '➕' },
                  { label: 'File Permission Request', to: '/permissions/new', icon: '🔐' },
                  { label: 'View Campus Calendar', to: '/calendar', icon: '📅' },
                  { label: 'My Club Workspace', to: '/clubs/club-001/workspace', icon: '👥' },
                  { label: 'Bulk Certificates', to: '/certificates/evt-001', icon: '🏆' },
                ].map(item => (
                  <Link key={item.to} to={item.to}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300 font-medium">
                    <span>{item.icon}</span>{item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
