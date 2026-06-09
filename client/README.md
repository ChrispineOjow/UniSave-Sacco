# UniSave Sacco — Frontend

> React + TypeScript + Tailwind CSS + Shadcn/ui frontend for the UniSave Sacco scholarship discovery platform.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Pages](#pages)
- [Components](#components)
- [State Management](#state-management)
- [API Services](#api-services)
- [TypeScript Types](#typescript-types)
- [Routing](#routing)
- [Styling](#styling)
- [Build and Deploy](#build-and-deploy)

---

## Overview

The UniSave Sacco frontend is a responsive single-page application built with React 19 and TypeScript. It provides two separate interfaces — one for students and one for administrators — both protected by JWT-based authentication stored in localStorage.

The UI is built with Tailwind CSS v4 and Shadcn/ui components using a professional navy blue and gold color scheme designed to convey trust, education, and opportunity.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 7.x | Build tool and dev server |
| Tailwind CSS | 4.x | Utility-first styling |
| Shadcn/ui | Latest | Accessible component library |
| React Router DOM | 7.x | Client-side routing |
| Axios | 1.x | HTTP client with interceptors |
| React Hot Toast | 2.x | Toast notifications |
| Lucide React | Latest | Icon library |
| Inter Variable Font | 5.x | Typography |

---

## Folder Structure

```
client/
├── public/                         # Static assets
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AuthLayout.tsx      # Shared two-column auth layout
│   │   │   ├── StudentLayout.tsx   # Student sidebar + topbar layout
│   │   │   └── AdminLayout.tsx     # Admin sidebar + topbar layout
│   │   └── ui/                     # Shadcn auto-generated components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       ├── dialog.tsx
│   │       ├── select.tsx
│   │       ├── tabs.tsx
│   │       ├── avatar.tsx
│   │       ├── label.tsx
│   │       └── ...
│   │
│   ├── context/
│   │   └── AuthContext.tsx         # Global auth state + localStorage sync
│   │
│   ├── pages/
│   │   ├── Landing.tsx             # Public landing page
│   │   ├── auth/
│   │   │   ├── Login.tsx           # Student + admin login (shared component)
│   │   │   └── Register.tsx        # Student registration
│   │   ├── student/
│   │   │   ├── Dashboard.tsx       # Student home with stats + recent activity
│   │   │   ├── Scholarships.tsx    # Browse + search + filter scholarships
│   │   │   ├── MatchedScholarships.tsx  # Algorithm-matched scholarships
│   │   │   ├── Applications.tsx    # Application tracker with status tabs
│   │   │   └── Profile.tsx         # Create + update academic profile
│   │   └── admin/
│   │       ├── AdminDashboard.tsx  # Admin home with system overview
│   │       ├── ManageStudents.tsx  # Approve/reject student accounts
│   │       └── ManageScholarships.tsx  # Add/verify/delete scholarships
│   │
│   ├── services/
│   │   ├── api.ts                  # Axios instance + interceptors
│   │   ├── auth.service.ts         # login, register, logout
│   │   ├── profile.service.ts      # create, get, update profile
│   │   ├── scholarship.service.ts  # scholarship CRUD
│   │   ├── application.service.ts  # application operations
│   │   └── admin.service.ts        # admin-specific operations
│   │
│   ├── types/
│   │   └── index.ts                # All TypeScript interfaces
│   │
│   ├── App.tsx                     # Route definitions + protected routes
│   ├── main.tsx                    # App entry + providers
│   └── index.css                   # Tailwind imports + CSS variables
│
├── .env                            # Environment variables
├── .env.example                    # Environment variable template
├── vite.config.ts                  # Vite + proxy configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- UniSave Sacco backend running (see server README)

### Installation

```bash
# Navigate to client folder
cd UniSaveSaccoSystem/client

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app runs at `http://localhost:5173`

### Other Commands

```bash
npm run build       # Build for production
npm run preview     # Preview production build locally
npm run typecheck   # Run TypeScript type checking
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
```

---

## Environment Variables

Create a `.env` file in the client root:

```bash
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

For production (Vercel):
```bash
VITE_API_URL=https://your-backend.onrender.com/api
```

> All Vite environment variables must start with `VITE_` to be accessible in the browser.

---

## Pages

### Public Pages

#### `/` — Landing Page
The first page users see. Includes:
- Navbar with login and register links
- Hero section with main headline and CTAs
- Statistics bar (scholarships, students, funding, success rate)
- How It Works section (3 steps)
- Featured Scholarships section (fetches real data from backend)
- Footer with quick links and contact info

#### `/login` — Student Login
Split-panel layout with stats on the left and login form on the right. Handles both student and admin login via the `isAdmin` prop.

#### `/admin/login` — Admin Login
Same component as Login with `isAdmin={true}` — shows admin badge and redirects to `/admin/dashboard` on success.

#### `/register` — Student Registration
Collects National ID, email, and password. Shows info banner explaining that admin approval is required before login.

---

### Student Pages (Protected)

All student pages are wrapped in `StudentLayout` which provides a responsive sidebar navigation.

#### `/dashboard` — Student Dashboard
- Stats cards: available scholarships, saved, applied, approved
- Urgent deadlines panel (scholarships closing within 7 days)
- Recent applications panel
- Quick action buttons
- Profile incomplete warning if profile not yet created

#### `/scholarships` — Browse Scholarships
- Search bar with live filtering
- Category filter (Government, NGO, County, University, Corporate)
- Funding type filter (Full, Partial, Loan, Bursary, Grant)
- Scholarship cards with Save and Apply Now buttons
- Loading skeleton cards while fetching
- Empty state with clear filters option

#### `/scholarships/matched` — Matched Scholarships
- Profile incomplete warning with CTA if no profile
- Match stats banner showing count and matching criteria used
- Same card layout as Scholarships but with "Matched for you" badge
- Empty state with link to browse all scholarships

#### `/applications` — Application Tracker
- Stats cards showing count per status
- Tabbed view: All, Saved, Applied, Pending, Approved
- Each card shows scholarship details, current status, and action buttons
- Students can update status to Applied or Pending
- Students can remove Saved scholarships
- Direct link to official application portal

#### `/profile` — Student Profile
- Organized into three sections: Personal Info, Academic Info, Location
- Handles both create (first time) and update (subsequent visits)
- All Kenyan counties in the county dropdown
- MTI Score input (0–100) — MTI Band calculated automatically by backend
- GPA input (0.0–4.0) with step validation

---

### Admin Pages (Protected)

All admin pages are wrapped in `AdminLayout` with navy sidebar and admin role badge.

#### `/admin/dashboard` — Admin Dashboard
- System stats: total students, pending approvals, scholarships, applications
- Pending approvals panel with student list
- Quick action cards linking to manage pages

#### `/admin/students` — Manage Students
- Total, pending, and approved stats cards
- Search by email or National ID
- Status filter dropdown
- Tabbed view: All, Pending, Approved, Rejected
- Approve and Reject buttons on pending students
- Visual indicators for approved (green check) and rejected (red X)

#### `/admin/scholarships` — Manage Scholarships
- Total, verified, and unverified stats cards
- Search by title or provider
- Add Scholarship dialog with full form
- Verify button on unverified scholarships
- Delete button on any scholarship
- Verified/Unverified badge on each card

---

## Components

### Layout Components

#### `AuthLayout`
Two-column layout for login and register pages.
- Left panel: Brand logo, headline, stats grid (hidden on mobile)
- Right panel: Page title, subtitle, and children (the form)

```tsx
<AuthLayout title="Welcome Back" subtitle="Sign in to your account">
    {/* form content */}
</AuthLayout>
```

#### `StudentLayout`
Full-page layout for authenticated student pages.
- Collapsible sidebar with navigation links
- Active link highlighting
- User avatar with initials
- Logout button
- Mobile hamburger menu with overlay

```tsx
<StudentLayout>
    {/* page content */}
</StudentLayout>
```

#### `AdminLayout`
Same structure as StudentLayout but with admin-specific navigation and role badge.

---

## State Management

The app uses React Context for global auth state. No external state management library is needed.

### `AuthContext`

Located at `src/context/AuthContext.tsx`

**Provides:**
```typescript
{
    // Student state
    student: StudentAuth | null
    studentProfile: StudentProfile | null
    studentToken: string | null
    isStudentLoggedIn: boolean

    // Admin state
    admin: Admin | null
    adminToken: string | null
    isAdminLoggedIn: boolean

    // Actions
    loginStudent(token, student, profile): void
    loginAdmin(token, admin): void
    logoutStudent(): void
    logoutAdmin(): void
    updateStudentProfile(profile): void

    // Loading
    isLoading: boolean
}
```

**localStorage Keys:**
```
studentToken      → JWT for student requests
student           → Serialized StudentAuth object
studentProfile    → Serialized StudentProfile object
adminToken        → JWT for admin requests
admin             → Serialized Admin object
```

**Usage:**
```tsx
import { useAuth } from '@/context/AuthContext';

const { student, isStudentLoggedIn, logoutStudent } = useAuth();
```

---

## API Services

All API calls go through the central Axios instance in `services/api.ts`.

### Axios Instance

```typescript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: { 'Content-Type': 'application/json' }
});
```

### Request Interceptor
Automatically attaches the correct JWT token based on the route:
- Routes containing `/admin` → uses `adminToken` from localStorage
- All other routes → uses `studentToken` from localStorage

### Response Interceptor
On 401 Unauthorized:
- Clears all auth data from localStorage
- Redirects to `/login`

### Service Files

| File | Functions |
|---|---|
| `auth.service.ts` | `registerStudent`, `loginStudent`, `logoutStudent`, `loginAdmin` |
| `profile.service.ts` | `createProfile`, `getMyProfile`, `updateProfile` |
| `scholarship.service.ts` | `getAllScholarships`, `getScholarshipById`, `getMatchedScholarships`, `addScholarship`, `updateScholarship`, `deleteScholarship`, `verifyScholarship`, `getAllScholarshipsAdmin` |
| `application.service.ts` | `saveScholarship`, `applyForScholarship`, `getMyApplications`, `updateApplicationStatus`, `deleteApplication`, `getAllApplicationsAdmin`, `updateApplicationStatusAdmin` |
| `admin.service.ts` | `getAllStudents`, `getPendingStudents`, `approveStudent`, `rejectStudent`, `updateApplicationStatusAdmin` |

---

## TypeScript Types

Located at `src/types/index.ts`

```typescript
StudentAuth          // id, email, nationalId, accountStatus
StudentProfile       // Full academic profile with MTI data
Scholarship          // Full scholarship with eligibility + funding
Application          // Application with populated scholarshipId
Admin                // id, email, role
AuthResponse         // Login API response shape
```

---

## Routing

Located at `src/App.tsx`

### Route Protection

```tsx
// Student protected route
const StudentRoute = ({ children }) => {
    const { isStudentLoggedIn, isLoading } = useAuth();
    if(isLoading) return <LoadingSpinner />;
    return isStudentLoggedIn ? children : <Navigate to="/login" />;
};

// Admin protected route
const AdminRoute = ({ children }) => {
    const { isAdminLoggedIn, isLoading } = useAuth();
    if(isLoading) return <LoadingSpinner />;
    return isAdminLoggedIn ? children : <Navigate to="/admin/login" />;
};
```

### Route Map

```
/                       Public     Landing page
/login                  Public     Student login
/register               Public     Student registration
/admin/login            Public     Admin login
/dashboard              Student    Student dashboard
/scholarships           Student    Browse scholarships
/scholarships/matched   Student    Matched scholarships
/applications           Student    Application tracker
/profile                Student    Academic profile
/admin/dashboard        Admin      Admin dashboard
/admin/students         Admin      Manage students
/admin/scholarships     Admin      Manage scholarships
*                       Any        Redirects to /
```

---

## Styling

### Color System

Defined in `src/index.css` using CSS custom properties:

```css
--primary:    #1E3A5F   /* Deep Navy Blue — trust, education */
--secondary:  #2E86AB   /* Cerulean Blue — technology, hope */
--accent:     #F5A623   /* Warm Gold — achievement, success */
--background: #F8FAFC   /* Off White — clean, readable */
```

### Tailwind Usage

```tsx
// Using theme colors
<div className="bg-primary text-white">        /* Navy background */
<div className="bg-accent text-primary">       /* Gold background */
<div className="bg-secondary text-white">      /* Blue background */
<div className="text-muted-foreground">        /* Secondary text */
```

### Shadcn Components Used

```
button          input           card
badge           dialog          select
tabs            avatar          label
dropdown-menu   toast           separator
```

### Responsive Design

All pages are mobile-first and responsive:
- Sidebars collapse to hamburger menu on mobile
- Grids stack vertically on small screens
- Cards stack from 3-column to 1-column on mobile
- Auth layout hides left panel on screens smaller than `lg` (1024px)

---

## Build and Deploy

### Build for Production

```bash
npm run build
```

Output is generated in the `dist/` folder.

### Deploy to Vercel

#### Option 1 — Vercel CLI

```bash
npm install -g vercel
vercel
```

#### Option 2 — GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Set **Root Directory** to `client`
4. Add environment variable:
   ```
   VITE_API_URL = https://your-backend.onrender.com/api
   ```
5. Click Deploy

### Vercel Configuration

Create a `vercel.json` in the client folder to handle SPA routing:

```json
{
    "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
    ]
}
```

This ensures React Router handles all routes instead of Vercel returning 404 on page refresh.

---

## Known Issues and Notes

- **Scraper data** — some Kenyan government sites block automated requests. Scrapers include fallback manual entries to ensure data is always available.
- **MTI Score** — students need to know their MTI score from the HEF portal before completing their profile. This is a government-assigned score.
- **Admin approval** — students must wait for manual admin approval before they can log in. This is by design to prevent unauthorized access.
- **Session persistence** — auth tokens are stored in localStorage. Clearing browser data will log the user out.