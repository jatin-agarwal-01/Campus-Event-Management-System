import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import Avatar from '../ui/Avatar'
import NotifDrawer from '../notifications/NotifDrawer'
import CommandPalette from '../ui/CommandPalette'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { darkMode, toggleDarkMode, openNotifDrawer, openCommandPalette, notifications } = useUIStore()
  const unread = notifications.filter(n => !n.read).length
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'k') { e.preventDefault(); openCommandPalette() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [openCommandPalette])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <img
                src="https://kiet.edu/_next/image/?url=%2Fassets%2Fimages%2Flogo%2FKIET-Logo.webp&w=256&q=75"
                alt="KIET"
                className="h-9 w-auto object-contain"
              />
              <span className="font-bold text-gray-900 dark:text-white text-base hidden sm:block leading-tight">
                KIET Events
                <span className="block text-xs font-normal text-gray-400">Delhi-NCR, Ghaziabad</span>
              </span>
            </Link>

            {/* Search */}
            <button onClick={openCommandPalette}
              className="hidden md:flex items-center gap-2 text-sm text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 hover:bg-gray-100 transition-colors w-72">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span>Search events, clubs...</span>
              <kbd className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
            </button>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Dark mode */}
              <button onClick={toggleDarkMode} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                {darkMode ? '☀️' : '🌙'}
              </button>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button onClick={openNotifDrawer} className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unread > 9 ? '9+' : unread}</span>}
                  </button>

                  {/* User menu */}
                  <div className="relative">
                    <button onClick={() => setUserMenuOpen(v => !v)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <Avatar name={user?.name} src={user?.avatar} size="sm" />
                      <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                          className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl z-50 py-1 overflow-hidden"
                          onMouseLeave={() => setUserMenuOpen(false)}>
                          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>
                          {[
                            { to: '/profile/me', label: 'My Profile', icon: '👤' },
                            { to: '/dashboard', label: 'Dashboard', icon: '📊' },
                            { to: '/my-events', label: 'My Events', icon: '🎟️' },
                            { to: '/notifications', label: 'Notifications', icon: '🔔' },
                          ].map(item => (
                            <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              <span>{item.icon}</span>{item.label}
                            </Link>
                          ))}
                          {user?.role === 'super_admin' && (
                            <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <span>⚙️</span>Admin Panel
                            </Link>
                          )}
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <span>🚪</span>Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2">Login</Link>
                  <Lin