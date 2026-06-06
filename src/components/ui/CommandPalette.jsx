import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../store/uiStore'
import { useEventStore } from '../../store/eventStore'
import { useClubStore } from '../../store/clubStore'

export default function CommandPalette() {
  const { commandPaletteOpen, closeCommandPalette } = useUIStore()
  const { events } = useEventStore()
  const { clubs } = useClubStore()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const results = query.length < 2 ? [] : [
    ...events.filter(e => e.title.toLowerCase().includes(query.toLowerCase())).slice(0, 3).map(e => ({ type: 'event', label: e.title, sub: e.category, to: `/events/${e.id}`, icon: '🎟️' })),
    ...clubs.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3).map(c => ({ type: 'club', label: c.name, sub: 'Club', to: `/clubs/${c.id}`, icon: '👥' })),
    { type: 'page', label: `Search "${query}"`, sub: 'View all results', to: `/search?q=${query}`, icon: '🔍' },
  ]

  useEffect(() => {
    if (!commandPaletteOpen) setQuery('')
  }, [commandPaletteOpen])

  const go = (to) => { navigate(to); closeCommandPalette() }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCommandPalette} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search events, clubs, venues..."
                className="flex-1 text-sm bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-400" />
              <kbd className="text-xs bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 text-gray-500 font-mono">Esc</kbd>
            </div>
            {results.length > 0 && (
              <ul className="py-2 max-h-72 overflow-y-auto">
                {results.map((r, i) => (
                  <li key={i}>
                    <button onClick={() => go(r.to)}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors">
                      <span className="text-xl">{r.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{r.label}</p>
                        <p className="text-xs text-gray-500 capitalize">{r.sub}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {query.length >= 2 && results.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">No results for "{query}"</p>
            )}
            {query.length === 0 && (
              <div className="px-5 py-4 text-xs text-gray-400">
                <p>Type to search events, clubs, venues...</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
