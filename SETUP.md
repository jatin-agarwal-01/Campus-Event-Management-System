# Campus Event Management System (CEMS) v2.0

> React 18 + Tailwind CSS v3 — Full-featured campus event platform

## 🚀 Quick Start

```bash
# 1. Install dependencies (run this first!)
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

Open http://localhost:5173 after `npm run dev`.

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Student | arjun@college.edu | pass1 |
| Organizer | priya@college.edu | pass1 |
| Super Admin | admin@college.edu | pass1 |

Or click the quick-fill buttons on the Login page.

---

## 📁 Project Structure

```
src/
├── App.jsx                  # Router with all routes
├── main.jsx                 # Entry point
├── index.css                # Tailwind + global styles
├── constants/               # Roles, categories, mock data
├── utils/                   # Date, format, download helpers
├── store/                   # Zustand stores (auth, events, clubs, ui)
├── crypto/                  # E2E encryption (Web Crypto API)
├── components/
│   ├── ui/                  # Button, Input, Modal, Card, Badge, Avatar, Skeleton...
│   ├── layout/              # Navbar, Sidebar, Footer, MobileNav, Layout
│   └── notifications/       # Notification drawer
└── pages/
    ├── auth/                # Login, Register, Onboarding
    ├── events/              # Events listing, detail, create
    ├── clubs/               # Clubs list, club workspace
    ├── permissions/         # Permission request system
    ├── admin/               # Admin panel
    ├── Home.jsx
    ├── StudentDashboard.jsx
    ├── OrganizerDashboard.jsx
    ├── CalendarPage.jsx
    ├── MyEvents.jsx
    ├── Notifications.jsx
    ├── Profile.jsx
    ├── Search.jsx
    ├── Venues.jsx
    └── Leaderboard.jsx
```

---

## 🗺️ All Routes

| Route | Page |
|---|---|
| `/` | Home / Landing |
| `/events` | Events Listing |
| `/events/:id` | Event Detail |
| `/events/create` | Create Event (multi-step) |
| `/calendar` | Campus Calendar |
| `/clubs` | Clubs Listing |
| `/clubs/:id/workspace` | Club Workspace |
| `/dashboard` | Student Dashboard |
| `/organizer/dashboard` | Organizer Dashboard |
| `/my-events` | My Registrations + QR Tickets |
| `/permissions` | Permission Requests |
| `/admin` | Admin Panel |
| `/profile/me` | User Profile |
| `/leaderboard` | Gamification Leaderboard |
| `/notifications` | Notifications |
| `/search` | Global Search |
| `/venues` | Venue Listing |
| `/login` | Login |
| `/register` | Register |
| `/onboarding` | Onboarding Wizard |

---

## ⚙️ Setup Instructions (to replace old files)

1. Copy the entire `cems/` folder to `D:\E\Campus-Event-Management-System\`
2. Delete old files: `*.html`, `css/`, `js/`, `assets/` from the root
3. Run `npm install` inside the project folder
4. Run `npm run dev` to start

---

## 🛠️ Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS v3** — utility-first styling
- **React Router v6** — routing
- **Zustand** — state management (with localStorage persistence)
- **React Query** — ready to wire up to backend
- **React Hook Form + Zod** — form validation
- **Framer Motion** — animations
- **Recharts** — analytics charts
- **qrcode.react** — QR code generation
- **Web Crypto API** — E2E encryption for permissions

---

## 📋 What's Implemented

### Phase 1 ✅ MVP
- Login / Register / Onboarding wizard
- Home with hero, category pills, featured events, trending
- Events listing with filters, search, sort, grid/list toggle
- Event detail: tabs (about/agenda/speakers/FAQ), countdown, registration, confetti
- Multi-step event creation form (5 steps)
- My Registrations with QR ticket modal

### Phase 2 ✅ Core Features
- Student Dashboard: stats, timeline, activity chart, XP, badges, streak
- Organizer Dashboard: performance, registration trend, CSV export
- Club Workspace: Members, Budget, Sponsors CRM, Knowledge Base, Volunteers
- E2E encrypted Permission Request system
- Campus Calendar with blackout dates
- Notification system with drawer + full page

### Phase 3 ✅ Advanced
- Admin Panel: approve/reject events, club verification, audit logs
- Global search with Cmd+K command palette
- User Profile with badge showcase
- Gamification Leaderboard
- Venue listing
- Dark mode (toggle in navbar)
- Mobile navigation bar
- Toast notifications throughout

---

*CEMS v2.0 — React + Tailwind | Built per documentation*
