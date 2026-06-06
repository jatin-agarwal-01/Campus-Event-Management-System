import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useEventStore } from '../../store/eventStore'
import { useAuthStore } from '../../store/authStore'
import { EVENT_CATEGORIES, MOCK_VENUES } from '../../constants'
import Layout from '../../components/layout/Layout'
import { Input, Textarea, Select } from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const STEPS = [
  { title: 'Basic Info', desc: 'Title, category, description' },
  { title: 'Date & Venue', desc: 'When and where' },
  { title: 'Media', desc: 'Images and video' },
  { title: 'Tickets', desc: 'Registration settings' },
  { title: 'Preview', desc: 'Review and publish' },
]

export default function CreateEvent() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    title: '', category: '', description: '', tags: '',
    date: '', time: '', endDate: '', endTime: '', venue: '', isOnline: false,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    freeEvent: true, ticketTypes: [{ label: 'General', price: 0, capacity: 100 }],
    visibility: 'public',
  })
  const [loading, setLoading] = useState(false)
  const { addEvent } = useEventStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const update = (key, value) => setFormData(prev => ({ ...prev, [key]: value }))

  const next = () => { if (step < STEPS.length - 1) setStep(s => s + 1) }
  const prev = () => { if (step > 0) setStep(s => s - 1) }

  const publish = async (status = 'pending_approval') => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const event = addEvent({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      organizer: user?.name || 'Unknown',
      organizerId: user?.id,
      status,
    })
    setLoading(false)
    toast.success(status === 'draft' ? 'Event saved as draft!' : 'Event submitted for approval! 🎉')
    navigate(status === 'draft' ? '/organizer/dashboard' : `/events/${event.id}`)
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Event</h1>
          <p className="text-gray-500 mt-1">Step {step + 1} of {STEPS.length} — {STEPS[step].desc}</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-0 mb-10 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <button onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 ${i <= step ? 'cursor-pointer' : 'cursor-default'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < step ? 'bg-blue-600 text-white' : i === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-100 text-gray-400'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{s.title}</span>
              </button>
              {i < STEPS.length - 1 && <div className={`h-0.5 w-8 sm:w-12 mx-2 transition-all ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">

            {/* Step 1: Basic Info */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">📝 Basic Information</h2>
                <Input label="Event Title *" placeholder="e.g. Annual TechFest 2026" value={formData.title} onChange={e => update('title', e.target.value)} />
                <Select label="Category *" value={formData.category} onChange={e => update('category', e.target.value)}>
                  <option value="">Select a category</option>
                  {EVENT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                </Select>
                <Textarea label="Short Description *" placeholder="Briefly describe your event..." rows={3} value={formData.description} onChange={e => update('description', e.target.value)} />
                <Input label="Tags (comma-separated)" placeholder="hackathon, AI, robotics" value={formData.tags} onChange={e => update('tags', e.target.value)} />
              </div>
            )}

            {/* Step 2: Date & Venue */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">📅 Date & Venue</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Start Date *" type="date" value={formData.date} onChange={e => update('date', e.target.value)} />
                  <Input label="Start Time *" type="time" value={formData.time} onChange={e => update('time', e.target.value)} />
                  <Input label="End Date" type="date" value={formData.endDate} onChange={e => update('endDate', e.target.value)} />
                  <Input label="End Time" type="time" value={formData.endTime} onChange={e => update('endTime', e.target.value)} />
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <input type="checkbox" id="online" checked={formData.isOnline} onChange={e => update('isOnline', e.target.checked)} className="w-4 h-4 accent-blue-600" />
                  <label htmlFor="online" className="text-sm font-medium text-gray-700 dark:text-gray-300">This is an online event</label>
                </div>
                {!formData.isOnline && (
                  <Select label="Venue *" value={formData.venue} onChange={e => update('venue', e.target.value)}>
                    <option value="">Select venue</option>
                    {MOCK_VENUES.map(v => <option key={v.id} value={v.name}>{v.name} (Cap: {v.capacity})</option>)}
                    <option value="custom">Other / Custom Venue</option>
                  </Select>
                )}
                {formData.isOnline && <Input label="Online Event Link" placeholder="https://meet.google.com/..." value={formData.onlineLink} onChange={e => update('onlineLink', e.target.value)} />}
              </div>
            )}

            {/* Step 3: Media */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">🖼️ Media</h2>
                <Input label="Banner Image URL" placeholder="https://..." value={formData.image} onChange={e => update('image', e.target.value)} />
                {formData.image && (
                  <div className="rounded-2xl overflow-hidden h-48">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={() => update('image', '')} />
                  </div>
                )}
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center">
                  <div className="text-3xl mb-2">📤</div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload banner image</p>
                  <p className="text-xs text-gray-400 mt-1">Or paste an image URL above</p>
                  <Button size="sm" variant="secondary" className="mt-4">Choose File</Button>
                </div>
                <Input label="Promo Video URL (optional)" placeholder="https://youtube.com/..." value={formData.videoUrl} onChange={e => update('videoUrl', e.target.value)} />
              </div>
            )}

            {/* Step 4: Tickets */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">🎟️ Tickets & Registration</h2>
                <div className="flex gap-4">
                  <button onClick={() => update('freeEvent', true)} className={`flex-1 p-4 rounded-xl border-2 text-sm font-semibold transition-all ${formData.freeEvent ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}>Free Event</button>
                  <button onClick={() => update('freeEvent', false)} className={`flex-1 p-4 rounded-xl border-2 text-sm font-semibold transition-all ${!formData.freeEvent ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}>Paid Event</button>
                </div>
                {formData.ticketTypes.map((t, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-3">
                    <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">Ticket Type {i + 1}</p>
                    <div className="grid grid-cols-3 gap-3">
                      <Input placeholder="Label" value={t.label} onChange={e => { const tt = [...formData.ticketTypes]; tt[i].label = e.target.value; update('ticketTypes', tt) }} />
                      <Input type="number" placeholder="Price ₹" value={t.price} disabled={formData.freeEvent} onChange={e => { const tt = [...formData.ticketTypes]; tt[i].price = parseInt(e.target.value) || 0; update('ticketTypes', tt) }} />
                      <Input type="number" placeholder="Capacity" value={t.capacity} onChange={e => { const tt = [...formData.ticketTypes]; tt[i].capacity = parseInt(e.target.value) || 0; update('ticketTypes', tt) }} />
                    </div>
                  </div>
                ))}
                <Button variant="secondary" size="sm" onClick={() => update('ticketTypes', [...formData.ticketTypes, { label: '', price: 0, capacity: 50 }])}>+ Add Ticket Type</Button>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Visibility</label>
                    <select value={formData.visibility} onChange={e => update('visibility', e.target.value)} className="input">
                      <option value="public">Public</option>
                      <option value="college">College Only</option>
                      <option value="invite">Invite Only</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Preview */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">👁️ Preview</h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden">
                  {formData.image && <img src={formData.image} alt="" className="w-full h-40 object-cover" />}
                  <div className="p-5">
                    <span className="badge bg-blue-100 text-blue-700 mb-2">{EVENT_CATEGORIES.find(c => c.value === formData.category)?.label || 'Category'}</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{formData.title || 'Event Title'}</h3>
                    <p className="text-sm text-gray-500 mt-1">📅 {formData.date} · ⏰ {formData.time}</p>
                    <p className="text-sm text-gray-500">📍 {formData.venue || 'Venue TBD'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-3">{formData.description}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  ⚠️ Your event will be sent for approval before going live. You'll be notified once approved.
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              {step > 0 && <Button variant="secondary" onClick={prev}>← Back</Button>}
              <div className="flex-1" />
              {step < STEPS.length - 1 && <Button onClick={next} disabled={step === 0 && (!formData.title || !formData.category)}>Continue →</Button>}
              {step === STEPS.length - 1 && (
                <>
                  <Button variant="secondary" loading={loading} onClick={() => publish('draft')}>Save Draft</Button>
                  <Button loading={loading} onClick={() => publish('pending_approval')}>Submit for Approval 🚀</Button>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  )
}
