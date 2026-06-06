import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_CLUBS } from '../constants'
import { generateId } from '../utils'

export const useClubStore = create(
  persist(
    (set, get) => ({
      clubs: MOCK_CLUBS,
      following: [],
      members: {
        'club-001': [
          { id: 'u-002', name: 'Priya Singh', email: 'priya@college.edu', role: 'President', joinedAt: '2025-08-01' },
          { id: 'u-006', name: 'Rohan Das', email: 'rohan@college.edu', role: 'Event Head', joinedAt: '2025-08-05' },
        ],
      },
      budgets: {},
      sponsors: {},
      volunteers: {},
      knowledgeBase: {},
      permissions: [],

      getClub: (id) => get().clubs.find(c => c.id === id),

      toggleFollow: (clubId) =>
        set(state => ({
          following: state.following.includes(clubId)
            ? state.following.filter(id => id !== clubId)
            : [...state.following, clubId]
        })),

      isFollowing: (clubId) => get().following.includes(clubId),

      getClubMembers: (clubId) => get().members[clubId] || [],

      addMember: (clubId, member) =>
        set(state => ({
          members: {
            ...state.members,
            [clubId]: [...(state.members[clubId] || []), { id: generateId(), ...member, joinedAt: new Date().toISOString() }]
          }
        })),

      getBudget: (eventId) => get().budgets[eventId] || { income: [], expenses: [], totalIncome: 0, totalExpenses: 0 },

      updateBudget: (eventId, budget) =>
        set(state => ({ budgets: { ...state.budgets, [eventId]: budget } })),

      getSponsors: (clubId) => get().sponsors[clubId] || [],

      addSponsor: (clubId, sponsor) =>
        set(state => ({
          sponsors: {
            ...state.sponsors,
            [clubId]: [...(state.sponsors[clubId] || []), { id: generateId(), ...sponsor, createdAt: new Date().toISOString() }]
          }
        })),

      updateSponsor: (clubId, sponsorId, updates) =>
        set(state => ({
          sponsors: {
            ...state.sponsors,
            [clubId]: (state.sponsors[clubId] || []).map(s => s.id === sponsorId ? { ...s, ...updates } : s)
          }
        })),

      getVolunteers: (eventId) => get().volunteers[eventId] || [],

      addVolunteerRole: (eventId, role) =>
        set(state => ({
          volunteers: {
            ...state.volunteers,
            [eventId]: [...(state.volunteers[eventId] || []), { id: generateId(), ...role, applicants: [] }]
          }
        })),

      getKBPages: (clubId) => get().knowledgeBase[clubId] || [],

      addKBPage: (clubId, page) =>
        set(state => ({
          knowledgeBase: {
            ...state.knowledgeBase,
            [clubId]: [...(state.knowledgeBase[clubId] || []), { id: generateId(), ...page, createdAt: new Date().toISOString(), versions: [page.content] }]
          }
        })),

      filePermission: (req) => {
        const perm = { id: `perm-${generateId()}`, ...req, status: 'submitted', submittedAt: new Date().toISOString(), thread: [] }
        set(state => ({ permissions: [perm, ...state.permissions] }))
        return perm
      },

      updatePermission: (id, updates) =>
        set(state => ({ permissions: state.permissions.map(p => p.id === id ? { ...p, ...updates } : p) })),

      getPermissions: (clubId) => get().permissions.filter(p => p.clubId === clubId),
    }),
    { name: 'cems-clubs' }
  )
)
