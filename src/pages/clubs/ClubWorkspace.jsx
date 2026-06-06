import { useState } from 'react'
import { useParams, Link, NavLink } from 'react-router-dom'
import { useClubStore } from '../../store/clubStore'
import { useAuthStore } from '../../store/authStore'
import { CLUB_ROLES, SPONSOR_STAGES } from '../../constants'
import { generateId } from '../../utils'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Input, Textarea, Select } from '../../components/ui/Input'
import Avatar from '../../components/ui/Avatar'
import toast from 'react-hot-toast'

const TABS = [
  { key: 'overview', label: 'Overview', icon: '🏠' },
  { key: 'members', label: 'Members', icon: '👥' },
  { key: 'budget', label: 'Budget', icon: '💰' },
  { key: 'sponsors', label: 'Sponsors', icon: '🤝' },
  { key: 'volunteers', label: 'Volunteers', icon: '⭐' },
  { key: 'knowledge', label: 'Knowledge Base', icon: '📖' },
]

export default function ClubWorkspace() {
  const { id } = useParams()
  const { getClub, getClubMembers, addMember, getBudget, updateBudget, getSponsors, addSponsor, updateSponsor, getKBPages, addKBPage } = useClubStore()
  const { user } = useAuthStore()
  const [tab, setTab] = useState('overview')
  const [addMemberModal, setAddMemberModal] = useState(false)
  const [addSponsorModal, setAddSponsorModal] = useState(false)
  const [addKBModal, setAddKBModal] = useState(false)
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Member' })
  const [newSponsor, setNewSponsor] = useState({ name: '', contact: '', stage: 'Contacted', notes: '' })
  const [newKB, setNewKB] = useState({ title: '', content: '' })

  const club = getClub(id)
  const members = getClubMembers(id)
  const budget = getBudget(id)
  const sponsors = getSponsors(id)
  const kbPages = getKBPages(id)

  if (!club) return <Layout><div className="p-8 text-center"><h2 className="text-xl font-bold">Club not found</h2></div></Layout>

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {club.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{club.name}</h1>
              {club.verified && <span className="badge bg-blue-100 text-blue-700">✓ Verified</span>}
            </div>
            <p className="text-gray-500 text-sm">{club.members} members · Club Workspace</p>
          </div>
          <div className="flex gap-2">
            <Link to="/events/create"><Button size="sm" icon="➕">Create Event</Button></Link>
            <Link to="/permissions/new"><Button size="sm" variant="secondary" icon="🔐">File Permission</Button></Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6 w-fit max-w-full">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${tab === t.key ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Members', value: members.length, icon: '👥' },
              { label: 'Events Hosted', value: 12, icon: '🎟️' },
              { label: 'Sponsors', value: sponsors.length, icon: '🤝' },
              { label: 'KB Pages', value: kbPages.length, icon: '📖' },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 text-center">
                <p className="text-3xl mb-1">{s.icon}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Members */}
        {tab === 'members' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Club Members</h2>
              <Button size="sm" onClick={() => setAddMemberModal(true)} icon="➕">Add Member</Button>
            </div>
            <div className="space-y-3">
              {members.map(m => (
                <div key={m.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Avatar name={m.name} size="md" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.email}</p>
                  </div>
                  <span className="badge bg-blue-100 text-blue-700 text-xs">{m.role}</span>
                  <p className="text-xs text-gray-400 hidden sm:block">Joined {m.joinedAt?.slice(0, 10)}</p>
                </div>
              ))}
              {members.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No members yet. Add your first member!</p>}
            </div>
          </div>
        )}

        {/* Budget */}
        {tab === 'budget' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-5">Budget Sheet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income */}
              <div>
                <h3 className="font-semibold text-green-600 mb-3 text-sm uppercase tracking-wide">Income Sources</h3>
                <div className="space-y-2 mb-3">
                  {(budget.income || []).map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                      <span className="font-semibold text-green-600">₹{item.amount}</span>
                    </div>
                  ))}
                  {(!budget.income || budget.income.length === 0) && <p className="text-gray-400 text-sm">No income entries yet</p>}
                </div>
                <Button size="sm" variant="secondary" onClick={() => {
                  const updated = { ...budget, income: [...(budget.income || []), { name: 'Ticket Sales', amount: 5000 }] }
                  updateBudget(id, updated)
                  toast.success('Income entry added!')
                }}>+ Add Income</Button>
              </div>
              {/* Expenses */}
              <div>
                <h3 className="font-semibold text-red-600 mb-3 text-sm uppercase tracking-wide">Expenses</h3>
                <div className="space-y-2 mb-3">
                  {(budget.expenses || []).map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                      <span className="font-semibold text-red-600">₹{item.amount}</span>
                    </div>
                  ))}
                  {(!budget.expenses || budget.expenses.length === 0) && <p className="text-gray-400 text-sm">No expense entries yet</p>}
                </div>
                <Button size="sm" variant="secondary" onClick={() => {
                  const updated = { ...budget, expenses: [...(budget.expenses || []), { name: 'Venue Hire', amount: 2000 }] }
                  updateBudget(id, updated)
                  toast.success('Expense entry added!')
                }}>+ Add Expense</Button>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white">Net Balance</span>
                <span className={`text-xl font-extrabold ${((budget.income || []).reduce((s, i) => s + i.amount, 0) - (budget.expenses || []).reduce((s, i) => s + i.amount, 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{(budget.income || []).reduce((s, i) => s + i.amount, 0) - (budget.expenses || []).reduce((s, i) => s + i.amount, 0)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Sponsors */}
        {tab === 'sponsors' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Sponsorship CRM</h2>
              <Button size="sm" onClick={() => setAddSponsorModal(true)} icon="➕">Add Sponsor</Button>
            </div>
            <div className="space-y-3">
              {sponsors.map(s => (
                <div key={s.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-600">{s.name.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.contact}</p>
                    {s.notes && <p className="text-xs text-gray-400 mt-0.5">{s.notes}</p>}
                  </div>
                  <select value={s.stage} onChange={e => updateSponsor(id, s.id, { stage: e.target.value })}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600">
                    {SPONSOR_STAGES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              ))}
              {sponsors.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No sponsors yet. Add your first potential sponsor!</p>}
            </div>
          </div>
        )}

        {/* Knowledge Base */}
        {tab === 'knowledge' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">📖 Club Knowledge Base</h2>
              <Button size="sm" onClick={() => setAddKBModal(true)} icon="➕">Add Page</Button>
            </div>
            {kbPages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">📖</p>
                <p className="text-gray-400 text-sm">No knowledge base pages yet. Start documenting your SOPs, contacts, and runbooks!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kbPages.map(page => (
                  <div key={page.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{page.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-3">{page.content}</p>
                    <p className="text-xs text-gray-400 mt-2">Created {page.createdAt?.slice(0, 10)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Volunteers placeholder */}
        {tab === 'volunteers' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 text-center">
            <p className="text-4xl mb-3">⭐</p>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Volunteer Management</h2>
            <p className="text-gray-500 text-sm mb-6">Create volunteer roles for events, manage shifts, and track volunteer hours.</p>
            <Button>Create Volunteer Roles</Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal open={addMemberModal} onClose={() => setAddMemberModal(false)} title="Add Club Member" size="sm">
        <div className="space-y-4">
          <Input label="Full Name" value={newMember.name} onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))} placeholder="Member name" />
          <Input label="Email" type="email" value={newMember.email} onChange={e => setNewMember(p => ({ ...p, email: e.target.value }))} placeholder="member@college.edu" />
          <Select label="Role" value={newMember.role} onChange={e => setNewMember(p => ({ ...p, role: e.target.value }))}>
            {CLUB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
          <Button className="w-full justify-center" onClick={() => {
            if (!newMember.name || !newMember.email) { toast.error('Name and email required'); return }
            addMember(id, newMember)
            setAddMemberModal(false)
            setNewMember({ name: '', email: '', role: 'Member' })
            toast.success('Member added!')
          }}>Add Member</Button>
        </div>
      </Modal>

      <Modal open={addSponsorModal} onClose={() => setAddSponsorModal(false)} title="Add Sponsor" size="sm">
        <div className="space-y-4">
          <Input label="Company Name" value={newSponsor.name} onChange={e => setNewSponsor(p => ({ ...p, name: e.target.value }))} placeholder="ACME Corp" />
          <Input label="Contact" value={newSponsor.contact} onChange={e => setNewSponsor(p => ({ ...p, contact: e.target.value }))} placeholder="email or phone" />
          <Select label="Stage" value={newSponsor.stage} onChange={e => setNewSponsor(p => ({ ...p, stage: e.target.value }))}>
            {SPONSOR_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Textarea label="Notes" value={newSponsor.notes} onChange={e => setNewSponsor(p => ({ ...p, notes: e.target.value }))} placeholder="Initial contact details..." rows={2} />
          <Button className="w-full justify-center" onClick={() => {
            if (!newSponsor.name) { toast.error('Company name required'); return }
            addSponsor(id, newSponsor)
            setAddSponsorModal(false)
            setNewSponsor({ name: '', contact: '', stage: 'Contacted', notes: '' })
            toast.success('Sponsor added!')
          }}>Add Sponsor</Button>
        </div>
      </Modal>

      <Modal open={addKBModal} onClose={() => setAddKBModal(false)} title="Add Knowledge Base Page">
        <div className="space-y-4">
          <Input label="Page Title" value={newKB.title} onChange={e => setNewKB(p => ({ ...p, title: e.target.value }))} placeholder="Event SOP, Vendor Contacts..." />
          <Textarea label="Content" value={newKB.content} onChange={e => setNewKB(p => ({ ...p, content: e.target.value }))} placeholder="Document your knowledge here..." rows={6} />
          <Button className="w-full justify-center" onClick={() => {
            if (!newKB.title || !newKB.content) { toast.error('Title and content required'); return }
            addKBPage(id, newKB)
            setAddKBModal(false)
            setNewKB({ title: '', content: '' })
            toast.success('Page added!')
          }}>Save Page</Button>
        </div>
      </Modal>
    </Layout>
  )
}
