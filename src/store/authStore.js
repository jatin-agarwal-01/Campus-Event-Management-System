import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MOCK_USERS = [
  { id: 'u-001', name: 'Arjun Verma', email: 'arjun.verma@kiet.edu', role: 'student', department: 'CSE', year: 3, avatar: '', interests: ['tech', 'workshop'], bio: 'B.Tech CSE student passionate about AI and open source.' },
  { id: 'u-002', name: 'Priya Singh', email: 'priya.singh@kiet.edu', role: 'organizer', department: 'IT', year: 4, avatar: '', interests: ['tech', 'fest'], bio: 'Event organizer & tech enthusiast. Core team – KIET TechFest.' },
  { id: 'u-003', name: 'Dr. Ramesh Kumar', email: 'ramesh.kumar@kiet.edu', role: 'faculty', department: 'CSE', year: null, avatar: '', interests: [], bio: 'Associate Professor, CSE Dept. Faculty Advisor – Coding Club.' },
  { id: 'u-004', name: 'Prof. Meena Joshi', email: 'meena.joshi@kiet.edu', role: 'hod', department: 'CSE', year: null, avatar: '', interests: [], bio: 'Head of Department – Computer Science & Engineering, KIET.' },
  { id: 'u-005', name: 'Dean Admin', email: 'admin@kiet.edu', role: 'super_admin', department: null, year: null, avatar: '', interests: [], bio: 'Dean of Student Welfare, KIET Deemed to be University.' },
]

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: (email, password) => {
        const found = MOCK_USERS.find(u => u.email === email)
        if (found && password.length >= 4) {
          const token = `kiet-jwt-${found.id}-${Date.now()}`
          set({ user: found, isAuthenticated: true, token })
          return { success: true, user: found }
        }
        return { success: false, error: 'Invalid KIET email or password' }
      },

      register: (data) => {
        const newUser = { id: `u-${Date.now()}`, ...data, role: 'student', avatar: '', interests: [], bio: '' }
        set({ user: newUser, isAuthenticated: true, token: `kiet-jwt-${newUser.id}` })
        return { success: true, user: newUser }
      },

      logout: () => set({ user: null, isAuthenticated: false, token: null }),

      updateProfile: (updates) => set(state => ({ user: { ...state.user, ...updates } })),

      hasRole: (roles) => {
        const { user } = get()
        if (!user) return false
        return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles
      },
    }),
    { name: 'kiet-auth' }
  )
)
