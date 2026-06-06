import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEventStore } from '../store/eventStore'
import { useAuthStore } from '../store/authStore'
import { EVENT_CATEGORIES } from '../constants'
import { categoryColor, formatDate, seatsLeft } from '../utils'
import Layout from '../components/layout/Layout'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

function EventCard({ event }) {
  const { toggleBookmark, bookmarks } = useEventStore()
  const saved = bookmarks.includes(event.id)
  const left = seatsLeft(event.capacity, event.registered)
  const cat = EVENT_CATEGORIES.find(c => c.value === event.category)

  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden group">
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-3 left-3">
          <span className={`badge ${categoryColor(event.category)}`}>{cat?.icon} {cat?.label}</span>
        </div>
        <button onClick={() => toggleBookmark(event.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
          {saved ? '❤️' : '🤍'}
        </button>
        {left < 20 && left > 0 && (
          <div className="absolute bottom-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Only {left} left!
          </div>
        )}
        {left === 0 && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="bg-white text-gray-800 font-bold px-3 py-1 rounded-full text-sm">Sold Out</span></div>}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1 line-clamp-1">{event.title}</h3>
        <p className="text-xs text-gray-500 mb-3">{formatDate(event.date)} · {event.venue}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-24">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (event.registered / event.capacity) * 100)}%` }} />
            </div>
            <span className="text-xs text-gray-500">{event.registered}/{event.capacity}</span>
          </div>
          <Link to={`/events/${event.id}`}><Button size="xs">View →</Button></Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const { events } = useEventStore()
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const featured = events.filter(e => e.isFeatured && e.status === 'live')
  const trending = events.filter(e => e.status === 'live').sort((a, b) => b.registered - a.registered).slice(0, 4)
  const thisWeek = events.filter(e => {
    const d = new Date(e.date)
    const now = new Date()
    const diff = (d - now) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 7 && e.status === 'live'
  })

  return (
    <Layout noSidebar>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-12 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-8 right-12 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">NAAC A+ | NBA Accredited</span>
                <span className="bg-yellow-400/20 text-yellow-200 text-xs font-semibold px-3 py-1 rounded-full">QS I-GAUGE Diamond</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                KIET Events –<br /><span className="text-yellow-300">Empowering Minds,</span><br />Enabling Skills
              </h1>
              <p className="text-blue-100 text-lg mb-8">Discover TechFest, Umang, ICICS and 50+ events at KIET Deemed to be University, Ghaziabad. Register, earn badges and never miss what matters on campus.</p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" variant="ghost" className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg"
                  onClick={() => navigate('/events')}>Browse Events</Button>
                {!isAuthenticated && (
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10"
                    onClick={() => navigate('/register')}>Join with KIET Email</Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Category pills */}
        <div className="relative border-t border-white/20 py-4 overflow-x-auto">
          <div className="flex gap-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {EVENT_CATEGORIES.map(cat => (
              <Link key={cat.value} to={`/events?category=${cat.value}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-full flex-shrink-0 transition-colors">
                {cat.icon} {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
        {/* Featured */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">✨ Featured Events</h2>
              <Link to="/events" className="text-sm text-blue-600 font-medium hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          </section>
        )}

        {/* This week */}
        {thisWeek.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📅 This Week</h2>
              <Link to="/calendar" className="text-sm text-blue-600 font-medium hover:underline">Calendar →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {thisWeek.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          </section>
        )}

        {/* Trending */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔥 Trending</h2>
            <Link to="/events" className="text-sm text-blue-600 font-medium hover:underline">See more →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </section>

        {/* CTA banner */}
        {!isAuthenticated && (
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-center text-white">
            <h2 className="text-3xl font-bold mb-3">KIET student? Join now!</h2>
            <p className="text-blue-100 mb-6">Join 10,000+ KIET students already discovering TechFest, Umang, sports meets and more.</p>
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 mx-auto" onClick={() => navigate('/register')}>
              Register with KIET Email
            </Button>
          </section>
        )}
      </div>
    </Layout>
  )
}
