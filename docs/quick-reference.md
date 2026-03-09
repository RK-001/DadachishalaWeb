# Quick Reference — Dada Chi Shala Website

> **Purpose:** Fast lookup for Firestore collections, React Query hooks, service methods, component inventory, environment variables, and common errors. Cross-reference this before generating any code.  
> **Organization:** Educare (Dada Chi Shala) Educational Trust  
> **Last Updated:** 2026-03-09

---

## §1 DATA MODEL — Firestore Collections

> All collections live in Firebase Firestore. Timestamps are `serverTimestamp()` / Firestore `Timestamp` type unless noted as ISO string.

---

### `events`

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Event name |
| `description` | string | Full event description |
| `event_date` | string (ISO date `YYYY-MM-DD`) | Used for ordering and upcoming filter |
| `event_time` | string | Display time (e.g., `"10:00 AM"`) |
| `location` | string | Venue name or address |
| `location_url` | string | Google Maps link (optional) |
| `category` | string | Event category/tag |
| `image_url` | string | Firebase Storage URL (optional) |
| `status` | string | e.g., `"upcoming"`, `"completed"`, `"cancelled"` |
| `created_at` | Timestamp | Set on create |
| `updated_at` | Timestamp | Updated on every write |

**Ordering:** `orderBy('event_date', 'asc')`. Upcoming filter: `where('event_date', '>=', today)`.

---

### `gallery`

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Caption or title |
| `description` | string | Optional longer description |
| `url` | string | Firebase Storage URL |
| `category` | string | e.g., `"photos"`, `"videos"`, `"awards"` — used for filtering |
| `type` | string | `"image"` or `"video"` |
| `thumbnail_url` | string | Optional thumbnail for video items |
| `uploaded_at` | Timestamp | Set on create; used for `orderBy` desc |
| `updated_at` | Timestamp | Updated on write |

---

### `successStories`

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Student / subject name |
| `story` | string | Full story text |
| `image_url` | string | Firebase Storage URL (optional) |
| `year` | string | Graduation or story year |
| `category` | string | Story category |
| `created_at` | Timestamp | |
| `updated_at` | Timestamp | |

---

### `testimonials`

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Person giving testimonial |
| `role` | string | Relationship to org (e.g., `"Parent"`, `"Volunteer"`) |
| `message` | string | Testimonial text |
| `image_url` | string | Optional photo |
| `rating` | number | 1–5 (optional) |
| `created_at` | Timestamp | |
| `updated_at` | Timestamp | |

---

### `blogs`

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Blog post title |
| `content` | string | Full blog content (may contain markdown) |
| `excerpt` | string | Short summary for card display |
| `author` | string | Author display name |
| `author_type` | string | e.g., `"admin"`, `"volunteer"` — used for filtering |
| `image_url` | string | Cover image URL |
| `tags` | array | String tags |
| `published` | boolean | Draft vs published flag |
| `created_at` | Timestamp | |
| `updated_at` | Timestamp | |

---

### `team`

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Full name |
| `role` | string | Title / designation |
| `bio` | string | Brief biography |
| `image_url` | string | Firebase Storage URL |
| `category` | string | e.g., `"founder"`, `"core_team"`, `"volunteer"` |
| `social_links` | object | `{ linkedin, twitter, instagram }` |
| `order` | number | Display sort order |
| `created_at` | Timestamp | |
| `updated_at` | Timestamp | |

---

### `awards`

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Award name |
| `description` | string | Award details |
| `year` | string | Year received |
| `image_url` | string | Award image / certificate URL |
| `organization` | string | Awarding body |
| `created_at` | Timestamp | |

---

### `news`

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | News headline |
| `excerpt` | string | Summary |
| `url` | string | External link to press article |
| `source` | string | Publication name |
| `date` | string | Publication date |
| `image_url` | string | Optional thumbnail |
| `created_at` | Timestamp | |

---

### `videos`

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Video title |
| `description` | string | Optional description |
| `embed_url` | string | YouTube embed URL |
| `thumbnail_url` | string | Video thumbnail |
| `category` | string | e.g., `"events"`, `"stories"` |
| `created_at` | Timestamp | |

---

### `volunteers`

| Field | Type | Notes |
|-------|------|-------|
| `personal_info` | object | `{ name, email, phone, address, date_of_birth, gender }` |
| `skills_and_interests` | object | `{ skills: [], subjects: [], languages: [] }` |
| `availability` | object | `{ days: [], time_slots: [], hours_per_week }` |
| `experience_and_motivation` | object | `{ motivation, prior_experience, education }` |
| `references_and_emergency` | object | `{ reference_name, reference_contact, emergency_contact }` |
| `application_status` | string | `"pending"`, `"approved"`, `"rejected"` |
| `status` | string | Mirror field — keep in sync with `application_status` |
| `assigned_branch` | string | Branch name after assignment |
| `branch_coordinator_email` | string | Coordinator email for assigned branch |
| `action_history` | array | Array of `{ action, timestamp, notes }` objects |
| `created_at` | Timestamp | |
| `updated_at` | Timestamp | |

---

### `branches`

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Branch name |
| `location` | string | Area / locality |
| `address` | string | Full address |
| `timings` | string | Operating hours (display string) |
| `coordinator` | string | Coordinator name |
| `coordinator_email` | string | Contact email |
| `image_url` | string | Branch image |
| `hero_image_url` | string | Hero/banner image |
| `student_count` | number | Approximate number of students |
| `established_year` | string | Year branch started |
| `created_at` | Timestamp | |
| `updated_at` | Timestamp | |

---

### `donations`

| Field | Type | Notes |
|-------|------|-------|
| `razorpayOrderId` | string | Razorpay order ID |
| `razorpayPaymentId` | string | Razorpay payment ID (set after verification) |
| `amount` | number | Donation amount in INR |
| `status` | string | `"pending"`, `"completed"`, `"failed"` |
| `donorInfo` | object | `{ name, email, phone, panNumber }` |
| `donationType` | string | Category e.g., `"Education"`, `"General"` |
| `message` | string | Optional donor message |
| `paymentMethod` | string | `"razorpay"` or `"manual"` |
| `receipt_url` | string | For manual: screenshot URL in Storage |
| `createdAt` | Timestamp | |
| `updatedAt` | Timestamp | |

---

### `donors`

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Donor name |
| `email` | string | Donor email |
| `phone` | string | Optional |
| `panNumber` | string | For 80G tax receipt |
| `amount` | number | Donation amount |
| `donationType` | string | Category |
| `paymentId` | string | Razorpay payment reference |
| `orderId` | string | Razorpay order reference |
| `donationId` | string | Firestore `donations` doc ID |
| `receiptSent` | boolean | Whether receipt email was sent |
| `createdAt` | Timestamp | |

---

### Realtime Database (RTDB)

| Path | Type | Notes |
|------|------|-------|
| `config/maintenanceMode` | boolean | `true` shows MaintenancePage in production |

---

## §2 HOOKS & SERVICES

### 2.1 QUERY_KEYS (from `useFirebaseQueries.js`)

```js
QUERY_KEYS = {
  events, upcomingEvents, gallery, successStories,
  testimonials, blogs, blog, branches, branch,
  awards, news, videos, team, volunteers, donations,
  donation, donationStats
}
```

### 2.2 React Query Hooks — Full Inventory

> All hooks exported from `src/hooks/useFirebaseQueries.js`

#### Events
| Hook | Signature | Returns |
|------|-----------|---------|
| `useEvents` | `(limitCount?)` | Query: array of event docs |
| `useUpcomingEvents` | `(limitCount = 3)` | Query: upcoming events only |
| `useAddEvent` | `()` | Mutation |
| `useUpdateEvent` | `()` | Mutation — call with `{ eventId, updateData }` |
| `useDeleteEvent` | `()` | Mutation — call with `eventId` |

#### Gallery
| Hook | Signature | Returns |
|------|-----------|---------|
| `useGalleryItems` | `(category?, limitCount?)` | Query: array of gallery docs |
| `useAddGalleryItem` | `()` | Mutation |
| `useUpdateGalleryItem` | `()` | Mutation — call with `{ itemId, updateData }` |
| `useDeleteGalleryItem` | `()` | Mutation |

#### Stories & Testimonials
| Hook | Signature | Returns |
|------|-----------|---------|
| `useSuccessStories` | `()` | Query |
| `useAddSuccessStory` | `()` | Mutation |
| `useUpdateSuccessStory` | `()` | Mutation — call with `{ storyId, updateData }` |
| `useDeleteSuccessStory` | `()` | Mutation |
| `useTestimonials` | `()` | Query |
| `useAddTestimonial` | `()` | Mutation |
| `useUpdateTestimonial` | `()` | Mutation — call with `{ testimonialId, updateData }` |
| `useDeleteTestimonial` | `()` | Mutation |

#### Blogs
| Hook | Signature | Returns |
|------|-----------|---------|
| `useBlogs` | `(authorType?, limitCount?)` | Query |
| `useBlog` | `(blogId)` | Query — single blog, enabled only if `blogId` truthy |
| `useAddBlog` | `()` | Mutation |
| `useUpdateBlog` | `()` | Mutation — call with `{ blogId, updateData }` |
| `useDeleteBlog` | `()` | Mutation |

#### Branches
| Hook | Signature | Returns |
|------|-----------|---------|
| `useBranches` | `()` | Query — staleTime 5 min |
| `useBranch` | `(branchId)` | Query — single branch |
| `useAddBranch` | `()` | Mutation |
| `useUpdateBranch` | `()` | Mutation |
| `useDeleteBranch` | `()` | Mutation |

#### Team, Awards, News, Videos, Volunteers, Donations
Follow the same `useX()` / `useAddX()` / `useUpdateX()` / `useDeleteX()` pattern.

---

### 2.3 `cachedDatabaseService.js` — Service Method Inventory

> All Firestore write operations must go through these methods.

| Method | Collection | Notes |
|--------|-----------|-------|
| `getEvents(limitCount?)` | `events` | |
| `getUpcomingEvents(limitCount?)` | `events` | Filters by `event_date >= today` |
| `addEvent(data)` | `events` | Stamps `created_at`, `updated_at` |
| `updateEvent(eventId, data)` | `events` | Stamps `updated_at` |
| `deleteEvent(eventId)` | `events` | |
| `getGalleryItems(category?, limitCount?)` | `gallery` | |
| `addGalleryItem(data)` | `gallery` | Stamps `uploaded_at` |
| `updateGalleryItem(itemId, data)` | `gallery` | |
| `deleteGalleryItem(itemId)` | `gallery` | |
| `getSuccessStories()` | `successStories` | |
| `addSuccessStory(data)` | `successStories` | |
| `updateSuccessStory(storyId, data)` | `successStories` | |
| `deleteSuccessStory(storyId)` | `successStories` | |
| `getTestimonials()` | `testimonials` | |
| `addTestimonial(data)` | `testimonials` | |
| `updateTestimonial(testimonialId, data)` | `testimonials` | |
| `deleteTestimonial(testimonialId)` | `testimonials` | |
| `getBlogs(authorType?, limitCount?)` | `blogs` | |
| `getBlogById(blogId)` | `blogs` | |
| `addBlog(data)` | `blogs` | |
| `updateBlog(blogId, data)` | `blogs` | |
| `deleteBlog(blogId)` | `blogs` | |
| `getBranches()` | `branches` | |
| `getBranchById(branchId)` | `branches` | |
| `addBranch(data)` | `branches` | |
| `updateBranch(branchId, data)` | `branches` | |
| `deleteBranch(branchId)` | `branches` | |
| `getTeamMembers()` | `team` | |
| `addTeamMember(data)` | `team` | |
| `updateTeamMember(memberId, data)` | `team` | |
| `deleteTeamMember(memberId)` | `team` | |
| `getVolunteers(status?)` | `volunteers` | |
| `addVolunteer(data)` | `volunteers` | |
| `updateVolunteer(volunteerId, data)` | `volunteers` | |
| `getDonations(status?)` | `donations` | |
| `getDonationById(donationId)` | `donations` | |

---

### 2.4 Cloud Functions (in `functions/index.js`)

> These are Firebase Cloud Functions deployed server-side. **Never expose secrets client-side.**

| Function Name | Type | Purpose |
|---------------|------|---------|
| `createRazorpayOrder` | `onCall` | Creates Razorpay order, writes pending `donations` doc |
| `verifyRazorpayPayment` | `onCall` | Verifies HMAC signature, marks `donations` completed, creates `donors` doc, sends receipt email |
| `razorpayWebhook` | `onRequest` (HTTP) | Webhook endpoint for Razorpay event reconciliation |
| `sendVolunteerConfirmation` | `onCall` | Sends confirmation email after volunteer form submission |

**Server-side environment variables (Cloud Functions secrets):**

| Variable | Purpose |
|----------|---------|
| `RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay private key — must stay server-side |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature verification |
| `EMAIL_USER` | Gmail sender account |
| `EMAIL_PASSWORD` | Gmail app password |

---

### 2.5 Other Services

| File | Purpose |
|------|---------|
| `src/services/firebase.js` | Firebase initialization; exports `db`, `auth`, `storage`, `functions`, `rtdb`, `analytics` |
| `src/services/cacheService.js` | Two-layer (memory + localStorage) cache; provides `invalidateCollection()` |
| `src/services/emailService.js` | Client-side EmailJS integration for Contact page |
| `src/services/imageUploadService.js` | Firebase Storage upload with progress and URL return |
| `src/services/razorpayService.js` | Client-side Razorpay SDK initialization and checkout opening |

---

## §3 COMPONENT INVENTORY

### Pages (all in `src/pages/`)

| File | Route | Auth? | Lazy? |
|------|-------|-------|-------|
| `HomePage.jsx` | `/` | No | Yes |
| `AboutPage.jsx` | `/about` | No | Yes |
| `GalleryPage.jsx` | `/gallery` | No | Yes |
| `TeamPage.jsx` | `/team` | No | Yes |
| `MediaPage.jsx` | `/media` | No | Yes |
| `EventsPage.jsx` | `/events` | No | Yes |
| `BranchesPage.jsx` | `/branches` | No | Yes |
| `VolunteerPage.jsx` | `/volunteer` | No | Yes |
| `DonatePage.jsx` | `/donate` | No | Yes |
| `ContactPage.jsx` | `/contact` | No | Yes |
| `AdminLogin.jsx` | `/admin` | No | Yes |
| `AdminDashboard.jsx` | `/admin/dashboard` | **Yes** | Yes |
| `MaintenancePage.jsx` | (override) | No | — |
| `NotFoundPage.jsx` | `*` | No | Yes |

### Shared / Common Components (`src/components/common/`)

| File | Purpose |
|------|---------|
| `Button.jsx` | Reusable button with variants |
| `FormInput.jsx` | Labeled input field with error state |
| `Modal.jsx` | Generic overlay modal |
| `LoadingSpinner.jsx` | Centered loading indicator |
| `index.js` | Re-exports all common components |

### Feature Components

| File | Module | Purpose |
|------|--------|---------|
| `AnimatedCounter.jsx` | M-01 | Impact counter with animation |
| `BlogCard.jsx` / `BlogModal.jsx` | M-01/M-05 | Blog listing card + detail modal |
| `BlogManagement.jsx` | M-05 | Admin blog CRUD |
| `BranchCard.jsx` / `BranchManagement.jsx` | M-03/M-05 | Branch display + admin CRUD |
| `EventCard.jsx` / `EventForm.jsx` / `EventDetails.jsx` | M-02 | Event display, form, detail |
| `EventManagement.jsx` | M-05 | Admin event CRUD |
| `GalleryCard.jsx` / `GalleryForm.jsx` / `GalleryGrid.jsx` | M-01/M-05 | Gallery display + admin |
| `GalleryManagement.jsx` | M-05 | Admin gallery CRUD |
| `ImageUpload.jsx` | M-05 | Firebase Storage upload input |
| `DonationManagement.jsx` | M-05 | Admin donation view |
| `StoriesTestimonialsManagement.jsx` | M-05 | Admin stories/testimonials CRUD |
| `TeamManagement.jsx` | M-05 | Admin team CRUD |
| `VolunteerManagement.jsx` | M-05 | Admin volunteer review + assignment |
| `Navbar.jsx` / `Footer.jsx` | M-06 | Shared layout |
| `ProtectedRoute.jsx` | M-06 | Auth guard for admin routes |
| `ScrollToTop.jsx` | M-06 | Scroll reset on route change |
| `SEO.jsx` | M-01/M-06 | react-helmet-async wrapper |
| `ErrorBoundary.jsx` | M-06 | React error boundary |
| `AdminSetup.jsx` | M-06 | One-time admin user creation utility |

### Context Providers

| File | Exports | Wraps |
|------|---------|-------|
| `src/context/AuthContext.jsx` | `AuthProvider`, `useAuth` | Firebase Auth state |
| `src/context/NotificationContext.jsx` | `NotificationProvider`, `useNotification` | Toast/notification display |

---

## §4 ENVIRONMENT VARIABLES

### Client (Vite) — `.env` file

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_FIREBASE_API_KEY` | ✅ | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase messaging sender |
| `VITE_FIREBASE_APP_ID` | ✅ | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Optional | Firebase Analytics |
| `VITE_FIREBASE_DATABASE_URL` | Optional | Realtime DB URL (auto-constructed if omitted) |
| `VITE_EMAILJS_SERVICE_ID` | Optional | EmailJS service ID for Contact form |
| `VITE_EMAILJS_TEMPLATE_ID` | Optional | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | Optional | EmailJS public key |
| `VITE_RAZORPAY_KEY_ID` | ✅ | Razorpay public key (client-side checkout only) |

### Server (Cloud Functions) — Firebase Functions config / `.env`

| Variable | Required | Purpose |
|----------|----------|---------|
| `RAZORPAY_KEY_ID` | ✅ | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | ✅ | Razorpay secret — **server-only** |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | Webhook signature verification |
| `EMAIL_USER` | Optional | Gmail address for receipt emails |
| `EMAIL_PASSWORD` | Optional | Gmail app password |

### Build & Dev Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `firebase deploy` | Deploy all (Hosting + Functions) |
| `firebase deploy --only hosting` | Deploy frontend only |
| `firebase deploy --only functions` | Deploy Cloud Functions only |

---

## §5 ERRORS, DEBUG & SECURITY

### Common Error Patterns

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Firestore permission denied | Missing Firestore security rules OR user not authenticated | Check security rules; verify `auth.currentUser` is non-null before admin writes |
| React Query not refreshing after mutation | `queryClient.invalidateQueries` not called | Always call `invalidateQueries` in `onSuccess` of every mutation hook |
| Razorpay checkout not opening | `VITE_RAZORPAY_KEY_ID` missing or Razorpay SDK not loaded | Check env vars; `razorpayService.js` loads SDK dynamically — wait for `load` event |
| Email not sending | EmailJS keys missing OR Cloud Function Gmail password expired | Check env vars; email failures must not block Firestore writes |
| Maintenance page showing in dev | `config/maintenanceMode = true` in RTDB | Set to `false` in Firebase Realtime Database console |
| Firebase app not initializing | Missing required `VITE_FIREBASE_*` env vars | Check console for "Missing required Firebase environment variables" error |
| Stale data after admin action | Query keys not being invalidated | Verify mutation hook calls `queryClient.invalidateQueries` with correct key |
| Cache serving stale data after deploy | localStorage cache from previous version | `cacheService.clearAll()` is called on `main.jsx` startup to handle this |

### Security Requirements

| Concern | Implementation |
|---------|---------------|
| XSS prevention | All user text input → `sanitization.js` before Firestore write |
| Admin authorization | `ProtectedRoute.jsx` + `useAuth()` — redirects unauthenticated users |
| Payment secrets | `RAZORPAY_KEY_SECRET` lives only in Cloud Functions; never sent to client |
| Firestore write rules | Must be enforced server-side in Firebase Console security rules (not present in this repo) |
| Volunteer PII | `volunteers` collection should have restricted read rules |
| Donor PII | `donations` + `donors` collections should have admin-only read rules |

### Debug Approach

1. Check browser console for missing env var messages.
2. Check Firebase Console → Firestore for data presence.
3. Check Firebase Console → Functions → Logs for Cloud Function errors.
4. Use React Query Devtools (`@tanstack/react-query-devtools`) to inspect query state.
5. Check React Query stale time — data may appear stale due to 1–5 min stale windows.

---

## §6 UTILITIES

| File | Key Exports | Purpose |
|------|-------------|---------|
| `src/utils/sanitization.js` | `sanitize(text)` | XSS-safe encoding for user input |
| `src/utils/validators.js` | Form validators | Shared validation rules for react-hook-form + yup |
| `src/utils/helpers.js` | Date/string helpers | Formatting utilities |
| `src/utils/formatters.js` | `formatCurrency`, `formatDate` | Display formatting |
| `src/utils/logger.js` | `logger.*` | Structured logger wrapping console |
| `src/utils/colorUtils.js` | Color helpers | Tailwind/UI color utilities |
| `src/utils/adminSetup.js` | `createAdminUser()` | One-time admin account creation |
| `src/config/colors.js` | Color palette constants | Shared color definitions |
| `src/config/queryClient.jsx` | `QueryProvider` | React Query client with default config |
