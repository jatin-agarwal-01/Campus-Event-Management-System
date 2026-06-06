import { useState, useEffect } from 'react'
import { countdownTo } from '../../utils'

function Flip({ value, label }) {
  const str = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-900 text-white rounded-lg px-3 py-2 text-2xl font-mono font-bold min-w-[3rem] text-center">
        {str}
      </div>
      <span className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">{label}</span>
    </div>
  )
}

export default function Countdown({ date, time }) {
  const [cd, setCd] = useState(countdownTo(date, time))

  useEffect(() => {
    const interval = setInterval(() => setCd(countdownTo(date, time)), 1000)
    return () => clearInterval(interval)
  }, [date, time])

  if (!cd) return <span className="text-sm text-gray-500 font-medium">Event has started!</span>

  const urgency = cd.days === 0 && cd.hours < 2 ? 'text-red-500' : cd.days < 1 ? 'text-orange-500' : 'text-green-500'

  return (
    <div>
      <p className={`text-xs font-semibold mb-2 ${urgency}`}>
        {cd.days === 0 && cd.hours < 2 ? '🔴 Starting very soon!' : cd.days === 0 ? '🟠 Starting today!' : '🟢 Event countdown'}
      </p>
      <div className="flex items-end gap-2">
        {cd.days > 0 && <Flip value={cd.days} label="Days" />}
        <Flip value={cd.hours} label="Hours" />
        <Flip value={cd.minutes} label="Min" />
        <Flip value={cd.seconds} label="Sec" />
      </div>
    </div>
  )
}
