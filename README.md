# 🎓 MeritMind – AI-Powered Scholarship Eligibility & Recommendation Platform

> **Find. Match. Apply. Track.**
>
> MeritMind is an intelligent scholarship discovery platform that automatically aggregates scholarships from **official sources**, evaluates a student's eligibility, ranks opportunities using a personalized recommendation engine, and redirects students to the **official provider website** to apply.

🌐 **Live Website:** https://merit-mind-scholarship-eligibility.vercel.app/

🌐 **Backend API:** https://meritmind-backend.onrender.com

---

# 🚀 Overview

Every year thousands of students miss scholarships because information is scattered across government portals, universities, CSR foundations and private organizations.

MeritMind solves this by becoming a **single intelligent scholarship advisor**.

Instead of searching dozens of websites, students create one profile and MeritMind automatically:

- Collects scholarships from trusted official sources
- Matches scholarships to the student's profile
- Explains why each scholarship matches
- Shows missing eligibility requirements
- Redirects students to the official application portal
- Tracks application progress after applying

> **MeritMind never accepts scholarship applications.**
>
> Every "Apply Now" button opens the **official scholarship provider website**.

---

# ✨ Features

## 🎯 Personalized Scholarship Recommendations

- AI-inspired eligibility scoring
- Match percentage (0–100%)
- Strong / Moderate / Low Match
- Missing requirement detection
- Deadline prioritization
- Recommendation explanations

---

## 🔍 Scholarship Explorer

- Global Search
- Advanced Filters
- Government / Private
- Category
- State
- Branch
- Gender
- Income Limit
- CGPA
- Education Level
- Provider
- Scholarship Amount
- Deadline
- Sorting

---

## 🤖 Automatic Scholarship Collection

MeritMind automatically collects scholarships from verified official sources.

Supported collectors include:

- National Scholarship Portal (NSP)
- AICTE
- UGC
- State Government Scholarship Portals
- Universities
- Corporate CSR Programs
- Philanthropic Foundations

The collection engine automatically:

- Normalizes data
- Removes duplicates
- Updates existing scholarships
- Marks expired scholarships inactive

---

## 👤 Student Profile

Complete student profile including

- Personal Information
- Address
- Academic Details
- Education Level
- College
- Branch
- CGPA
- Income
- Category
- Minority Status
- Disability Status
- Achievements
- Certifications
- Skills
- Projects
- Hackathons

Recommendations automatically update whenever the profile changes.

---

## 📂 Secure Document Vault

Students can securely store:

- Aadhaar
- Income Certificate
- Bonafide Certificate
- Caste Certificate
- Disability Certificate
- Resume

Documents are stored only for convenience.

**MeritMind never uploads these documents to scholarship providers.**

---

## 📌 Saved Scholarships

- Bookmark scholarships
- View saved opportunities
- Remove bookmarks

---

## 📊 Application Tracker

Track every scholarship after applying.

Application stages include:

- Saved
- Applying
- Applied
- Under Review
- Documents Submitted
- Interview Scheduled
- Selected
- Rejected
- Offer Accepted

---

## 🔔 Smart Notifications

Receive reminders for

- Upcoming deadlines
- Recommendation updates
- Saved scholarships
- Profile completion

---

## 🤖 AI Scholarship Advisor

Interactive AI assistant capable of answering

- Am I eligible?
- Why is my match score low?
- Which scholarship should I apply first?
- Which documents are required?
- What should I improve?

---

# 🛡 Trusted Sources Only

MeritMind only indexes scholarships from **official and verified organizations**.

Examples include:

- National Scholarship Portal
- AICTE
- UGC
- Government Departments
- Universities
- Corporate CSR Programs
- Registered Foundations

Fraudulent or unverified scholarship websites are intentionally excluded.

---

# 🏗 Architecture

```
Student
      │
      ▼
Frontend (React + TanStack Start)
      │
REST APIs
      │
      ▼
FastAPI Backend
      │
Recommendation Engine
      │
Automatic Scholarship Collectors
      │
SQLite / MySQL
```

---

# 🛠 Tech Stack

## Frontend

- React 19
- TanStack Start
- TanStack Router
- React Query
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide Icons
- Recharts
- Vite

---

## Backend

- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- JWT Authentication
- Bcrypt

---

## Database

- SQLite (Deployment Fallback)
- MySQL (Primary Development Database)

---

## Deployment

Frontend

- Vercel

Backend

- Render

---

# 📂 Project Structure

```
MeritMind
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── collectors
│   │   ├── models
│   │   ├── schemas
│   │   ├── database
│   │   └── core
│   │
│   └── requirements.txt
│
├── src
│   ├── components
│   ├── routes
│   ├── services
│   ├── contexts
│   ├── features
│   └── assets
│
├── public
├── package.json
└── README.md
```

---

# 🔄 Automatic Scholarship Pipeline

```
Official Sources

↓

Collectors

↓

Validation

↓

Data Cleaning

↓

Deduplication

↓

Database Update

↓

Recommendation Engine

↓

Student Dashboard
```

---

# 🚀 Local Installation

## Clone Repository

```bash
git clone https://github.com/Niharika1495/MeritMind--Scholarship-Eligibility-Recommendation-Platform.git

cd MeritMind
```

---

## Frontend

```bash
npm install

npm run dev
```

---

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

# Environment Variables

## Frontend

```
VITE_API_URL=http://127.0.0.1:8000
```

Production

```
VITE_API_URL=https://meritmind-backend.onrender.com
```

---

## Backend

```
JWT_SECRET=your_secret

MYSQL_HOST=localhost

MYSQL_PORT=3306

MYSQL_USER=root

MYSQL_PASSWORD=

MYSQL_DB=meritmind
```

---

# API Modules

- Authentication
- Student Profile
- Scholarships
- Recommendation Engine
- Saved Scholarships
- Application Tracker
- Notifications
- Document Vault
- AI Advisor

Interactive API documentation is available at:

```
/api/docs
```

---

# Current Capabilities

- Automatic scholarship aggregation
- Personalized recommendations
- Eligibility prediction
- Match scoring
- Recommendation explanations
- Official application redirects
- Saved scholarships
- Document vault
- Application tracking
- Notification system
- AI scholarship advisor

---

# Future Enhancements

- OCR-based document verification
- Email notifications
- SMS reminders
- ML-powered recommendation model
- Multi-language support
- Mobile application
- Real-time scholarship updates
- Predictive scholarship success analysis

---

# License

This project is licensed under the **MIT License**.

---

# Author

**Idamakanti Niharika**

B.Tech Computer Science & Engineering

VIT Bhimavaram

---

## ⭐ If you found this project useful, consider giving the repository a Star on GitHub!
