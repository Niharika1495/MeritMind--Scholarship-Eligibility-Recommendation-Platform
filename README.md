# UniGrant Guide

This is the Project Overview you should give to Lovable before any feature prompts. It explains the vision, workflow, and scope so Lovable understands what you're building instead of treating it as a generic scholarship website.

MeritMind – Intelligent Scholarship Discovery & Recommendation Platform

Project Overview

MeritMind is an intelligent scholarship discovery and recommendation platform designed to help students find the most relevant scholarships from official sources without manually searching multiple websites.

Unlike traditional scholarship portals that simply list scholarships, MeritMind automatically collects scholarship information from official scholarship websites, maintains an up-to-date scholarship database, analyzes each student's academic, financial, and personal profile, and recommends the scholarships that best match the student's eligibility and overall profile.

The platform acts as a personal scholarship advisor by continuously monitoring scholarship updates and presenting students with the most relevant opportunities.

The primary goal of MeritMind is to reduce the time students spend searching for scholarships while increasing their chances of finding suitable opportunities.

Problem Statement

Students often face several challenges while applying for scholarships:

Scholarship information is scattered across multiple official websites.

Eligibility criteria differ across providers.

Deadlines change frequently.

Students are unaware of scholarships they are eligible for.

New scholarships are announced regularly and often go unnoticed.

Students spend hours comparing eligibility requirements manually.

MeritMind solves these problems by centralizing scholarship information and intelligently matching students with suitable scholarships.

Core Idea

The platform should not behave like a simple scholarship listing website.

Instead, it should function as a personalized scholarship recommendation system.

Every student should see a completely personalized experience based on their profile.

No two dashboards should look exactly the same because recommendations depend on the student's information.

How the Platform Works

Step 1

The system automatically collects scholarship information from official scholarship websites through a web scraping service.

Examples:

National Scholarship Portal

AICTE

Reliance Foundation

HDFC

Tata Capital

ONGC

Other verified scholarship providers

This process runs periodically to keep scholarship information updated.

Step 2

The scraped scholarship information is cleaned, validated, and stored in the database.

Each scholarship contains information such as

Scholarship Name

Provider

Scholarship Amount

Application Deadline

Minimum CGPA

Maximum Family Income

Eligible Branches

Eligible Categories

Eligible States

Required Documents

Official Application Link

Step 3

A student registers and creates a profile.

The profile contains

Personal Details

Name

Gender

State

Category

Academic Details

College

Branch

Current Year

CGPA

Financial Details

Annual Family Income

Achievements

Skills

Certifications

Internships

Projects

Hackathons

Research Papers

The student should be able to update this information at any time.

Step 4

When the student visits the dashboard, the platform compares the student's profile against all available scholarships.

The recommendation engine evaluates multiple criteria such as

Academic eligibility

Financial eligibility

Branch eligibility

Category eligibility

State eligibility

The system then calculates a compatibility score for every scholarship.

Step 5

Instead of showing every scholarship, the platform displays only the most relevant opportunities ranked by compatibility.

Each scholarship card displays

Match Percentage

Scholarship Amount

Deadline

Eligibility Summary

Why this scholarship matches the student

Apply button

Save button

The Apply button redirects the student to the official scholarship website.

Step 6

Students can

Save scholarships

View saved scholarships

Track application deadlines

Receive notifications when new matching scholarships become available

Receive reminders before deadlines

Step 7 (Future Enhancement)

The platform will include a Machine Learning module that predicts a student's Scholarship Readiness Score based on academic performance, extracurricular achievements, certifications, internships, and overall profile strength.

This score will help students understand how competitive their profile is and what improvements they can make.

Design Philosophy

MeritMind should not look like a traditional admin dashboard.

It should feel like a premium consumer product similar to Spotify, Duolingo, or Airbnb.

The experience should be

Personalized

Minimal

Interactive

Modern

Friendly

Motivating

The interface should guide students through their scholarship journey rather than overwhelming them with tables and forms.

The homepage should immediately answer:

What scholarships should I apply for today?

What deadlines are approaching?

How strong is my profile?

What should I improve?

Which scholarships are newly available?

Target Users

Undergraduate Students

Postgraduate Students

Diploma Students

Engineering Students

Medical Students

Arts & Science Students

Students searching for government or private scholarships

Future Scope

The platform architecture should be modular so future features can be added easily.

Possible future enhancements include

AI-powered scholarship assistant

OCR document verification

Scholarship application tracking

Email notifications

Mobile application

Admin dashboard

Analytics dashboard

University-specific scholarship recommendations

International scholarship support

Important Development Guidelines

Build reusable and modular components.

Keep the UI highly responsive and accessible.

Do not hardcode scholarship information; use mock data placeholders that can later be replaced with API responses.

Organize the project with scalability in mind.

Separate presentation, business logic, and API integration layers.

Ensure the architecture can later integrate FastAPI, MySQL, web scraping services, and machine learning without major restructuring.

Final Instruction to Lovable

Build MeritMind as a premium product, not as a typical CRUD dashboard. The experience should feel like a personal scholarship coach that proactively discovers opportunities, recommends the best matches, tracks deadlines, and guides students throughout their scholarship journey with a modern, visually engaging interface.
understand it dont generte anything

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/da3fe865-3795-41e5-9857-8a547e41fd8f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
