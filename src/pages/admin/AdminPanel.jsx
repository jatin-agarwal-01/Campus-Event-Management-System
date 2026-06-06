import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useEventStore } from '../../store/eventStore'
import { useClubStore } from '../../store/clubStore'
import { EVENT_CATEGORIES } from '../../constants'
import { formatDate, statusColor } from '../../utils'
import Layout from '../../components/layout/Layout'
import { StatsCard } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const TABS = ['Overview', 'Events', 'Clubs', 'Audit Log']
const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#14b8a6']

const AUDIT_LOGS = [
  { id: 1, action: 'Event Approved', admin: 'Admin Dean', entity: 'TechFest 2026', time: '2026-06-06 10:32', type: 'approval' },
  { id: 2, action: 'Club Verified', admin: 'Admin Dean', entity: 'CS Club', time: '2026-06-05 15:20', type: 'verification' },
  { id: 3, action: 'Role Changed', admin: 'Admin Dean', entity: 'Priya Singh → Organizer', time: '2026-06-04 09:15', type: 'role' },
  { id: 4, action: 'Blackout Date Set', admin: 'Admin Dean', entity: 'Jun 25-27 (Exams)', time: '2026-06-03 14:00', type: 'blackout' },
  { id: 5, action: 'Event Rejected', admin: 'Prof. Meena', entity: 'Weekend Party', time: '2026-06-03 11:45', type: 'rejection' },
]

export default function AdminPanel() {
  const { events, approveEvent, rejectEvent } = useEventStore()
  const { clubs } = useClubStore()
  const [activeTab, setActiveTab] = useState('Overview')
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const pending = events.filter(e => e.status === 'pending_approval')
  const live = events.filter(e => e.status === 'live')

  const categoryData = EVENT_CATEGORIES.map(cat => ({
    name: cat.label,
    value: events.filter(e => e.category === cat.value).length,
  })).filter(d => d.value > 0)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-500 mt-1">Platform governance & management — Super Admin</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mb-8">
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === t ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard title="Total Events" value={events.length} icon="🎟️" color="blue" change={15} />
              <StatsCard title="Live Events" value={live.length} icon="🟢" color="green" />
              <StatsCard title="Pending Approval" value={pending.length} icon="⏳" color="orange" />
              <StatsCard title="Verified Clubs" value={clubs.filter(c => c.verified).length} icon="✓" color="purple" />
            </div>

            {/* Category distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Events by Category</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
                      {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Pending approvals */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg">⏳ Pending Approval</h2>
                  {pending.length > 0 && <span className="badge bg-orange-100 text-orange-700">{pending.length} waiting</span>}
                </div>
                {pending.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No pending approvals 🎉</p>
                ) : (
                  <div className="space-y-3">
                    {pending.slice(0, 4).map(event => (
                      <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{event.title}</p>
                          <p className="text-xs text-gray-500">{event.organizer} · {formatDate(event.date)}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <Button size="xs" variant="success" onClick={() => { approveEvent(event.id); toast.success('Event approved!') }}>✓ Approve</Button>
                          <Button size="xs" variant="danger" onClick={() => setRejectModal(event)}>✗ Reject</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Events' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">All Events</h2>
            </div>
            <div className="space-y-3">
              {events.map(event => (
                <div key={event.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <img src={event.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.organizer} · {formatDate(event.date)} · {event.registered}/{event.capacity} registered</p>
                  </div>
                  <span className={`badge ${statusColor(event.status)} flex-shrink-0 capitalize`}>{event.status?.replace(/_/g, ' ')}</span>
                  <div className="flex gap-1.5">
                    {event.status === 'pending_approval' && (
                      <>
                        <Button size="xs" variant="success" onClick={() => { approveEvent(event.id); toast.success('Approved!') }}>Approve</Button>
                        <Button size="xs" variant="danger" onClick={() => setRejectModal(event)}>Reject</Button>
                      </>
                    )}
                    {event.status === 'live' && (
                      <Button size="xs" variant="outline" onClick={() => toast.success('Event featured on homepage!')}>⭐ Feature</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Clubs' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-5">Club Verification</h2>
            <div className="space-y-3">
              {clubs.map(club => (
                <div key={club.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl font-bold text-blue-600">{club.name.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{club.name}</p>
                    <p className="text-xs text-gray-500">{club.members} members · {club.category}</p>
                  </div>
                  {club.verified ? (
                    <span className="badge bg-green-100 text-green-700">✓ Verified</span>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="xs" onClick={() => toast.success(`${club.name} verified!`)}>Verify</Button>
                      <Button size="xs" variant="outline">Review Docs</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Audit Log' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">🔍 Audit Logs (Read-Only)</h2>
              <Button size="sm" variant="secondary" onClick={() => toast.success('Audit log downloaded!')}>⬇ Export CSV</Button>
            </div>
            <div className="space-y-3">
              {AUDIT_LOGS.map(log => (
                <div key={log.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${log.type === 'approval' ? 'bg-green-500' : log.type === 'rejection' ? 'bg-red-500' : log.type === 'blackout' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{log.action}</p>
                      <p className="text-xs text-gray-400 flex-shrink-0">{log.time}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Entity: {log.entity}</p>
                    <p className="text-xs text-gray-400">By: {log.admin}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reject modal */}
      <Modal open={!!rejectModal} onClose={() => setRejectModal(null)} title="Reject Event" size="sm">
        {rejectModal && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Rejecting: <strong>{rejectModal.title}</strong></p>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Reason for rejection</label>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3}
                className="input resize-none" placeholder="Provide a clear reason..." />
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setRejectModal(null)} className="flex-1 justify-center">Cancel</Button>
              <Button variant="danger" className="flex-1 justify-center" onClick={() => {
                rejectEvent(rejectModal.id, rejectReason)
                toast.error(`Event rejected: ${rejectModal.title}`)
                setRejectModal(null)
                setRejectReason('')
              }}>Reject Event</Button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  )
}
