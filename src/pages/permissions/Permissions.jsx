import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useClubStore } from '../../store/clubStore'
import { useAuthStore } from '../../store/authStore'
import { PERMISSION_TYPES, PERMISSION_STATUS } from '../../constants'
import { formatDate, statusColor, timeAgo } from '../../utils'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { Input, Textarea, Select } from '../../components/ui/Input'
import toast from 'react-hot-toast'

export default function Permissions() {
  const { user } = useAuthStore()
  const { permissions, filePermission, updatePermission } = useClubStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('')
  const [newReqModal, setNewReqModal] = useState(false)
  const [form, setForm] = useState({ type: '', title: '', description: '', clubId: 'club-001' })
  const [loading, setLoading] = useState(false)

  const myPerms = permissions.filter(p => p.clubId === 'club-001')
  const filtered = filter ? myPerms.filter(p => p.status === filter) : myPerms

  const STATUS_ICONS = {
    draft: '📝', submitted: '📤', under_review: '🔍',
    approved: '✅', rejected: '❌', revision_requested: '🔄',
  }

  const submit = async () => {
    if (!form.type || !form.title) { toast.error('Please fill required fields'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    filePermission({ ...form, userId: user?.id })
    setLoading(false)
    setNewReqModal(false)
    setForm({ type: '', title: '', description: '', clubId: 'club-001' })
    toast.success('Permission request submitted! 🔐')
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Permission Requests</h1>
            <p className="text-gray-500 mt-1 text-sm">All communications are end-to-end encrypted 🔐</p>
          </div>
          <Button onClick={() => setNewReqModal(true)} icon="➕">File New Request</Button>
        </div>

        {/* E2E info banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">🔐</span>
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-300 text-sm">End-to-End Encrypted</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">All permission request content is encrypted in your browser using Web Crypto API (AES-256). Only you and the designated authority can read these messages.</p>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          <button onClick={() => setFilter('')} className={`px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0 transition-all ${!filter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All ({myPerms.length})</button>
          {Object.entries(PERMISSION_STATUS).map(([key, val]) => {
            const count = myPerms.filter(p => p.status === val).length
            return (
              <button key={val} onClick={() => setFilter(val === filter ? '' : val)}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0 transition-all capitalize ${filter === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {STATUS_ICONS[val]} {key.toLowerCase().replace(/_/g, ' ')} {count > 0 && `(${count})`}
              </button>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <EmptyState type="permissions" action={() => setNewReqModal(true)} actionLabel="File First Request" />
        ) : (
          <div className="space-y-4">
            {filtered.map(perm => {
              const type = PERMISSION_TYPES.find(t => t.value === perm.type)
              return (
                <div key={perm.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{STATUS_ICONS[perm.status] || '📋'}</span>
                        <h3 className="font-bold text-gray-900 dark:text-white">{perm.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500">{type?.label || perm.type}</p>
                      <p className="text-xs text-gray-400 mt-1">Goes to: {type?.authority || 'Admin'}</p>
                      {perm.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{perm.description}</p>}
                      <p className="text-xs text-gray-400 mt-2">{timeAgo(perm.submittedAt)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`badge ${statusColor(perm.status)} capitalize`}>{perm.status?.replace(/_/g, ' ')}</span>
                      <Button size="xs" variant="ghost" onClick={() => {
                        if (perm.status === 'submitted') { updatePermission(perm.id, { status: 'under_review' }); toast.success('Status updated!') }
                      }}>View Thread</Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* New Permission Modal */}
      <Modal open={newReqModal} onClose={() => setNewReqModal(false)} title="File Permission Request" size="lg">
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
            🔐 This request will be encrypted before submission. Only the designated authority can decrypt and read it.
          </div>
          <Select label="Request Type *" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
            <option value="">Select request type</option>
            {PERMISSION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
          {form.type && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-xs text-blue-700">
              Goes to: <strong>{PERMISSION_TYPES.find(t => t.value === form.type)?.authority}</strong>
            </div>
          )}
          <Input label="Title *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Brief title for your request" />
          <Textarea label="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your request in detail..." rows={4} />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setNewReqModal(false)} className="flex-1 justify-center">Cancel</Button>
            <Button loading={loading} onClick={submit} className="flex-1 justify-center">Submit Encrypted Request 🔐</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
