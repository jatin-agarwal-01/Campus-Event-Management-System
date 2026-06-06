import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import ReactConfetti from 'react-confetti'
import { useEventStore } from '../../store/eventStore'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import { EVENT_CATEGORIES } from '../../constants'
import { formatDate, formatTime, categoryColor, seatsLeft, seatsPercent } from '../../utils'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Countdown from '../../components/ui/Countdown'
import Avatar from '../../components/ui/Avatar'
import Modal from '../../components/ui/Modal'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEvent, toggleBookmark, bookmarks, register, isRegistered, cancelRegistration, getUserRegistrations } = useEventStore()
  const { user, isAuthenticated } = useAuthStore()
  const { addNotification } = useUIStore()
  const [regModal, setRegModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeTab, setActiveTab] = useState('about')

  const event = getEvent(id)
  if (!event) return (
    <Layout><div className="max-w-4xl mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2><Link to="/events"><Button>Browse Events</Button></Link></div></Layout>
  )

  const cat = EVENT_CATEGORIES.find(c => c.value === event.category)
  const saved = bookmarks.includes(event.id)
  const registered = isAuthenticated && isRegistered(event.id, user?.id)
  const left = seatsLeft(event.capacity, event.registered)
  const pct = seatsPercent(event.capacity, event.registered)

  const handleRegister = async () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: { pathname: `/events/${id}` } } }); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const ticket = event.ticketTypes?.[selectedTicket]
    register(event.id, user.id, ticket?.type || 'general')
    addNotification({ type: 'registration_confirmed', title: 'Registration Confirmed!', message: `You are registered for ${event.title}` })
    setLoading(false)
    setRegModal(false)
    setShowConfetti(true)
    toast.success('🎉 Successfully registered!')
    setTimeout(() => setShowConfetti(false), 5000)
  }

  return (
    <Layout noSidebar>
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={300} />}

      {/* Banner */}
      <div className="relative h-72 md:h-96 bg-gray-200 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <span className={`badge mb-3 ${categoryColor(event.category)}`}>{cat?.icon} {cat?.label}</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">{event.title}</h1>
          <p className="text-white/80 mt-2 text-sm">{event.organizer}</p>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => toggleBookmark(event.id)} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
            {saved ? '❤️' : '🤍'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
              {['about', 'agenda', 'speakers', 'faqs'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all ${activeTab === tab ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: '📅', label: 'Date', value: formatDate(event.date) },
                    { icon: '🕐', label: 'Time', value: formatTime(event.time) },
                    { icon: '📍', label: 'Venue', value: event.venue },
                    { icon: event.isOnline ? '🌐' : '🏛️', label: 'Mode', value: event.isOnline ? 'Online' : 'Offline' },
                  ].map(info => (
                    <div key={info.label} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                      <p className="text-xl mb-1">{info.icon}</p>
                      <p className="text-xs text-gray-500">{info.label}</p>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{info.value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3">About this event</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{event.description}</p>
                </div>
                {event.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map(tag => <span key={tag} className="badge bg-gray-100 text-gray-600">#{tag}</span>)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'agenda' && (
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Event Schedule</h3>
                {event.agenda?.length ? (
                  <div className="space-y-3">
                    {event.agenda.map((item, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="bg-blue-100 text-blue-700 text-xs font-mono font-bold px-2 py-1.5 rounded-lg flex-shrink-0">{item.time}</div>
                        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</p>
                          {item.duration && <p className="text-xs text-gray-500 mt-0.5">⏱ {item.duration}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-400 text-sm">No schedule added yet.</p>}
              </div>
            )}

            {activeTab === 'speakers' && (
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Speakers & Guests</h3>
                {event.speakers?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.speakers.map((s, i) => (
                      <div key={i} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                        <Avatar name={s.name} size="lg" />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{s.name}</p>
                          <p className="text-xs text-gray-500">{s.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-400 text-sm">No speakers listed yet.</p>}
              </div>
            )}

            {activeTab === 'faqs' && (
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">FAQs</h3>
                {event.faqs?.length ? (
                  <div className="space-y-3">
                    {event.faqs.map((faq, i) => (
                      <details key={i} className="group bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                        <summary className="font-semibold text-gray-900 dark:text-white text-sm cursor-pointer list-none flex justify-between items-center">
                          {faq.q} <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="text-gray-500 text-sm mt-3">{faq.a}</p>
                      </details>
                    ))}
                  </div>
                ) : <p className="text-gray-400 text-sm">No FAQs yet.</p>}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Countdown */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <Countdown date={event.date} time={event.time} />
            </div>

            {/* Registration card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sticky top-20">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-500">{event.registered} registered</span>
                  <span className="text-gray-500">{event.capacity} capacity</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all ${pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{left} seats remaining</p>
              </div>

              {event.ticketTypes && (
                <div className="space-y-2 mb-4">
                  {event.ticketTypes.map((t, i) => (
                    <button key={i} onClick={() => setSelectedTicket(i)}
                      className={`w-full flex justify-between items-center p-3 rounded-xl border-2 transition-all text-left ${selectedTicket === i ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{t.label}</p>
                        <p className="text-xs text-gray-500">{t.capacity - t.registered} left</p>
                      </div>
                      <p className="font-bold text-blue-600">{t.price === 0 ? 'FREE' : `₹${t.price}`}</p>
                    </button>
                  ))}
                </div>
              )}

              {registered ? (
                <div className="text-center">
                  <div className="bg-green-50 text-green-700 rounded-xl p-4 mb-3">
                    <p className="font-bold">✅ You're registered!</p>
                    <p className="text-xs mt-0.5">Check your ticket in My Events</p>
                  </div>
                  <Link to="/my-events"><Button variant="secondary" className="w-full justify-center" size="sm">View Ticket</Button></Link>
                </div>
              ) : left === 0 ? (
                <Button className="w-full justify-center" disabled>Sold Out</Button>
              ) : (
                <Button onClick={() => setRegModal(true)} className="w-full justify-center" size="lg">Register Now</Button>
              )}

              <div className="flex gap-2 mt-3">
                {['WhatsApp', 'Twitter', 'Copy Link'].map(s => (
                  <button key={s} onClick={() => toast.success(`Shared via ${s}!`)}
                    className="flex-1 text-xs text-gray-500 hover:text-blue-600 py-1 rounded-lg hover:bg-gray-50 transition-colors">{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration modal */}
      <Modal open={regModal} onClose={() => setRegModal(false)} title="Confirm Registration">
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <p className="font-bold text-gray-900 dark:text-white">{event.title}</p>
            <p className="text-sm text-gray-500">{formatDate(event.date)} · {event.venue}</p>
            <p className="text-sm font-semibold text-blue-600 mt-2">{event.ticketTypes?.[selectedTicket]?.price === 0 ? 'FREE' : `₹${event.ticketTypes?.[selectedTicket]?.price}`}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setRegModal(false)} className="flex-1 justify-center">Cancel</Button>
            <Button loading={loading} onClick={handleRegister} className="flex-1 justify-center">Confirm Registration</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
