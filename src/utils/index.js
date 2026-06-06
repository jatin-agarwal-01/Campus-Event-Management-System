import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from 'date-fns'

export const formatDate = (date, fmt = 'MMM dd, yyyy') => {
  try { return format(typeof date === 'string' ? parseISO(date) : date, fmt) } catch { return date }
}

export const formatTime = (time) => {
  if (!time) return ''
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
}

export const timeAgo = (date) => {
  try { return formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, { addSuffix: true }) } catch { return '' }
}

export const isEventPast = (date) => isBefore(typeof date === 'string' ? parseISO(date) : date, new Date())
export const isEventFuture = (date) => isAfter(typeof date === 'string' ? parseISO(date) : date, new Date())

export const seatsLeft = (capacity, registered) => Math.max(0, capacity - registered)
export const seatsPercent = (capacity, registered) => Math.min(100, Math.round((registered / capacity) * 100))

export const generateQR = (bookingId) => `CEMS-${bookingId}-${Date.now()}`

export const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const categoryColor = (cat) => {
  const map = {
    tech: 'bg-blue-100 text-blue-700',
    cultural: 'bg-purple-100 text-purple-700',
    sports: 'bg-green-100 text-green-700',
    academic: 'bg-yellow-100 text-yellow-700',
    workshop: 'bg-orange-100 text-orange-700',
    seminar: 'bg-red-100 text-red-700',
    fest: 'bg-pink-100 text-pink-700',
    club: 'bg-indigo-100 text-indigo-700',
  }
  return map[cat] || 'bg-gray-100 text-gray-700'
}

export const statusColor = (status) => {
  const map = {
    draft: 'bg-gray-100 text-gray-600',
    pending_approval: 'bg-yellow-100 text-yellow-700',
    live: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    past: 'bg-gray-100 text-gray-500',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    revision_requested: 'bg-orange-100 text-orange-700',
    submitted: 'bg-blue-100 text-blue-700',
    under_review: 'bg-yellow-100 text-yellow-700',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

export const truncate = (str, n = 100) => str?.length > n ? str.slice(0, n) + '…' : str

export const slugify = (str) => str?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

export const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'

export const countdownTo = (dateStr, timeStr = '00:00') => {
  const target = new Date(`${dateStr}T${timeStr}`)
  const now = new Date()
  const diff = target - now
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

export const downloadCSV = (data, filename = 'export.csv') => {
  if (!data.length) return
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
  const csv = [headers, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}
