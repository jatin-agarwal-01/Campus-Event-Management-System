import { useState } from 'react'
import { MOCK_VENUES } from '../constants'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

export default function Venues() {
  const [selected, setSelected] = useState(null)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campus Venues</h1>
          <p className="text-gray-500 mt-1">All available venues for events</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_VENUES.map(venue => (
            <div key={venue.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">🏛️</div>
                <span className={`badge ${venue.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {venue.available ? 'Available' : 'Booked'}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{venue.name}</h3>
              <p className="text-sm text-gray-500 mb-3">Capacity: {venue.capacity.toLocaleString()} people</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {venue.facilities.map(f => (
                  <span key={f} className="badge bg-gray-100 text-gray-600 text-xs">{f}</span>
                ))}
              </div>
              <Button size="sm" className="w-full justify-center" disabled={!venue.available}
                onClick={() => { setSelected(venue); toast.success(`Booking request for ${venue.name} submitted!`) }}>
                {venue.available ? 'Request Booking' : 'Unavailable'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
