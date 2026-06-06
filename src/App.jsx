import { useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useUIStore } from './store/uiStore'
import { useAuthStore } from './store/authStore'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Onboarding from './pages/auth/Onboarding'

// Main pages
import Home from './pages/Home'
import Events from './pages/events/Events'
import EventDetail from './pages/events/EventDetail'
import CreateEvent from './pages/events/CreateEvent'
import MyEvents from './pages/MyEvents'
import CalendarPage from './pages/CalendarPage'
import Search from './pages/Search'
import Notifications from './pages/Notifications'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Venues from './pages/Venues'

// Dashboards
import StudentDashboard from './pages/StudentDashboard'
import OrganizerDashboard from './pages/OrganizerDashboard'

// Clubs
import Clubs from './pages/clubs/Clubs'
import ClubWorkspace from './pages/clubs/ClubWorkspace'

// Permissions
import Permissions from './pages/permissions/Permissions'

// Admin
import AdminPanel from './pages/admin/AdminPanel'

// Protected route wrapper
function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { initDarkMode } = useUIStore()

  useEffect(() => {
    initDarkMode()
  }, [initDarkMode])

  return (
    <HashRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '14px', background: '#fff', color: '#111', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', fontSize: '14px' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/venues" element={<Venues />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected - Any authenticated user */}
        <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/profile/me" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Protected - Organizers+ */}
        <Route path="/events/create" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
        <Route path="/organizer/dashboard" element={<ProtectedRoute><OrganizerDashboard /></ProtectedRoute>} />
        <Route path="/permissions" element={<ProtectedRoute><Permissions /></ProtectedRoute>} />
        <Route path="/permissions/new" element={<ProtectedRoute><Permissions /></ProtectedRoute>} />

        {/* Club workspace */}
        <Route path="/clubs/:id/workspace" element={<ProtectedRoute><ClubWorkspace /></ProtectedRoute>} />
        <Route path="/clubs/:id/workspace/:section" element={<ProtectedRoute><ClubWorkspace /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={['super_admin', 'hod']}><AdminPanel /></ProtectedRoute>} />
        <Route path="/admin/:section" element={<ProtectedRoute roles={['super_admin', 'hod']}><AdminPanel /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-gray-50">
            <div className="text-8xl">🎪</div>
            <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
            <p className="text-gray-500">The page you're looking for doesn't exist.</p>
            <Link to="/" className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700">Go Home</Link>
          </div>
        } />
      </Routes>
    </HashRouter>
  )
}
