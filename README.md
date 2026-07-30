# Journey Academy

You are a senior full-stack engineer and system architect.

I am building a production-ready language school platform using TanStack Start.

TECH STACK:

TanStack Start

TypeScript

Tailwind CSS

Prisma ORM

PostgreSQL (Neon or similar)

JWT Authentication (custom, not NextAuth)

Payments: Chapa (Ethiopia) or Telebirr (if available)

Storage: Cloudinary or Supabase

SYSTEM OVERVIEW:

This platform combines:

Education (English & Arabic courses)

Referral system

Points-based reward system

Multi-role dashboards

ROLES:

Student / Partner (paid users)

User (non-paying referral users)

Admin

WEBSITE STRUCTURE

Landing Page:

Hero Section:

"Your Journey Begins Here"

"Learn English & Arabic"

"Start Today"

About Journex

Vision & Mission

Why Choose Us

Our Teachers

Learning Journey Packages

Student Testimonials

FAQ

Contact

AUTHENTICATION

Signup (Registration fields):

First Name

Middle Name

Last Name

Work / Job

Age

Address

Phone Number

Account Number

Email (Gmail)

Gender

Educational Status

Referral Username (optional input)

Login:

Phone number OR Email

Password

DASHBOARDS

Student / Partner Dashboard:

Welcome

My Courses

Learning Progress

Certificates

Personal Journey Points (PJP)

Team Journey Points (TJP)

Referral Link

Referral Members

Wallet / Rewards

Notifications

Profile

User Dashboard (non-paying):

Welcome

Team Journey Points

Referral Link

Referral Members

Wallet / Rewards

Notifications

Profile

Admin Dashboard:

Students

Teachers

Courses

Payments

Packages

Referrals

Points

Reports

Compensation Rules

Content Management

COURSES / PACKAGES

English Learning Journey:

Foundation: 6800 ETB

Progress: 12500 ETB

Mastery: 19850 ETB

Excellence: 24500 ETB

Arabic Learning Journey:

Foundation: 5400 ETB

Progress: 9650 ETB

Mastery: 15390 ETB

Excellence: 21436 ETB

REFERRAL SYSTEM

Each user has a unique referralUsername

Users can invite others using this username

Track:

who invited who

referral tree (parent-child structure)

Referral members must be visible on dashboard

POINT SYSTEM

Two types of points:

PJP (Personal Journey Points)

TJP (Team Journey Points)

Rules:

Users earn PJP when:

They purchase a course

They refer a new user

Users earn TJP when:

Their referrals invite others

Their team grows

Even if referred users do NOT purchase, inviter still earns points

Compensation rules should be configurable by admin

BUSINESS CONTEXT

All new users start as "Partner" level

User levels change based on compensation rules

Platform combines:

Education

Leadership

Business opportunity

Vision:
To become the world's most trusted education and leadership network, empowering millions of people.

Mission:
To provide high-quality education, develop leaders, and create ethical business opportunities.

UI REQUIREMENTS

Clean, modern UI

Primary colors: Blue & White

Focus on trust, clarity, and professionalism

TASKS

Step 1:
Design a scalable Prisma schema for:

Users

Roles

Referrals (self-relation)

Points (PJP & TJP)

Courses / Packages

Enrollments

Payments

Wallet / Rewards

Step 2:
Design backend architecture for TanStack Start:

API structure

Service layer (auth, referral, points)

Middleware (JWT auth)

Step 3:
Implement JWT authentication:

Register

Login

Secure routes

Role-based access

Step 4:
Design referral system logic:

Efficient referral tree

Querying referrals

Tracking relationships

Step 5:
Design points system:

Scalable calculation

Event-based logic (referral, purchase, etc.)

Admin-controlled compensation rules

Step 6:
Suggest clean and scalable folder structure

Step 7:
Start implementing core modules:

Auth

Referral system

Points system

Make everything production-ready, modular, and scalable.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://journex-learn-grow.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6cf20807-7e92-4ea4-993a-3603b8705e66).

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
