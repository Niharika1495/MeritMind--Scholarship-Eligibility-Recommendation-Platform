# 🎓 MeritMind – Scholarship Eligibility & Recommendation Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

# 📖 About MeritMind

**MeritMind** is an AI-powered Scholarship Eligibility & Recommendation Platform designed to help students across India discover scholarships they are actually eligible for.

Unlike traditional scholarship portals that simply list opportunities, MeritMind automatically collects verified scholarships from trusted official sources, intelligently matches them against each student's profile, explains eligibility, and redirects students to the official scholarship provider for application.

MeritMind **does not accept scholarship applications**. Students always apply on the official scholarship provider's website while MeritMind tracks their application progress and provides reminders.

---

# 🚀 Key Features

## 🎯 Intelligent Scholarship Matching

- Personalized scholarship recommendations
- Eligibility verification
- Match percentage calculation
- Recommendation priority
- Missing eligibility explanation
- Deadline priority

---

## 👤 Student Profile

- Secure Registration & Login
- JWT Authentication
- Multi-step Profile Setup
- Academic Information
- Financial Information
- Category Details
- Achievements
- Skills
- Profile Completion Tracking

---

## 🔍 Scholarship Explorer

- Global Search
- Advanced Filters
- Sorting
- Infinite Scroll
- Pagination
- Scholarship Details
- Official Apply Links

---

## 🤖 AI Scholarship Advisor

- AI-powered guidance
- Profile improvement suggestions
- Scholarship explanations
- Natural language interaction
- Database-grounded responses (no hallucinations)

---

## 📄 Secure Document Vault

Students can securely store:

- Aadhaar
- Income Certificate
- Bonafide Certificate
- Caste Certificate
- Disability Certificate
- Resume

> **Note:** MeritMind stores these documents only for student convenience. Documents are **never submitted** to scholarship providers.

---

## 📊 Application Tracking

Track scholarship applications with statuses such as:

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

- Deadline reminders
- Recommendation updates
- Profile completion reminders
- Application tracking updates

---

## 🌐 Automatic Scholarship Collection

MeritMind automatically collects scholarships from trusted official sources including:

- National Scholarship Portal (NSP)
- AICTE
- UGC
- State Government Scholarship Portals
- Official University Scholarship Portals
- Foundation Scholarships
- CSR Scholarships

The platform automatically:

- Collects scholarships
- Cleans data
- Removes duplicates
- Updates existing scholarships
- Marks expired scholarships inactive

---

# 🏗️ System Architecture

```text
Official Scholarship Providers
             │
             ▼
Automatic Collection Engine
             │
             ▼
Data Cleaning & Normalization
             │
             ▼
MySQL Database
             │
             ▼
Recommendation Engine
             │
             ▼
Student Dashboard
             │
             ▼
Official Scholarship Website
             │
             ▼
Application Tracking
```

---

# 💻 Tech Stack

## Frontend

- React 19
- Vite
- TypeScript
- TanStack Router
- TanStack Query
- Tailwind CSS
- Radix UI
- React Hook Form
- Zod

---

## Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- Alembic
- JWT Authentication

---

## Database

- MySQL

---

## AI

- Google Gemini API

---

# 📂 Project Structure

```text
MeritMind
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── collectors/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│
├── src/
│   ├── components/
│   ├── contexts/
│   ├── routes/
│   ├── services/
│   └── features/
│
├── public/
├── README.md
└── package.json
```

---

# 🔄 Workflow

```text
Landing Page

↓

Register

↓

Login

↓

Complete Profile

↓

Recommendation Engine

↓

Personalized Scholarships

↓

Apply on Official Website

↓

Track Application

↓

Receive Notifications
```

---

# 🎯 Recommendation Engine

MeritMind evaluates:

- Education Level
- Course / Branch
- Category
- Gender
- State
- Family Income
- CGPA / Percentage
- Disability Status
- Minority Status

Only eligible scholarships are recommended.

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Protected APIs
- Input Validation
- Secure File Uploads
- SQL Injection Protection

---

# ⚡ Getting Started

## Clone Repository

```bash
git clone https://github.com/Niharika1495/MeritMind--Scholarship-Eligibility-Recommendation-Platform.git
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

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

# 🌟 Future Enhancements

- Email Notifications
- OCR-based Document Verification
- Mobile Application
- Analytics Dashboard
- Multi-language Support
- Scholarship Success Prediction
- AI Interview Preparation

---

# 🎓 Project Highlights

✔ Automatic Scholarship Collection

✔ Personalized Recommendation Engine

✔ AI Scholarship Advisor

✔ Official Website Redirection

✔ Secure Document Vault

✔ Application Tracking

✔ Smart Notifications

✔ Responsive UI

✔ Full Stack Architecture

---

# 📜 License

This project is licensed under the MIT License.

---

# 👩‍💻 Developed By

**Idamakanti Niharika**

B.Tech – Computer Science & Engineering

VIT Bhimavaram

---

## ⭐ If you found this project useful, consider giving it a Star!
