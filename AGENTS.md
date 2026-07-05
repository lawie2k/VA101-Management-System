<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Coding & Development Rules

> [!IMPORTANT]
> **MANDATORY PRE-FLIGHT CHECK — BEFORE EVERY TASK:**
> Before touching ANY file, you MUST read `AGENTS.md` and verify all of the following:
> 1. **Project Directory Structure** — confirm the correct folder placement for new or moved files.
> 2. **Core Engineering Principles** — SRP, strict TypeScript types, no duplicate code, and always verify with `npx tsc --noEmit` after changes.
> 3. **Security Rules** — apply SQL injection prevention, rate limiting, and transaction guards for any input field, API route, auth flow, or database write.
> 4. **Design Tokens** — match brand color `#E84E29`, Outfit font, slate grey bases, and glassmorphic card styles for all UI work.
> 5. **Local State Keys** — use `client_profile_data`, `client_mock_jobs`, and the `clientProfileUpdate` window event correctly and consistently.
>
> Skipping this step on ANY task — even a "small" one — is NOT acceptable.

## Core Engineering Principles

When writing, refactoring, or optimizing code:
1. **Plan First Specification Mode**: Always analyze requirements and state your architectural intent before editing files.
2. **Single Responsibility Principle (SRP)**: Keep functions short, modular, and focused.
3. **Strict Type Safety**: Prioritize explicit TypeScript types. Avoid using `any` or implicit dynamic types.
4. **Avoid Duplicate Code**: Check the workspace directories (e.g. `src/components/forms/`) for reusable elements (like `PhoneInput`) before building new ones.
5. **Minimize Dependencies**: Favor native language features over importing unnecessary third-party packages.
6. **Automated Verification**: Always verify that the project builds cleanly (`npx tsc --noEmit`) after editing to ensure zero compiler issues are introduced.
7. **SQL Injection Prevention**: Always use Prisma ORM's parameterized queries or prepared statements. Never concatenate raw strings for user input in SQL queries.
8. **Rate Limiting**: Apply rate-limiting wrappers/decorators on public-facing and authentication APIs (like `/api/auth/login`, `/register`, and `/api/discovery-calls`) to protect against resource abuse.
9. **Race Condition Protection & Transactions**: Use transaction blocks (`db.$transaction()`) for all multi-step database writes, reservation bookings, payments, and state transitions to prevent race conditions.



# Database Conventions & Soft Deletes

- **Soft Deletes Only:** Do NOT perform hard deletes (`DELETE` SQL statements or Prisma `.delete()` / `.deleteMany()`) on business-related data tables in this system.
- **Implementation Pattern:** 
  - To delete a record, update its status column to `"deleted"` (or set its `archived_at` / `deleted_at` timestamp if available).
  - All read/fetch queries (e.g., Prisma `.findMany()`, `.findUnique()`) must filter out deleted records (e.g., `where: { status: { not: "deleted" } }`).

# VA101 Marketplace — Project Blueprint & Flow Map

## 1. Project Directory Structure

```
va101-management-system/
├── prisma/
│   └── schema.prisma               # Prisma DB Schema (client_profiles, job_posts, etc.)
└── src/
    ├── app/
    │   ├── (public)/               # Publicly accessible marketing & auth routes
    │   │   ├── register/           # Registration page (Client redirects to setup-profile-form)
    │   │   ├── login/              # Log in page
    │   │   └── discovery-calls/    # Discovery Calls scheduling form
    │   ├── (dashboard)/            # Dashboard namespaces protected by authentication
    │   │   ├── client/             # Client Workspace Pages
    │   │   │   ├── dashboard/      # Client Dashboard (Welcome Feed, Job posts, candidates)
    │   │   │   ├── profile/        # Company Profile details page
    │   │   │   │   └── setup-profile-form/ # First-time onboarding profile setup form
    │   │   │   ├── post-job/       # Post Job wizard page (split pay breakdown, days/hours)
    │   │   │   ├── jobs/           # My Jobs tracking page
    │   │   │   ├── shortlisted-candidates/
    │   │   │   ├── interviews/
    │   │   │   ├── contracts/
    │   │   │   └── payments/
    │   │   └── va/                 # Virtual Assistant Workspace Pages
    │   │       ├── dashboard/      # VA Main Feed, Active Timeline tracker, courses
    │   │       ├── profile/        # VA Public Profile page & edit modals
    │   │       │   └── setup-profile-form/ # VA onboarding setup form
    │   │       ├── applications/
    │   │       └── interviews/
    │   └── api/                    # Active API Endpoint Routers
    │       ├── auth/               # Login, logout, register, me APIs
    │       ├── jobs/               # Jobs listing APIs
    │       ├── discovery-calls/    # Discovery Calls database APIs
    │       └── va/                 # VA Namespace (profile, applications, interviews)
    └── components/                 # React UI layout components
        ├── client-dashboard-components/ # ClientLeftSidebar, ClientMainFeed, ClientRightSidebar
        ├── va-dashboard-components/     # DashboardLeftSidebar, DashboardMainFeed, DashboardRightSidebar
        ├── forms/                  # Reusable form elements (PhoneInput with dial picker)
        └── layout/                 # Layout Shell wrappers (FormHeader, Footer)
```

## 2. Onboarding & Registration Flow (Clients)

1. **Sign Up**: Client completes register fields at `/register`. On success, they are redirected to `/client/profile/setup-profile-form`.
2. **Profile Setup**:
   - The form fields start **completely blank** (no prefilled values).
   - The **Complete Setup** submit button is greyed out (`bg-slate-200 cursor-not-allowed`) until all 8 required fields are filled.
   - Upon form submission, details save to LocalStorage under the `"client_profile_data"` key, and they are redirected to `/client/dashboard`.
   - Setup page checks for `"client_profile_data"` presence on mount; if found, it uses `router.replace` to block users from back-navigating into the setup form.

## 3. Client Dashboard Layout

* Enforces the **3-column LinkedIn-Style Layout** matching the VA dashboard design (`grid-cols-12` grid):
  * **Left Sidebar (3 cols)**: Renders `ClientLeftSidebar` component. Shows cover photo, company logo, industry size meta, and profile completeness strength bar.
  * **Main Feed (6 cols)**: Renders `ClientMainFeed` component. Displays gradient welcome card, "Discovery Call" and "Post a Job" action pill buttons, active jobs list, and shortlisted candidates.
  * **Right Sidebar (3 cols)**: Renders `ClientRightSidebar` component. Showcases Payment Reminders and Contract Status.

## 4. Post Job Logic

* Located at `/client/post-job`.
* Features a 3-column layout row separating **Core Specialty (Niche)**, **Work Days** (e.g. `Mon-Fri`), and **Work Hours** (e.g. `9am-1pm EST`).
* Calculates dynamic 70/30 commission splits on hourly rate:
  * Client hourly rate `rate` state supports empty strings (`""`) to allow total deletion without default zeros.
  * VA Payout (70%) and Platform Split (30%) update automatically in real-time.
  * Submit button is greyed out until all text inputs and hourly budget rates are completed.
  * On submit, combines Days and Hours into a single string `"Days, Hours"` to save under the `schedule` metadata key in mock databases.

## 5. Local State & Sidebars Syncing

* Both client sidebars and feeds listen for changes to profile states.
* When profile values are updated, components save changes to LocalStorage key `"client_profile_data"` and dispatch a custom window event `"clientProfileUpdate"`.
* Subscribed widgets listen to `"clientProfileUpdate"` and trigger automatic state updates to paint profile changes immediately.

## 6. Design Tokens & Aesthetic Standards
* **Typography**: Outfit font, sans-serif.
* **Colors**: Pure slate grey bases (`slate-500` through `slate-950`), white glassmorphic containers, and brand orange accents (`#E84E29` / `bg-[#E84E29]`).
* **Interactive Elements**: High-fidelity pill button styles, soft transitions, and hover-triggered scale / lifted shadow animation cues.


## 7. File Storage & Uploads
* **AWS S3 Only**: All file uploads (profile pictures, resumes, receipts, training materials, etc.) must be implemented using AWS S3 (or equivalent cloud storage). Do NOT use local filesystem storage (e.g., `public/uploads`) for any permanent or production file storage.
