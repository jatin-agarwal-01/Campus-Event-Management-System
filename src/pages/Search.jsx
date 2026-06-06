import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useEventStore } from '../store/eventStore'
import { useClubStore } from '../store/clubStore'
import { categoryColor, formatDate } from '../utils'
import { EVENT_CATEGORIES } from '../constants'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button'

export default function Search() {
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [tab, setTab] = useState('events')
  const { events } = useEventStore()
  const { clubs } = useClubStore()

  const matchedEvents = useMemo(() =>
    events.filter(e => e.status === 'live' && (
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.description?.toLowerCase().includes(query.toLowerCase()) ||
      e.tags?.some(t => t.toLowerCase().includes(query.toLowerCase()))
    )), [events, query])

  const matchedClubs = useMemo(() =>
    clubs.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.description?.toLowerCase().includes(query.toLowerCase())),
    [clubs, query])

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search events, clubs, venues..."
              className="input pl-12 text-lg py-4 text-gray-900 dark:text-white" />
          </div>
          <p className="text-gray-500 text-sm mt-2">{query ? `${matchedEvents.length + matchedClubs.length} results for "${query}"` : 'Start typing to search'}</p>
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          <button onClick={() => setTab('events')} className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'events' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Events ({matchedEvents.length})</button>
          <button onClick={() => setTab('clubs')} className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'clubs' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Clubs ({matchedClubs.length})</button>
        </div>

        {tab === 'events' && (
          <div className="space-y-3">
            {matchedEvents.length === 0 ? <p className="text-gray-400 text-center py-12">No events found</p> :
              matchedEvents.map(event => {
                const cat = EVENT_CATEGORIES.find(c => c.value === event.category)
                return (
                  <Link key={event.id} to={`/events/${event.id}`}
                    className="flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow items-center">
                    <img src={event.image} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white">{event.title}</h3>
                      <p className="text-sm text-gray-500">{formatDate(event.date)} · {event.venue}</p>
                      <span className={`badge mt-1 ${categoryColor(event.category)}`}>{cat?.icon} {cat?.label}</span>
                    </div>
                    <Button size="sm">View →</Button>
                  </Link>
                )
              })
            }
          </div>
        )}

        {tab === 'clubs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matchedClubs.length === 0 ? <p className="text-gray-400 text-center py-12 col-span-2">No clubs found</p> :
              matchedClubs.map(club => (
                <Link key={club.id} to={`/clubs/${club.id}`}
                  className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">{club.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{club.name}</h3>
                    <p className="text-xs text-gray-500">{club.members} members</p>
                    {club.verified && <span className="badge bg-blue-100 text-blue-700 mt-1">✓ Verified</span>}
                  </div>
                </Link>
              ))
            }
          </div>
        )}
      </div>
    </Layout>
  )
}
