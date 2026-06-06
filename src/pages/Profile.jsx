import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useEventStore } from '../store/eventStore'
import Layout from '../components/layout/Layout'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import { Input, Textarea, Select } from '../components/ui/Input'
import { formatDate } from '../utils'
import toast from 'react-hot-toast'

const BADGES = [
  { name: 'Early Bird', icon: '🌅', earned: true, desc: 'Registered for an event 2+ weeks early' },
  { name: 'Social Butterfly', icon: '🦋', earned: true, desc: 'Attended 5+ different categories' },
  { name: 'Hackathon Pro', icon: '💻', earned: false, desc: 'Participated in 3+ hackathons' },
  { name: 'Volunteer Star', icon: '⭐', earned: false, desc: 'Volunteered at 5+ events' },
  { name: 'Event Creator', icon: '🎯', earned: false, desc: 'Created and hosted your first event' },
  { name: 'Campus Legend', icon: '🏆', earned: false, desc: 'Attended 50+ events' },
]

export default function Profile() {
  const { userId } = useParams()
  const { user, updateProfile } = useAuthStore()
  const { getUserRegistrations, getEvent } = useEventStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', department: user?.department || '', year: user?.year || '' })

  const isMe = !userId || userId === 'me' || userId === user?.id
  const profileUser = isMe ? user : { name: 'Arjun Verma', email: 'arjun@college.edu', department: 'CSE', year: 3, bio: 'Student developer.' }

  const regs = user ? getUserRegistrations(user.id) : []
  const pastEvents = regs.filter(r => { const e = getEvent(r.eventId); return e && new Date(e.date) < new Date() }).slice(0, 6)

  const save = () => {
    updateProfile(form)
    setEditing(false)
    toast.success('Profile updated!')
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative">
              <Avatar name={profileUser?.name} src={profileUser?.avatar} size="xl" />
              {isMe && (
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs shadow-lg hover:bg-blue-700 transition-colors">
                  ✏️
                </button>
              )}
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" />
                  <Textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Your bio" rows={2} />
                  <div className="flex gap-3">
                    <Button size="sm" onClick={save}>Save Changes</Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profileUser?.name}</h1>
                      <p className="text-gray-500">{profileUser?.email}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{profileUser?.department} · Year {profileUser?.year}</p>
                    </div>
                    {isMe && <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>Edit Profile</Button>}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm">{profileUser?.bio || 'No bio yet.'}</p>
                  <div className="flex gap-4 mt-4">
                    <div className="text-center"><p className="font-bold text-gray-900 dark:text-white text-lg">{regs.length}</p><p className="text-xs text-gray-500">Events</p></div>
                    <div className="text-center"><p className="font-bold text-gray-900 dark:text-white text-lg">{BADGES.filter(b => b.earned).length}</p><p className="text-xs text-gray-500">Badges</p></div>
                    <div className="text-center"><p className="font-bold text-gray-900 dark:text-white text-lg">{regs.length * 50 + 120}</p><p className="text-xs text-gray-500">XP</p></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Badges */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">🏅 Badges</h2>
              <div className="grid grid-cols-3 gap-3">
                {BADGES.map(badge => (
                  <div key={badge.name} title={`${badge.name}: ${badge.desc}`}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-2xl cursor-help transition-all hover:scale-110 ${badge.earned ? 'bg-yellow-50 border-2 border-yellow-300 shadow-sm' : 'bg-gray-50 dark:bg-gray-800 grayscale opacity-30 border-2 border-gray-200'}`}>
                    {badge.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Past events */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">📅 Events Attended</h2>
              {pastEvents.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No events attended yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pastEvents.map(reg => {
                    const event = getEvent(reg.eventId)
                    if (!event) return null
                    return (
                      <div key={reg.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <img src={event.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-xs truncate">{event.title}</p>
                          <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                        </div>
                      </div>
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
