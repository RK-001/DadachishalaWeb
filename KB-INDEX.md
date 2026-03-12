# KB-INDEX.md — Workflow Navigation Index

> **Purpose:** This is the navigation index used by the KB updater workflow and AI agents that use the `fetch_kb_file` pattern. Each entry contains a File path, Keywords for routing, and a Covers summary.  
> **Organization:** Educare (Dada Chi Shala) Educational Trust  
> **Repository:** Dada Chi Shala NGO Website (React + Firebase SPA)  
> **Maintained by:** KB updater workflow (`.github/workflows/update-kb.yml`)  
> **Last Updated:** 2026-03-12

---

## HOW TO USE THIS INDEX

1. Find the **module or keyword** that matches your topic.
2. Use the **File** path to fetch the authoritative KB document.
3. **Do NOT hallucinate** collection names, field names, component APIs, or hook signatures — look them up in the fetched doc.
4. If a topic is not covered in any KB file, flag the gap to the user.

---

## MODULE ENTRIES

Each entry follows the required format for AI agent navigation:

### Public Information & Storytelling
- **File:** `doc/01-public-storytelling-module.md`
- **Keywords:** homepage, about, gallery, team, media, contact, blog, stories, testimonials, awards, news, videos, SEO, hero, AnimatedCounter, impact numbers, GalleryCard, GalleryGrid, BlogCard, Footer, Navbar, success stories, successStories, GalleryPage, TeamPage, MediaPage, AboutPage, ContactPage
- **Covers:** All public-facing information pages: requirements, component structure, Firestore collections (gallery, team, blogs, successStories, testimonials, awards, news, videos), and SEO strategy

### Events Management
- **File:** `doc/02-events-module.md`
- **Keywords:** events, EventsPage, EventCard, EventForm, EventDetails, EventManagement, upcoming events, useUpcomingEvents, events collection, event date filter, admin events CRUD
- **Covers:** Public events listing, event detail view, and admin CRUD for the `events` Firestore collection

### Community Engagement — Volunteers & Branches
- **File:** `doc/03-community-engagement-module.md`
- **Keywords:** volunteer, VolunteerPage, VolunteerManagement, volunteers collection, branch, branches, BranchesPage, BranchCard, BranchManagement, community, 4-step form
- **Covers:** Volunteer registration 4-step form flow, admin volunteer review, branches public listing, and admin branch CRUD

### Donations & Fundraising
- **File:** `doc/04-donations-fundraising-module.md`
- **Keywords:** donate, donations, DonatePage, DonationManagement, Razorpay, razorpayService, createRazorpayOrder, verifyRazorpayPayment, razorpayWebhook, Cloud Functions, donors, donor records, receipt, payment, bank transfer, online donation
- **Covers:** Full donation flow — Razorpay order creation, payment verification, webhook handling, Cloud Functions, donor record writing, email receipt, and admin donation management

### Admin Content Management
- **File:** `doc/05-admin-content-management-module.md`
- **Keywords:** admin dashboard, AdminDashboard, admin CRUD, GalleryManagement, GalleryForm, TeamManagement, BlogManagement, BlogModal, StoriesTestimonialsManagement, DonationManagement, VolunteerManagement, BranchManagement, EventManagement, ImageUpload, AdminSetup, admin panel, content management
- **Covers:** Admin dashboard layout, all admin tab components, image upload, and CRUD screens for every content type

### Platform Infrastructure & Auth
- **File:** `doc/06-platform-infrastructure-auth-module.md`
- **Keywords:** App.jsx, router, routes, Firebase, Firestore, Auth, AuthContext, Firebase Storage, Realtime Database, maintenance mode, MaintenancePage, AdminLogin, ProtectedRoute, ErrorBoundary, ScrollToTop, Navbar, NotificationContext, code splitting, lazy loading, firebase.json, vercel.json, vite.config.js, tailwind.config.js, deployment, Firebase Hosting, Vercel, NotFoundPage, 404
- **Covers:** App shell, routing, Firebase initialization, authentication, protected routes, maintenance mode killswitch, deployment configuration, and build tooling

### Data Model, Hooks & Services (Quick Reference)
- **File:** `doc/quick-reference.md`
- **Keywords:** Firestore collections, data model, fields, schema, useFirebaseQueries, useCRUD, useFirestore, queryClient, QUERY_KEYS, React Query, cachedDatabaseService, cacheService, emailService, imageUploadService, firebase.js, sanitization, validators, formatters, helpers, logger, environment variables, VITE_FIREBASE, env vars, build commands, npm run dev, npm run build, error patterns, cache strategy, governor limits, EmailJS, common modal
- **Covers:** Complete Firestore data model (all collections + fields), all React Query hooks, all service methods, utility functions, environment variables, error patterns, and build/deployment commands

---

## FIRESTORE COLLECTION → MODULE MAP

| Collection | Owner Module | Primary KB Doc |
|------------|-------------|----------------|
| `events` | Events | `doc/02-events-module.md` |
| `volunteers` | Community | `doc/03-community-engagement-module.md` |
| `branches` | Community | `doc/03-community-engagement-module.md` |
| `donations` | Donations | `doc/04-donations-fundraising-module.md` |
| `donors` | Donations | `doc/04-donations-fundraising-module.md` |
| `gallery` | Public / Admin | `doc/01-public-storytelling-module.md` |
| `successStories` | Public / Admin | `doc/01-public-storytelling-module.md` |
| `testimonials` | Public / Admin | `doc/01-public-storytelling-module.md` |
| `blogs` | Public / Admin | `doc/01-public-storytelling-module.md` |
| `team` | Public / Admin | `doc/01-public-storytelling-module.md` |
| `awards` | Public / Admin | `doc/01-public-storytelling-module.md` |
| `news` | Public | `doc/01-public-storytelling-module.md` |
| `videos` | Public | `doc/01-public-storytelling-module.md` |
| `config/maintenanceMode` | Infrastructure | `doc/06-platform-infrastructure-auth-module.md` |

---

## CROSS-REFERENCE MATRIX

| User Intent | Primary File | Secondary File |
|-------------|-------------|----------------|
| "Add/change donation feature" | `doc/04-donations-fundraising-module.md` | `doc/quick-reference.md` → `donations`, `donors` |
| "Add/change events feature" | `doc/02-events-module.md` | `doc/quick-reference.md` → `events` |
| "Add/change volunteer flow" | `doc/03-community-engagement-module.md` | `doc/quick-reference.md` → `volunteers` |
| "Modify admin dashboard" | `doc/05-admin-content-management-module.md` | `doc/06-platform-infrastructure-auth-module.md` |
| "Change gallery or media" | `doc/01-public-storytelling-module.md` | `doc/05-admin-content-management-module.md` |
| "Authentication or protected routes" | `doc/06-platform-infrastructure-auth-module.md` | — |
| "Performance or caching" | `doc/quick-reference.md` → §5 | `doc/06-platform-infrastructure-auth-module.md` |
| "SEO change" | `doc/01-public-storytelling-module.md` | `doc/quick-reference.md` |
| "Deployment / hosting / env vars" | `doc/quick-reference.md` → §4 | `doc/06-platform-infrastructure-auth-module.md` |
| "Blog feature" | `doc/05-admin-content-management-module.md` | `doc/01-public-storytelling-module.md` |

---

## ROUTE MAP

| Route | Page Component | Auth Required | KB Doc |
|-------|---------------|--------------|--------|
| `/` | `HomePage.jsx` | No | `doc/01-public-storytelling-module.md` |
| `/about` | `AboutPage.jsx` | No | `doc/01-public-storytelling-module.md` |
| `/gallery` | `GalleryPage.jsx` | No | `doc/01-public-storytelling-module.md` |
| `/team` | `TeamPage.jsx` | No | `doc/01-public-storytelling-module.md` |
| `/media` | `MediaPage.jsx` | No | `doc/01-public-storytelling-module.md` |
| `/events` | `EventsPage.jsx` | No | `doc/02-events-module.md` |
| `/branches` | `BranchesPage.jsx` | No | `doc/03-community-engagement-module.md` |
| `/volunteer` | `VolunteerPage.jsx` | No | `doc/03-community-engagement-module.md` |
| `/donate` | `DonatePage.jsx` | No | `doc/04-donations-fundraising-module.md` |
| `/contact` | `ContactPage.jsx` | No | `doc/01-public-storytelling-module.md` |
| `/admin` | `AdminLogin.jsx` | No | `doc/06-platform-infrastructure-auth-module.md` |
| `/admin/dashboard` | `AdminDashboard.jsx` | **Yes** | `doc/05-admin-content-management-module.md` |
| `*` | `NotFoundPage.jsx` | No | `doc/06-platform-infrastructure-auth-module.md` |
