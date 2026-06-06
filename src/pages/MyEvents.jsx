import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useEventStore } from '../store/eventStore'
import { useAuthStore } from '../store/authStore'
import { formatDate, formatTime } from '../utils'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import toast from 'react-hot-toast'

export default function MyEvents() {
  const { user } = useAuthStore()
  const { getUserRegistrations, getEvent, cancelRegistration } = useEventStore()
  const [activeTab, setActiveTab] = useState('upcoming')
  const [ticketModal, setTicketModal] = useState(null)

  const registrations = user ? getUserRegistrations(user.id) : []
  const upcoming = registrations.filter(r => {
    const event = getEvent(r.eventId)
    return event && new Date(event.date) >= new Date() && r.status !== 'cancelled'
  })
  const past = registrations.filter(r => {
    const event = getEvent(r.eventId)
    return event && new Date(event.date) < new Date() && r.status !== 'cancelled'
  })
  const cancelled = registrations.filter(r => r.status === 'cancelled')

  const tabs = [
    { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
    { key: 'past', label: 'Past', count: past.length },
    { key: 'cancelled', label: 'Cancelled', count: cancelled.length },
  ]

  const list = activeTab === 'upcoming' ? upcoming : activeTab === 'past' ? past : cancelled

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Registrations</h1>
          <p className="text-gray-500 mt-1">All your event registrations in one place</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mb-6">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === tab.key ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
              {tab.count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>{tab.count}</span>}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState type="registrations" action={() => {}} actionLabel="Browse Events"
            title={activeTab === 'upcoming' ? 'No upcoming events' : activeTab === 'past' ? 'No past events' : 'No cancellations'} />
        ) : (
          <div className="space-y-4">
            {list.map(reg => {
              const event = getEvent(reg.eventId)
              if (!event) return null
              return (
                <div key={reg.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-32 h-24 sm:h-auto bg-gray-100 flex-shrink-0">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{event.title}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">📅 {formatDate(event.date)} · {formatTime(event.time)}</p>
                          <p className="text-sm text-gray-500">📍 {event.venue}</p>
                          <div className="flex gap-2 mt-2">
                            <span className={`badge ${reg.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {reg.status === 'confirmed' ? '✅ Confirmed' : reg.status}
                            </span>
                            <span className="badge bg-gray-100 text-gray-600 capitalize">{reg.ticketType}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="xs" onClick={() => setTicketModal(reg)}>🎟 Ticket</Button>
                          {activeTab === 'upcoming' && reg.status === 'confirmed' && (
                            <Button size="xs" variant="outline" onClick={() => {
                              cancelRegistration(reg.id)
                              toast.success('Registration cancelled')
                            }}>Cancel</Button>
                          )}
                          <Link to={`/events/${event.id}`}><Button size="xs" variant="ghost">View Event</Button></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      <Modal open={!!ticketModal} onClose={() => setTicketModal(null)} title="Your Ticket" size="sm">
        {ticketModal && (() => {
          const event = getEvent(ticketModal.eventId)
          return (
            <div className="text-center space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{event?.title}</h3>
                <p className="text-sm text-gray-500">{formatDate(event?.date)} · {event?.venue}</p>
              </div>
              <div className="flex justify-center">
                <QRCodeSVG value={ticketModal.qrCode} size={180} includeMargin className="rounded-xl" />
              </div>
              <p className="text-xs text-gray-400 font-mono break-all">{ticketModal.qrCode}</p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1 justify-center" size="sm" onClick={() => toast.success('Ticket downloaded!')}>Download PDF</Button>
                <Button className="flex-1 justify-center" size="sm" onClick={() => toast.success('Added to calendar!')}>Add to Calendar</Button>
              </div>
            </div>
          )
        })()}
      </Modal>
    </Layout>
  )
}
