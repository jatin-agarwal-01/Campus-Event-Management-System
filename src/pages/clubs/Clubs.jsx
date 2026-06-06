import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useClubStore } from '../../store/clubStore'
import { useAuthStore } from '../../store/authStore'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'

export default function Clubs() {
  const { clubs, following, toggleFollow } = useClubStore()
  const { isAuthenticated } = useAuthStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  const filtered = clubs.filter(c =>
    (!search || c.name.toLowerCase().includes(search.toLowerCase())) &&
    (!filter || c.category === filter)
  )

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campus Clubs</h1>
          <p className="text-gray-500 mt-1">{clubs.length} active clubs on campus</p>
        </div>

        <div className="flex gap-3 mb-6">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clubs..." className="input flex-1 max-w-sm" />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="input w-40">
            <option value="">All Types</option>
            <option value="tech">Tech</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="academic">Academic</option>
          </select>
        </div>

        {filtered.length === 0 ? <EmptyState type="clubs" /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(club => (
              <div key={club.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {club.name.charAt(0)}
                  </div>
                  {club.verified && <span className="badge bg-blue-100 text-blue-700">✓ Verified</span>}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{club.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{club.description}</p>
                <p className="text-xs text-gray-400 mb-4">👥 {club.members} members</p>
                <div className="flex gap-2">
                  <Link to={`/clubs/${club.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full justify-center">View Profile</Button>
                  </Link>
                  {isAuthenticated && (
                    <Button size="sm" variant={following.includes(club.id) ? 'secondary' : 'primary'}
                      onClick={() => toggleFollow(club.id)}>
                      {following.includes(club.id) ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
