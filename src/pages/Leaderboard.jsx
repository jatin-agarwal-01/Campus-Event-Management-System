import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import Avatar from '../components/ui/Avatar'

const LEADERBOARD = [
  { rank: 1, name: 'Arjun Verma', dept: 'CSE', events: 24, xp: 1840, badge: '🥇' },
  { rank: 2, name: 'Sneha Kapoor', dept: 'ECE', events: 19, xp: 1520, badge: '🥈' },
  { rank: 3, name: 'Rohan Das', dept: 'ME', events: 17, xp: 1380, badge: '🥉' },
  { rank: 4, name: 'Priya Singh', dept: 'CSE', events: 15, xp: 1200, badge: null },
  { rank: 5, name: 'Ankit Sharma', dept: 'IT', events: 14, xp: 1100, badge: null },
  { rank: 6, name: 'Kavya Reddy', dept: 'CE', events: 12, xp: 980, badge: null },
  { rank: 7, name: 'Vikram Nair', dept: 'MBA', events: 11, xp: 880, badge: null },
  { rank: 8, name: 'Ritu Mishra', dept: 'Physics', events: 10, xp: 810, badge: null },
  { rank: 9, name: 'Sourabh Jain', dept: 'MCA', events: 9, xp: 740, badge: null },
  { rank: 10, name: 'Deepika Patel', dept: 'Chemistry', events: 8, xp: 660, badge: null },
]

export default function Leaderboard() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🏆 Event Leaderboard</h1>
          <p className="text-gray-500 mt-1">Top event attendees this month</p>
        </div>

        {/* Top 3 podium */}
        <div className="flex items-end justify-center gap-4 mb-10">
          {[1, 0, 2].map((pos, idx) => {
            const p = LEADERBOARD[pos]
            const heights = ['h-28', 'h-36', 'h-24']
            const bgColors = ['bg-gray-100', 'bg-yellow-100', 'bg-orange-100']
            return (
              <motion.div key={p.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center gap-2">
                <Avatar name={p.name} size="lg" />
                <p className="text-sm font-bold text-gray-900 dark:text-white text-center">{p.name.split(' ')[0]}</p>
                <p className="text-xs text-gray-500">{p.xp} XP</p>
                <div className={`${heights[idx]} ${bgColors[idx]} rounded-t-2xl w-20 flex items-end justify-center pb-3 text-3xl`}>
                  {p.badge}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Full list */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          {LEADERBOARD.map((entry, i) => (
            <motion.div key={entry.rank} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 px-6 py-4 border-b border-gray-50 dark:border-gray-800 last:border-0 ${entry.rank <= 3 ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''}`}>
              <div className={`w-8 text-center font-extrabold ${entry.rank === 1 ? 'text-yellow-500' : entry.rank === 2 ? 'text-gray-400' : entry.rank === 3 ? 'text-orange-400' : 'text-gray-400'}`}>
                {entry.badge || `#${entry.rank}`}
              </div>
              <Avatar name={entry.name} size="sm" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{entry.name}</p>
                <p className="text-xs text-gray-500">{entry.dept}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white text-sm">{entry.xp} XP</p>
                <p className="text-xs text-gray-500">{entry.events} events</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
