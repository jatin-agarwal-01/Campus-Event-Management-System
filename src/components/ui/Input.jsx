import { forwardRef } from 'react'

export const Input = forwardRef(({ label, error, className = '', prefix, suffix, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{prefix}</span>}
      <input
        ref={ref}
        className={`input ${prefix ? 'pl-9' : ''} ${suffix ? 'pr-9' : ''} ${error ? 'border-red-400 focus:ring-red-400' : ''} dark:bg-gray-800 dark:border-gray-600 dark:text-white ${className}`}
        {...props}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{suffix}</span>}
    </div>
    {error && <p className="text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{error}</p>}
  </div>
))
Input.displayName = 'Input'

export const Textarea = forwardRef(({ label, error, className = '', rows = 4, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <textarea
      ref={ref}
      rows={rows}
      className={`input resize-none ${error ? 'border-red-400' : ''} dark:bg-gray-800 dark:border-gray-600 dark:text-white ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
))
Textarea.displayName = 'Textarea'

export const Select = forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <select
      ref={ref}
      className={`input appearance-none dark:bg-gray-800 dark:border-gray-600 dark:text-white ${error ? 'border-red-400' : ''} ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
))
Select.displayName = 'Select'
