import Button from './Button'

const presets = {
  events: { icon: '🎟️', title: 'No events found', desc: 'Try adjusting your filters or search terms.' },
  notifications: { icon: '🔔', title: 'No notifications', desc: 'You\'re all caught up!' },
  registrations: { icon: '📋', title: 'No registrations yet', desc: 'Browse events and register to get started.' },
  permissions: { icon: '🔐', title: 'No permission requests', desc: 'File a new permission request to get started.' },
  clubs: { icon: '👥', title: 'No clubs found', desc: 'No clubs match your search.' },
  search: { icon: '🔍', title: 'No results found', desc: 'Try different keywords.' },
}

export default function EmptyState({ type, icon, title, description, action, actionLabel }) {
  const preset = presets[type] || {}
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon || preset.icon || '📭'}</div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{title || preset.title}</h3>
      <p className="text-sm text-gray-500 max-w-xs">{description || preset.desc}</p>
      {action && <div className="mt-6"><Button onClick={action}>{actionLabel || 'Get Started'}</Button></div>}
    </div>
  )
}
