# UniSave Sacco 

> Kenya's Scholarship Discovery Platform — connecting university students with government, county, and private funding opportunities.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/atlas)

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Author](#author)

---

## Overview

UniSave Sacco is a full-stack web platform developed as a Diploma in Information Technology final year project at the Technical University of Kenya. It addresses the critical problem of university dropout caused by financial barriers by creating a centralized, intelligent scholarship discovery and tracking system for Kenyan university students.

The platform aggregates scholarships from government portals (HELB, HEF), county governments (NG-CDF), and private foundations (Equity Wings to Fly, Mastercard Foundation), matches students to opportunities based on their profile using a Means Testing Instrument (MTI) scoring algorithm, and sends automated deadline reminders via email.

---

## Problem Statement

Financial hardship remains a major driver of university dropout in Kenya. Despite government interventions such as HELB loans and the Student-Centered Funding Model (SCFM), funding demand consistently exceeds available resources. Additionally:

- Government scholarships (HEF portal) and private bursaries operate in silos — students must monitor multiple websites manually
- No intelligent matching system exists to connect students to relevant opportunities based on their specific eligibility
- Students miss application deadlines due to lack of timely notifications
- County/NG-CDF bursaries are poorly advertised and difficult to discover online

---

## Solution

UniSave Sacco addresses these gaps through:

- **Centralized Aggregation** — a single platform listing government, county, corporate, and NGO scholarships
- **Intelligent Matching** — an algorithm that compares student profiles (MTI score, GPA, county, course, year of study) against scholarship eligibility criteria
- **Application Tracking** — a personal dashboard where students track applications from saved → applied → approved
- **Automated Notifications** — daily cron jobs that email students about scholarships with deadlines in the next 7 days
- **Web Scraping** — automated scrapers that pull fresh scholarship data from HELB, HEF, and Equity Foundation weekly

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Vercel)                       │
│         React 19 + TypeScript + Tailwind + Shadcn        │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS (Axios)
┌────────────────────────▼────────────────────────────────┐
│                    SERVER (Render)                       │
│              Node.js + Express.js REST API               │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Routes  │→ │Controllers│→ │ Services │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                    │                    │
│  ┌─────────────┐  ┌─────────────┐ │                   │
│  │  Scrapers   │  │ Cron Jobs   │ │                   │
│  │ (Cheerio +  │  │ (node-cron) │ │                   │
│  │  Puppeteer) │  └─────────────┘ │                   │
│  └─────────────┘                  │                    │
└───────────────────────────────────┼────────────────────┘
                                    │ Mongoose
┌───────────────────────────────────▼────────────────────┐
│                  MongoDB Atlas (Cloud)                   │
│                                                         │
│  Collections: student_auth │ student_profile            │
│               scholarship  │ application  │ admin        │
└─────────────────────────────────────────────────────────┘
```

---

## Features

### Student Features
- **Registration & Authentication** — register with National ID, await admin approval, then login with JWT
- **Profile Management** — complete academic profile with MTI score, GPA, county, course, and year of study
- **Scholarship Discovery** — browse all verified scholarships with search and filter (category, funding type)
- **Intelligent Matching** — get scholarships automatically matched to your specific profile
- **Application Tracking** — save scholarships, mark as applied, track status from saved → approved
- **Email Notifications** — automated deadline reminders 7 days before closing date

### Admin Features
- **Student Management** — review, approve, or reject student registrations
- **Scholarship Management** — add, edit, verify, and delete scholarships
- **Application Oversight** — view all applications and update statuses
- **Role-Based Access** — superadmin and moderator roles with different permissions

### Automated Features
- **Web Scrapers** — weekly automated scraping from HELB, HEF, Equity Foundation, and NG-CDF
- **Cron Jobs** — daily deadline checks and weekly scholarship updates
- **Email System** — welcome emails on approval and deadline reminder emails via Nodemailer

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript 5.9 | Type safety |
| Tailwind CSS v4 | Styling |
| Shadcn/ui | Component library |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| Vite | Build tool |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB + Mongoose | Database + ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Nodemailer | Email service |
| node-cron | Task scheduling |
| Cheerio | Static HTML scraping |
| Puppeteer | JavaScript-rendered scraping |
| CORS | Cross-origin resource sharing |

### Infrastructure
| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Render | Backend hosting |
| Vercel | Frontend hosting |
| Gmail SMTP | Email delivery |

---

## Project Structure

```
UniSaveSaccoSystem/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AuthLayout.tsx   # Shared auth page layout
│   │   │   │   ├── StudentLayout.tsx # Student dashboard layout
│   │   │   │   └── AdminLayout.tsx  # Admin panel layout
│   │   │   └── ui/                  # Shadcn components
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Global auth state
│   │   ├── pages/
│   │   │   ├── Landing.tsx          # Public landing page
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx        # Student + admin login
│   │   │   │   └── Register.tsx     # Student registration
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.tsx    # Student home
│   │   │   │   ├── Scholarships.tsx # Browse all scholarships
│   │   │   │   ├── MatchedScholarships.tsx # Matched to profile
│   │   │   │   ├── Applications.tsx # Track applications
│   │   │   │   └── Profile.tsx      # View/edit profile
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── ManageStudents.tsx
│   │   │       └── ManageScholarships.tsx
│   │   ├── services/
│   │   │   ├── api.ts               # Axios base config + interceptors
│   │   │   ├── auth.service.ts      # Auth API calls
│   │   │   ├── profile.service.ts   # Profile API calls
│   │   │   ├── scholarship.service.ts
│   │   │   ├── application.service.ts
│   │   │   └── admin.service.ts
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces
│   │   └── main.tsx                 # App entry point
│   ├── .env                         # Frontend env variables
│   └── package.json
│
└── server/                          # Node.js backend
    ├── config/
    │   ├── db.js                    # MongoDB connection
    │   └── email.config.js          # Nodemailer config
    ├── models/
    │   ├── studentModels/
    │   │   ├── studentAuth.model.js
    │   │   └── studentProfile.model.js
    │   ├── adminModels/
    │   │   └── admin.model.js
    │   ├── sponsorsModels/
    │   │   └── scholarship.model.js
    │   └── applicationModels/
    │       └── scholarshipApplication.models.js
    ├── controllers/
    │   ├── studentsController/
    │   │   ├── studentAuth.controller.js
    │   │   └── studentProfile.controller.js
    │   ├── adminControllers/
    │   │   └── admin.controller.js
    │   └── scholarshipControllers/
    │       └── scholarship.controller.js
    ├── routers/
    │   ├── studentRouters/
    │   │   ├── studentAuth.router.js
    │   │   └── studentProfile.router.js
    │   ├── adminRouters/
    │   │   └── admin.route.js
    │   ├── scholarshipRouters/
    │   │   └── scholarship.router.js
    │   └── applicationRouters/
    │       └── application.router.js
    ├── middleware/
    │   └── auth.middleware.js        # JWT verification
    ├── services/
    │   ├── notification.service.js  # Deadline check logic
    │   └── cron.service.js          # Scheduled tasks
    ├── scrapers/
    │   ├── helb.scraper.js
    │   ├── hef.scraper.js
    │   ├── equity.scraper.js
    │   ├── ngcdf.scraper.js
    │   └── index.scraper.js
    ├── utils/
    │   ├── email.utils.js           # Email templates
    │   ├── gpaUtils.js              # GPA comparison helpers
    │   └── mti.utils.js             # MTI band calculation
    ├── scripts/
    │   ├── seedAdmin.js             # Create first admin
    │   └── runScrapers.js           # Manual scraper trigger
    ├── .env                         # Backend env variables
    └── server.js                    # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier works)
- Gmail account with App Password enabled

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/UniSaveSaccoSystem.git
cd UniSaveSaccoSystem
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in the server folder:

```bash
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/unisave
JWT_SECRET=your_super_secret_jwt_key_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_character_app_password
EMAIL_FROM=UniSave Sacco <your_gmail@gmail.com>
FRONTEND_URL=http://localhost:5173
PORT=5000
```

Seed the first admin account:

```bash
node scripts/seedAdmin.js
```

Start the server:

```bash
node server.js
```

The server runs at `http://localhost:5000`

### 3. Setup the Frontend

```bash
cd ../client
npm install
```

Create a `.env` file in the client folder:

```bash
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app runs at `http://localhost:5173`

### 4. Run the Scrapers (Optional)

Populate the database with scholarship data:

```bash
cd server
node scripts/runScrapers.js
```

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `unisave_secret_key` |
| `EMAIL_USER` | Gmail address for sending emails | `app@gmail.com` |
| `EMAIL_PASS` | Gmail App Password (16 chars) | `xxxx xxxx xxxx xxxx` |
| `EMAIL_FROM` | Display name for emails | `UniSave Sacco <app@gmail.com>` |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `https://your-app.vercel.app` |
| `PORT` | Server port | `5000` |

### Frontend (`client/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `https://your-app.onrender.com/api` |

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/students/auth/register` | None | Register a new student |
| POST | `/api/students/auth/login` | None | Student login |
| POST | `/api/students/auth/logout` | Student | Student logout |
| POST | `/api/admin/login` | None | Admin login |

### Student Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/students/profile/create` | Student | Create student profile |
| GET | `/api/students/profile/me` | Student | Get own profile |
| PATCH | `/api/students/profile/update` | Student | Update own profile |

### Scholarships

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/students/scholarships` | None | Get all active scholarships |
| GET | `/api/students/scholarships/match` | Student | Get matched scholarships |
| GET | `/api/students/scholarships/:id` | Student | Get single scholarship |
| POST | `/api/admin/scholarships/add` | Admin | Add new scholarship |
| GET | `/api/admin/scholarships/all` | Admin | Get all scholarships |
| PATCH | `/api/admin/scholarships/update/:id` | Admin | Update scholarship |
| PATCH | `/api/admin/scholarships/verify/:id` | Admin | Verify scholarship |
| DELETE | `/api/admin/scholarships/delete/:id` | Admin | Delete scholarship |

### Applications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/students/applications/save` | Student | Save a scholarship |
| POST | `/api/students/applications/apply` | Student | Apply for a scholarship |
| GET | `/api/students/applications/me` | Student | Get my applications |
| PATCH | `/api/students/applications/update/:id` | Student | Update application status |
| DELETE | `/api/students/applications/delete/:id` | Student | Remove saved scholarship |
| GET | `/api/admin/applications/all` | Admin | Get all applications |
| PATCH | `/api/admin/applications/update/:id` | Admin | Approve or reject application |

### Admin — Student Management

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/students/all` | Admin | Get all students |
| GET | `/api/admin/students/pending` | Admin | Get pending students |
| PATCH | `/api/admin/students/:id/approve` | Admin | Approve student |
| PATCH | `/api/admin/students/:id/reject` | Admin | Reject student |
| POST | `/api/admin/create` | Superadmin | Create new admin |

---

## Matching Algorithm

The matching algorithm compares a student's profile against each scholarship's eligibility criteria across 10 dimensions:

```
Student Profile Field    →    Scholarship Eligibility Field
─────────────────────────────────────────────────────────
MTI_Score               →    mtiScoreMin / mtiScoreMax
MTI_Band                →    mtiBand
gpa                     →    minGPA
yearOfStudy             →    yearOfStudy[]
course                  →    courseOfStudy[]
university              →    university[]
county                  →    county
gender                  →    gender
age                     →    ageMin / ageMax
disability              →    disability
```

A scholarship is returned as a match only when the student meets **all** criteria. Fields set to `"All"` or `null` in the scholarship are treated as open to everyone.

---

## Deployment

### Backend — Render

1. Push your server code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repository
4. Set the following:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Add all variables from the Backend `.env` table above
5. Deploy

### Frontend — Vercel

1. Push your client code to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Set the **Root Directory** to `client`
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL + `/api`
5. Deploy

### Post-Deployment Checklist

```
✅ Add Vercel URL to FRONTEND_URL in Render env variables
✅ Add MongoDB Atlas IP whitelist → Allow All (0.0.0.0/0)
✅ Run seedAdmin.js to create first admin on production DB
✅ Run runScrapers.js to populate initial scholarship data
✅ Test admin login on deployed URL
✅ Test student registration and approval flow
```

---

## Database Schema Overview

```
student_auth          student_profile        scholarship
────────────          ───────────────        ───────────
nationalId            studentAuthId ──┐      title
email                 nationalId      │      provider
password              firstName       │      category
accountStatus         lastName        │      eligibility{}
                      surName         │      funding{}
                      gender          │      dates{}
                      age             │      application{}
                      university      │      isVerified
                      course          │      isActive
                      yearOfStudy     │      source
                      gpa             │
                      MTI_Score       │      application
                      MTI_Band        │      ───────────
                      county          └──→   studentId ──→ student_profile
                      constituency          scholarshipId ─→ scholarship
                      phoneNumber           status
                                            appliedAt
                                            notes
```

---

## Author

**Chrispine Wameyo Ojow**
Diploma in Information Technology
Technical University of Kenya
Registration No: SCCF/08074P/2023

Supervised by:
- Mr. Peter Maina Ngugi
- Madam Pamela Chebii

School of Computing and Information Technology
Technical University of Kenya
Submission: June 2026

---

## License

This project is submitted as a final year diploma project at the Technical University of Kenya. All rights reserved © 2026 Chrispine Wameyo Ojow.