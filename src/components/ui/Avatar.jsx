import { getInitials } from '../../utils'

const sizeMap = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' }
const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500']

export default function Avatar({ name, src, size = 'md', className = '' }) {
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0
  return src ? (
    <img src={src} alt={name} className={`rounded-full object-cover ${sizeMap[size]} ${className}`} />
  ) : (
    <div className={`rounded-full flex items-center justify-center font-bold text-white ${colors[colorIndex]} ${sizeMap[size]} ${className}`}>
      {getInitials(name)}
    </div>
  )
}
