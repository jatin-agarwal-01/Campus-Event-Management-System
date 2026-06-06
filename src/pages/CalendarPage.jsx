import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { Link } from 'react-router-dom'
import { useEventStore } from '../store/eventStore'
import { EVENT_CATEGORIES } from '../constants'
import { categoryColor } from '../utils'
import Layout from '../components/layout/Layout'
import Badge from '../components/ui/Badge'

const BLACKOUT_DATES = ['2026-06-25', '2026-06-26', '2026-06-27'] // Exam week

export default function CalendarPage() {
  const { events } = useEventStore()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState('month')
  const [categoryFilter, setCategoryFilter] = useState('')

  const isBlackout = (date) => {
    const d = date.toISOString().split('T')[0]
    return BLACKOUT_DATES.includes(d)
  }

  const eventsOnDate = (date) => {
    const d = date.toISOString().split('T')[0]
    return events.filter(e => e.date === d && e.status === 'live' && (!categoryFilter || e.category === categoryFilter))
  }

  const selectedEvents = eventsOnDate(selectedDate)

  const tileContent = ({ date }) => {
    const ev = eventsOnDate(date)
    if (ev.length === 0) return null
    return (
      <div className="flex justify-center mt-0.5">
        {ev.slice(0, 3).map((e, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full mx-0.5" style={{
            backgroundColor: EVENT_CATEGORIES.find(c => c.value === e.category)?.color?.includes('blue') ? '#3b82f6' :
              e.category === 'cultural' ? '#8b5cf6' : e.category === 'sports' ? '#10b981' : '#f59e0b'
          }} />
        ))}
      </div>
    )
  }

  const tileClassName = ({ date }) => {
    if (isBlackout(date)) return 'bg-red-50 text-red-400 cursor-not-allowed opacity-60'
    return null
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campus Calendar</h1>
          <p className="text-gray-500 mt-1">All campus events at a glance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              <button onClick={() => setCategoryFilter('')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 border transition-all ${!categoryFilter ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}>
                All
              </button>
              {EVENT_CATEGORIES.map(c => (
                <button key={c.value} onClick={() => setCategoryFilter(c.value === categoryFilter ? '' : c.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 border transition-all ${categoryFilter === c.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className="w-full border-0 font-sans"
              />
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 border-t pt-4">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-100 rounded-sm" />Blackout (Exams)</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500" />Tech</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-purple-500" />Cultural</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500" />Sports</div>
              </div>
            </div>
          </div>

          {/* Events on selected date */}
          <div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm sticky top-20">
              <h2 className="font-bold text-gray-900 dark:text-white mb-1">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h2>
              {isBlackout(selectedDate) && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-xs text-red-600 font-medium">
                  🚫 Blackout date — no events allowed (Exam period)
                </div>
              )}
              {selectedEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-2xl mb-2">📭</p>
                  <p className="text-sm text-gray-400">No events on this date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map(event => {
                    const cat = EVENT_CATEGORIES.find(c => c.value === event.category)
                    return (
                      <Link key={event.id} to={`/events/${event.id}`}
                        className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`badge ${categoryColor(event.category)} text-xs`}>{cat?.icon} {cat?.label}</span>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{event.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">⏰ {event.time} · {event.venue}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{event.capacity - event.registered} seats left</p>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
