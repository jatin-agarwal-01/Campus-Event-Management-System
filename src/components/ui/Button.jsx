import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  ghost: 'hover:bg-gray-100 text-gray-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
  success: 'bg-green-600 hover:bg-green-700 text-white',
}
const sizes = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({ children, variant = 'primary', size = 'md', className = '', loading = false, icon, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? <span>{icon}</span> : null}
      {children}
    </motion.button>
  )
}
