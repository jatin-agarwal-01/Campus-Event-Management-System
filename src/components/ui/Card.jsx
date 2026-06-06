import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = false, onClick }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' } : {}}
      onClick={onClick}
      className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm ${hover ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}

export function StatsCard({ title, value, change, icon, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  }
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && <p className={`text-xs mt-1 font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month
          </p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}
