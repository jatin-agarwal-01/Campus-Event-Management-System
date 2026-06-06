import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set, get) => ({
      darkMode: false,
      sidebarOpen: true,
      notifDrawerOpen: false,
      commandPaletteOpen: false,
      notifications: [
        { id: 'n1', type: 'registration_confirmed', title: 'Registration Confirmed', message: 'You are registered for TechFest 2026!', read: false, time: new Date(Date.now() - 3600000).toISOString() },
        { id: 'n2', type: 'event_reminder', title: 'Event Reminder', message: 'Research Paper Workshop starts tomorrow at 10 AM.', read: false, time: new Date(Date.now() - 7200000).toISOString() },
        { id: 'n3', type: 'new_club_event', title: 'New Event from CS Club', message: 'CS Club just posted Startup Pitch Night!', read: true, time: new Date(Date.now() - 86400000).toISOString() },
      ],

      toggleDarkMode: () => {
        const next = !get().darkMode
        set({ darkMode: next })
        document.documentElement.classList.toggle('dark', next)
      },

      initDarkMode: () => {
        const { darkMode } = get()
        document.documentElement.classList.toggle('dark', darkMode)
      },

      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      openNotifDrawer: () => set({ notifDrawerOpen: true }),
      closeNotifDrawer: () => set({ notifDrawerOpen: false }),
      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),

      markNotifRead: (id) =>
        set(state => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n) })),

      markAllRead: () =>
        set(state => ({ notifications: state.notifications.map(n => ({ ...n, read: true })) })),

      addNotification: (notif) =>
        set(state => ({ notifications: [{ id: `n-${Date.now()}`, read: false, time: new Date().toISOString(), ...notif }, ...state.notifications] })),

      unreadCount: () => get().notifications.filter(n => !n.read).length,
    }),
    { name: 'cems-ui-v2', partialize: (state) => ({ darkMode: state.darkMode }) }
  )