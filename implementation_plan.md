# Implementation Plan: Connect VA Portal to Prisma Database

This plan details how we will integrate the Virtual Assistant (VA) frontend dashboard and subpages to persist data directly in the database using Prisma. This will replace `localStorage` with dynamic database operations for profile updates, job browsing, application tracking, interview scheduling, and course enrollment.

---

## Proposed Database Schemas

We will leverage the existing tables in [schema.prisma](file:///Users/lawie/local%20Documents/VA101%2520Management%2520System/va101-management-system/prisma/schema.prisma):
- `users`: Stores user info (`full_name`, `email`, `profile_photo_url`, `cover_image`).
- `va_profiles`: Stores profile headline, bio, rate, location, etc.
- `va_skills` & `va_tools`: Connects VAs to their selected skills/tools.
- `job_posts`: Stores client job offers.
- `job_applications`: Stores job applications submitted by VAs.
- `interviews`: Tracks Recruiter screenings and Client interviews.
- `learning_access` / `training_purchases`: Records enrolled courses and lesson completion details.

---

## Proposed REST API Endpoints

We will implement the following REST API handlers:

### 1. VA Profile API
#### [NEW] [profile/route.ts](file:///Users/lawie/local%20Documents/VA101%2520Management%2520System/va101-management-system/src/app/api/va/profile/route.ts)
- **GET**: Retrieve the authenticated VA's profile data, including nested user metadata, skills, tools, and portfolio lists.
- **PATCH**: Update profile parameters. Specifically:
  - Updates `users` table for: `full_name`, `profile_photo_url` (avatar), and `cover_image`.
  - Updates `va_profiles` table for: `headline` (title), `bio` (about), `location`, `expected_hourly_rate`, and `availability_summary`.
  - Re-syncs join relations for skills/tools.

### 2. Jobs Feed API
#### [NEW] [route.ts](file:///Users/lawie/local%20Documents/VA101%2520Management%2520System/va101-management-system/src/app/api/jobs/route.ts)
- **GET**: Fetch all active job listings from the `job_posts` table (joining company profile, skills, and rates) and check if the user has bookmarked or applied to them.

### 3. Job Applications API
#### [NEW] [route.ts](file:///Users/lawie/local%20Documents/VA101%2520Management%2520System/va101-management-system/src/app/api/applications/route.ts)
- **GET**: Retrieve all applications submitted by the logged-in VA, including status histories.
- **POST**: Submit a new application for a specific `job_post_id`, creating an entry in the `job_applications` table.

### 4. Interviews API
#### [NEW] [route.ts](file:///Users/lawie/local%20Documents/VA101%2520Management%2520System/va101-management-system/src/app/api/interviews/route.ts)
- **GET**: Retrieve scheduled screening calls or client interviews.
- **PATCH**: Propose an alternate date/time for rescheduling.

---

## Frontend Integration Plan

### 1. Dashboard & Profile Page Sync
- Fetch profile data from `/api/va/profile` on mount using React `useEffect`.
- When users edit their headline, location, rate, or upload a banner/avatar, trigger a `PATCH` request to `/api/va/profile`.
- Clear/reset profile picture operations will send an empty payload to clean the field on the user model.

### 2. Jobs Feed Sync
- Replace the static `MOCK_JOBS` array on the Jobs page with a dynamic fetch from `/api/jobs`.
- Submit applications by dispatching a `POST` request to `/api/applications`.

### 3. Learning Progress Sync
- Track active course enrollments and lessons completion on `/api/training` endpoints instead of localStorage caches.

---

## Verification Plan

### Automated Tests
- Build verification check using `npx tsc --noEmit` to confirm complete compile health.

### Manual Verification
- Verify database update flows using Prisma Studio (`npx prisma studio`) to trace profile/application records matching UI interactions.
