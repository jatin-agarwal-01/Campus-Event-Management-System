import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEventStore } from '../../store/eventStore'
import { EVENT_CATEGORIES } from '../../constants'
import { categoryColor, formatDate, seatsLeft } from '../../utils'
import Layout from '../../components/layout/Layout'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { EventCardSkeleton } from '../../components/ui/Skeleton'

function EventCard({ event }) {
  const { toggleBookmark, bookmarks } = useEventStore()
  const saved = bookmarks.includes(event.id)
  const left = seatsLeft(event.capacity, event.registered)
  const cat = EVENT_CATEGORIES.find(c => c.value === event.category)

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className={`absolute top-3 left-3 badge ${categoryColor(event.category)}`}>{cat?.icon} {cat?.label}</span>
        <button onClick={() => toggleBookmark(event.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
          {saved ? '❤️' : '🤍'}
        </button>
        {event.isOnline && <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">🌐 Online</span>}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-1 mb-1">{event.title}</h3>
        <p className="text-xs text-gray-500 mb-1">📅 {formatDate(event.date)}</p>
        <p className="text-xs text-gray-500 mb-3">📍 {event.venue}</p>
        <p className="text-xs text-gray-400 line-clamp-2 mb-4">{event.description}</p>
        <div className="flex items-center justify-between gap-2">
          <div>
            {left <= 10 && left > 0 && <span className="text-xs text-red-500 font-semibold">⚠ Only {left} seats!</span>}
            {left === 0 && <span className="text-xs text-gray-400 font-medium">Sold out</span>}
            {left > 10 && <span className="text-xs text-green-600 font-medium">{left} seats left</span>}
          </div>
          <Link to={`/events/${event.id}`}><Button size="xs">Details →</Button></Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function Events() {
  const { events } = useEventStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('date')
  const [view, setView] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let list = events.filter(e => e.status === 'live')
    if (search) list = list.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase()) || e.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())))
    if (category) list = list.filter(e => e.category === category)
    if (sort === 'date') list = list.sort((a, b) => new Date(a.date) - new Date(b.date))
    if (sort === 'popular') list = list.sort((a, b) => b.registered - a.registered)
    if (sort === 'newest') list = list.sort((a, b) => b.id.localeCompare(a.id))
    return list
  }, [events, search, category, sort])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Events</h1>
            <p className="text-gray-500 mt-1">{filtered.length} events found</p>
          </div>
          <div className="flex gap-2">
            <Link to="/events/create"><Button size="sm" icon="➕">Create Event</Button></Link>
          </div>
        </div>

        {/* Search + filters row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search events, tags, venues..."
              className="input pl-10 w-full" />
          </div>
          <div className="flex gap-2">
            <select value={category} onChange={e => setCategory(e.target.value)} className="input w-40">
              <option value="">All Categories</option>
              {EVENT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} className="input w-36">
              <option value="date">By Date</option>
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
            </select>
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setView('grid')} className={`px-3 py-2 ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>⊞</button>
              <button onClick={() => setView('list')} className={`px-3 py-2 ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>☰</button>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
          <button onClick={() => setCategory('')} className={`px-4 py-1.5 rounded-full text-sm font-medium flex-shrink-0 border-2 transition-all ${!category ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>All</button>
          {EVENT_CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value === category ? '' : c.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium flex-shrink-0 border-2 transition-all ${category === c.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <EmptyState type="events" action={() => { setSearch(''); setCategory('') }} actionLabel="Clear Filters" />
        ) : (
          <motion.div layout className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            <AnimatePresence>
              {filtered.map(event => <EventCard key={event.id} event={event} />)}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
