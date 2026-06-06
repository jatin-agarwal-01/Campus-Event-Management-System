import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img
                src="https://kiet.edu/_next/image/?url=%2Fassets%2Fimages%2Flogo%2FKIET-Logo.webp&w=256&q=75"
                alt="KIET"
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-gray-500 mb-3 leading-relaxed">
              KIET Deemed to be University<br />
              NAAC A+ | NBA Accredited<br />
              Delhi-NCR, Ghaziabad
            </p>
            <div className="flex gap-3">
              {[
                { href: 'https://x.com/Kiet_edu', label: '𝕏' },
                { href: 'https://www.facebook.com/kiet.edu/', label: 'f' },
                { href: 'https://www.instagram.com/kiet_edu/', label: '📷' },
                { href: 'https://www.linkedin.com/school/kiet-group-of-institutions/', label: 'in' },
              ].map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Explore</h4>
            <ul className="space-y-2">
              {[
                { to: '/events', label: 'Browse Events' },
                { to: '/clubs', label: 'KIET Clubs' },
                { to: '/calendar', label: 'Event Calendar' },
                { to: '/venues', label: 'Venues' },
                { to: '/leaderboard', label: 'Leaderboard' },
              ].map(link => (
                <li key={