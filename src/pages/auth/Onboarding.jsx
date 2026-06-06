import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { EVENT_CATEGORIES } from '../../constants'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const STEPS = ['Welcome', 'Interests', 'Profile', 'Done']

export default function Onboarding() {
  const { user, updateProfile } = useAuthStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [interests, setInterests] = useState([])
  const [bio, setBio] = useState('')

  const toggleInterest = (val) =>
    setInterests(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val])

  const finish = () => {
    updateProfile({ interests, bio })
    toast.success('Profile set up! Let\'s explore 🎉')
    navigate('/events')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100">
          <motion.div className="h-full bg-blue-600 rounded-full" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        <div className="p-8">
          <div className="flex justify-between mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex items-center gap-1.5 text-xs font-medium ${i <= step ? 'text-blue-600' : 'text-gray-300'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${i < step ? 'bg-blue-600 text-white' : i === step ? 'border-2 border-blue-600 text-blue-600' : 'border-2 border-gray-200 text-gray-300'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="hidden sm:block">{s}</span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="welcome" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-5xl mb-4">👋</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name?.split(' ')[0]}!</h2>
                <p className="text-gray-500 mb-8">Let's set up your profile so we can personalize your Campus Events experience.</p>
                <Button onClick={() => setStep(1)} className="w-full justify-center">Get Started →</Button>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="interests" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-1">What are you into?</h2>
                <p className="text-gray-500 text-sm mb-6">Select your interests to get personalized event recommendations</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {EVENT_CATEGORIES.map(cat => (
                    <button key={cat.value} onClick={() => toggleInterest(cat.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${interests.includes(cat.value) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(0)}>Back</Button>
                  <Button onClick={() => setStep(2)} className="flex-1 justify-center">Continue →</Button>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Tell us about yourself</h2>
                <p className="text-gray-500 text-sm mb-6">Add a short bio to your profile</p>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
                  placeholder="I'm a 3rd year CSE student passionate about AI and building products..."
                  className="input resize-none mb-8" />
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => setStep(3)} className="flex-1 justify-center">Continue →</Button>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h2>
                  <p className="text-gray-500 mb-8">Start exploring events, joining clubs, and connecting with your campus community.</p>
                  <Button onClick={finish} className="w-full justify-center">Explore Events →</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
