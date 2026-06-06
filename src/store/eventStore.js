import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_EVENTS } from '../constants'
import { generateId } from '../utils'

export const useEventStore = create(
  persist(
    (set, get) => ({
      events: MOCK_EVENTS,
      bookmarks: [],
      registrations: [],

      getEvent: (id) => get().events.find(e => e.id === id),

      addEvent: (event) => {
        const newEvent = { ...event, id: `evt-${generateId()}`, registered: 0, status: 'pending_approval' }
        set(state => ({ events: [newEvent, ...state.events] }))
        return newEvent
      },

      updateEvent: (id, updates) =>
        set(state => ({ events: state.events.map(e => e.id === id ? { ...e, ...updates } : e) })),

      deleteEvent: (id) =>
        set(state => ({ events: state.events.filter(e => e.id !== id) })),

      toggleBookmark: (eventId) =>
        set(state => ({
          bookmarks: state.bookmarks.includes(eventId)
            ? state.bookmarks.filter(id => id !== eventId)
            : [...state.bookmarks, eventId]
        })),

      register: (eventId, userId, ticketType = 'general', formData = {}) => {
        const registration = {
          id: `reg-${generateId()}`,
          eventId, userId, ticketType, formData,
          registeredAt: new Date().toISOString(),
          qrCode: `CEMS-${eventId}-${userId}-${Date.now()}`,
          status: 'confirmed',
        }
        set(state => ({
          registrations: [...state.registrations, registration],
          events: state.events.map(e => e.id === eventId ? { ...e, registered: (e.registered || 0) + 1 } : e),
        }))
        return registration
      },

      cancelRegistration: (regId) =>
        set(state => ({
          registrations: state.registrations.map(r => r.id === regId ? { ...r, status: 'cancelled' } : r),
        })),

      getUserRegistrations: (userId) => get().registrations.filter(r => r.userId === userId),

      isRegistered: (eventId, userId) =>
        get().registrations.some(r => r.eventId === eventId && r.userId === userId && r.status !== 'cancelled'),

      getEventRegistrations: (eventId) => get().registrations.filter(r => r.eventId === eventId),

      approveEvent: (id) =>
        set(state => ({ events: state.events.map(e => e.id === id ? { ...e, status: 'live' } : e) })),

      rejectEvent: (id, reason) =>
        set(state => ({ events: state.events.map(e => e.id === id ? { ...e, status: 'rejected', rejectionReason: reason } : e) })),
    }),
    { name: 'cems-events' }
  )
)
