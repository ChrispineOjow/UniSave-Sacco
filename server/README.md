# UniSave Sacco — Backend API

> Node.js + Express REST API for the UniSave Sacco scholarship discovery platform.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Matching Algorithm](#matching-algorithm)
- [Email Notifications](#email-notifications)
- [Web Scrapers](#web-scrapers)
- [Cron Jobs](#cron-jobs)
- [Scripts](#scripts)

---

## Overview

The UniSave Sacco backend is a RESTful API built with Node.js and Express.js. It handles:

- Student and admin authentication using JWT
- Student profile management with MTI score and GPA tracking
- Scholarship CRUD operations with admin verification workflow
- Intelligent scholarship matching based on student profile
- Application tracking across five status stages
- Automated email notifications for deadline reminders
- Weekly web scraping from HELB, HEF, Equity Foundation, and NG-CDF

---

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | 5.x | Web framework |
| Mongoose | 8.x | MongoDB ODM |
| jsonwebtoken | 9.x | JWT authentication |
| bcrypt | 5.x | Password hashing |
| nodemailer | 6.x | Email delivery |
| node-cron | 3.x | Task scheduling |
| cheerio | 1.x | Static HTML scraping |
| puppeteer | 22.x | JS-rendered page scraping |
| axios | 1.x | HTTP requests for scrapers |
| cors | 2.x | Cross-origin resource sharing |
| dotenv | 16.x | Environment variables |

---

## Folder Structure

```
server/
├── config/
│   ├── db.js                        # MongoDB Atlas connection
│   └── email.config.js              # Nodemailer transporter setup
│
├── models/
│   ├── studentModels/
│   │   ├── studentAuth.model.js     # Auth credentials + account status
│   │   └── studentProfile.model.js  # Academic profile + MTI data
│   ├── adminModels/
│   │   └── admin.model.js           # Admin accounts with roles
│   ├── sponsorsModels/
│   │   └── scholarship.model.js     # Scholarship data + eligibility
│   └── applicationModels/
│       └── scholarshipApplication.models.js  # Student applications
│
├── controllers/
│   ├── studentsController/
│   │   ├── studentAuth.controller.js    # Register, login, logout
│   │   └── studentProfile.controller.js # Create, get, update profile
│   ├── adminControllers/
│   │   └── admin.controller.js          # All admin operations
│   └── scholarshipControllers/
│       └── scholarship.controller.js    # Student-facing scholarship ops
│
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
│
├── middleware/
│   └── auth.middleware.js            # protectStudent + protectAdmin
│
├── services/
│   ├── notification.service.js       # Deadline check and email logic
│   └── cron.service.js               # Scheduled cron job definitions
│
├── scrapers/
│   ├── helb.scraper.js               # HELB loans and bursaries
│   ├── hef.scraper.js                # HEF government scholarships
│   ├── equity.scraper.js             # Equity Wings to Fly
│   ├── ngcdf.scraper.js              # NG-CDF county bursaries
│   └── index.scraper.js              # Runs all scrapers together
│
├── utils/
│   ├── email.utils.js                # Email HTML templates
│   ├── gpaUtils.js                   # GPA comparison function
│   └── mti.utils.js                  # MTI score to band conversion
│
├── scripts/
│   ├── seedAdmin.js                  # Creates first superadmin
│   └── runScrapers.js                # Manually trigger all scrapers
│
├── .env                              # Environment variables
├── .env.example                      # Environment variable template
└── server.js                         # Express app entry point
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas cluster (free tier is fine)
- Gmail account with 2FA and App Password enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/UniSaveSaccoSystem.git

# Navigate to the server folder
cd UniSaveSaccoSystem/server

# Install dependencies
npm install
```

### Setup

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your actual values
nano .env

# Seed the first admin account
node scripts/seedAdmin.js

# Start the server
node server.js
```

The server will start at `http://localhost:5000`

You should see:
```
✅ MongoDB connected successfully
✅ Email service ready
✅ Cron jobs started
✅ Server is running on localhost:5000
```

---

## Environment Variables

Create a `.env` file in the server root with these variables:

```bash
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/unisave?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=xxxx_xxxx_xxxx_xxxx
EMAIL_FROM=UniSave Sacco <your_email@gmail.com>

# CORS
FRONTEND_URL=http://localhost:5173

# Server
PORT=5000
```

### Getting a Gmail App Password

```
1. Go to myaccount.google.com
2. Security → 2-Step Verification → Enable
3. Security → App Passwords
4. App name: UniSave → Create
5. Copy the 16-character password
6. Paste into EMAIL_PASS (no spaces)
```

---

## API Endpoints

### Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://your-app.onrender.com/api`

---

### Auth — Students

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/students/auth/register` | None | Register with nationalId, email, password |
| POST | `/students/auth/login` | None | Login — returns JWT token |
| POST | `/students/auth/logout` | Student Token | Logout |

**Register Request Body:**
```json
{
    "nationalId": "12345678",
    "email": "student@university.ac.ke",
    "password": "SecurePass123"
}
```

**Login Response:**
```json
{
    "message": "Login Successful",
    "token": "eyJhbGci...",
    "student": {
        "id": "...",
        "email": "student@university.ac.ke",
        "accountStatus": "approved",
        "hasProfile": true,
        "profile": { ... }
    }
}
```

---

### Student Profile

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/students/profile/create` | Student Token | Create academic profile |
| GET | `/students/profile/me` | Student Token | Get own profile |
| PATCH | `/students/profile/update` | Student Token | Update own profile |

**Create Profile Request Body:**
```json
{
    "studentAuthId": "...",
    "firstName": "Chrispine",
    "lastName": "Wameyo",
    "surName": "Ojow",
    "gender": "Male",
    "age": 21,
    "university": "Technical University of Kenya",
    "course": "Diploma in Information Technology",
    "yearOfStudy": 3,
    "schoolRegistrationNumber": "SCCF/08074P/2023",
    "gpa": 3.5,
    "county": "Nairobi",
    "constituency": "Westlands",
    "disability": false,
    "MTI_Score": 45,
    "phoneNumber": "+254712345678"
}
```

> Note: `MTI_Band` is auto-calculated from `MTI_Score` via a pre-save hook — do not send it manually.

---

### Scholarships — Student

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/students/scholarships` | None | Get all active verified scholarships |
| GET | `/students/scholarships/match` | Student Token | Get scholarships matched to profile |
| GET | `/students/scholarships/:id` | Student Token | Get single scholarship |

**Query Parameters for GET `/students/scholarships`:**
```
?category=Government
?fundingType=Bursary
?county=Nairobi
?search=HELB
```

---

### Applications

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/students/applications/save` | Student Token | Bookmark a scholarship |
| POST | `/students/applications/apply` | Student Token | Mark as applied |
| GET | `/students/applications/me` | Student Token | Get all my applications |
| PATCH | `/students/applications/update/:id` | Student Token | Update to Applied or Pending |
| DELETE | `/students/applications/delete/:id` | Student Token | Remove saved scholarship |

**Application Status Flow:**
```
Saved → Applied → Pending → Approved / Rejected
```

Students can update to `Applied` or `Pending`. Only admins can set `Approved` or `Rejected`.

---

### Admin — Auth

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/admin/login` | None | Admin login |
| POST | `/admin/create` | Superadmin Token | Create new admin account |

---

### Admin — Students

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/admin/students/all` | Admin Token | Get all students |
| GET | `/admin/students/pending` | Admin Token | Get pending students |
| PATCH | `/admin/students/:id/approve` | Admin Token | Approve student account |
| PATCH | `/admin/students/:id/reject` | Admin Token | Reject student account |

---

### Admin — Scholarships

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/admin/scholarships/add` | Admin Token | Add new scholarship |
| GET | `/admin/scholarships/all` | Admin Token | Get all scholarships (including unverified) |
| PATCH | `/admin/scholarships/update/:id` | Admin Token | Update scholarship details |
| PATCH | `/admin/scholarships/verify/:id` | Admin Token | Mark scholarship as verified |
| DELETE | `/admin/scholarships/delete/:id` | Admin Token | Delete scholarship |

---

### Admin — Applications

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/admin/applications/all` | Admin Token | Get all applications |
| PATCH | `/admin/applications/update/:id` | Admin Token | Set to Approved or Rejected |

---

## Database Models

### `student_auth`
```javascript
{
    nationalId: String,        // 8-digit Kenyan National ID
    email: String,
    password: String,          // bcrypt hashed
    accountStatus: enum[       // pending → approved → rejected
        'pending',
        'approved',
        'rejected'
    ]
}
```

### `student_profile`
```javascript
{
    studentAuthId: ObjectId,   // ref → student_auth
    nationalId: String,        // synced from auth
    email: String,             // synced from auth
    firstName: String,
    lastName: String,
    surName: String,
    gender: enum['Male', 'Female'],
    age: Number,
    university: String,
    course: String,
    yearOfStudy: enum[1,2,3,4,5,6],
    schoolRegistrationNumber: String,
    gpa: Number,               // 0.0 – 4.0
    county: String,
    constituency: String,
    disability: Boolean,
    MTI_Score: Number,         // 0 – 100
    MTI_Band: enum[            // auto-calculated from MTI_Score
        'Vulnerable',
        'Extremely Needy',
        'Needy',
        'Less Needy'
    ],
    phoneNumber: String
}
```

### `scholarship`
```javascript
{
    title: String,
    provider: String,
    category: enum['Government','NGO','County','University','Corporate'],
    description: String,
    link: String,
    eligibility: {
        mtiBand: String,
        mtiScoreMin: Number,
        mtiScoreMax: Number,
        minGPA: Number | null,
        yearOfStudy: [Number],
        courseOfStudy: [String],
        university: [String],
        county: String,
        gender: String,
        ageMin: Number,
        ageMax: Number,
        disability: Boolean | null
    },
    funding: {
        amount: Number,
        amountDisplay: String,
        fundingType: enum['Full','Partial','Loan','Bursary','Grant'],
        coversTuition: Boolean,
        coversUpkeep: Boolean,
        coversMaterials: Boolean,
        renewable: Boolean
    },
    dates: {
        openingDate: Date,
        deadline: Date,
        announcementDate: Date,
        academicYear: String
    },
    application: {
        method: enum['Online','Physical','Both'],
        documentsRequired: [String],
        hasDirectApply: Boolean,
        applicationSteps: String
    },
    source: enum['Scraped','Manual','API','Self-Registered'],
    isVerified: Boolean,
    isActive: Boolean,
    isFeatured: Boolean,
    lastScrapedAt: Date
}
```

### `application`
```javascript
{
    studentId: ObjectId,       // ref → student_profile
    scholarshipId: ObjectId,   // ref → scholarship
    status: enum[
        'Saved',
        'Applied',
        'Pending',
        'Approved',
        'Rejected'
    ],
    appliedAt: Date | null,
    notes: String
}
```

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### How It Works

```
1. Student/Admin sends credentials to login endpoint
2. Server verifies credentials and signs a JWT with user ID and role
3. Client stores the JWT (localStorage)
4. Client sends JWT in Authorization header on every protected request
5. Middleware verifies the JWT before allowing access
```

### Token Usage

```bash
# Include in every protected request
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiry
- Student tokens: 7 days
- Admin tokens: 1 day

---

## Matching Algorithm

Located in `controllers/scholarshipControllers/scholarship.controller.js`

The `getMatchedScholarships` function:

1. Fetches the student's complete profile
2. Queries all active, verified scholarships
3. Filters scholarships by running 10 eligibility checks:

```javascript
const meetsMTI      = profile.MTI_Score >= e.mtiScoreMin && 
                      profile.MTI_Score <= e.mtiScoreMax;
const meetsMTIBand  = e.mtiBand === 'All' || e.mtiBand === profile.MTI_Band;
const meetsGPA      = !e.minGPA || profile.gpa >= e.minGPA;
const meetsYear     = e.yearOfStudy.includes(profile.yearOfStudy);
const meetsCourse   = e.courseOfStudy.includes('All') || 
                      e.courseOfStudy.includes(profile.course);
const meetsUni      = e.university.includes('All') || 
                      e.university.includes(profile.university);
const meetsCounty   = e.county === 'All' || e.county === profile.county;
const meetsGender   = e.gender === 'All' || e.gender === profile.gender;
const meetsAge      = profile.age >= e.ageMin && profile.age <= e.ageMax;
const meetsDisab    = e.disability === null || 
                      e.disability === profile.disability;
```

### MTI Band Calculation

```javascript
// utils/mti.utils.js
MTI Score 0–25   → 'Vulnerable'
MTI Score 26–50  → 'Extremely Needy'
MTI Score 51–75  → 'Needy'
MTI Score 76–100 → 'Less Needy'
```

---

## Email Notifications

Located in `utils/email.utils.js` and `services/notification.service.js`

### Welcome Email
Sent automatically when an admin approves a student account.

### Deadline Reminder Email
Sent to students who have saved or applied for scholarships with deadlines within the next 7 days.

**The notification service:**
1. Queries scholarships with `dates.deadline` between now and 7 days from now
2. Finds all applications for those scholarships with status `Saved`, `Applied`, or `Pending`
3. Fetches each student's email from their auth record
4. Sends a formatted HTML email with scholarship details and direct apply link

---

## Web Scrapers

Located in the `scrapers/` folder.

| Scraper | Method | Target | Fallback |
|---|---|---|---|
| `helb.scraper.js` | Cheerio (static) | helb.co.ke | Manual entry |
| `hef.scraper.js` | Puppeteer (JS) | hef.co.ke | Manual entry |
| `equity.scraper.js` | Cheerio (static) | equitygroupfoundation.com | Manual entry |
| `ngcdf.scraper.js` | Manual entries | ngcdf.go.ke | N/A |

All scrapers use **upsert** operations — running them multiple times will not create duplicates. Each scraper matches on `{ title, provider }` to update existing records or insert new ones.

---

## Cron Jobs

Located in `services/cron.service.js`

| Job | Schedule | Action |
|---|---|---|
| Deadline Check | Every day at 8:00 AM | Emails students about upcoming deadlines |
| Scholarship Scrape | Every Monday at 6:00 AM | Runs all scrapers to refresh scholarship data |

**Cron Syntax Reference:**
```
┌─── minute (0–59)
│ ┌─── hour (0–23)
│ │ ┌─── day of month (1–31)
│ │ │ ┌─── month (1–12)
│ │ │ │ ┌─── day of week (0–7)
│ │ │ │ │
0 8 * * *     → Every day at 8:00 AM
0 6 * * 1     → Every Monday at 6:00 AM
* * * * *     → Every minute (testing only)
```

---

## Scripts

### `scripts/seedAdmin.js`
Creates the first superadmin account. Run once during initial setup.

```bash
node scripts/seedAdmin.js
```

Default credentials (change immediately after setup):
```
Email:    admin@unisave.co.ke
Password: Admin@1234
Role:     superadmin
```

### `scripts/runScrapers.js`
Manually triggers all scrapers. Useful for initial data population or when testing.

```bash
node scripts/runScrapers.js
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
    "message": "Human-readable error description",
    "error": "Technical error message (development only)"
}
```

### HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (validation failed) |
| 401 | Unauthorized (no or invalid token) |
| 403 | Forbidden (wrong role or account not approved) |
| 404 | Resource not found |
| 500 | Internal server error |