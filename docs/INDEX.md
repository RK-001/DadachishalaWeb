# INDEX.md — RAG-Optimized Knowledge Base Navigation

> **Purpose:** This index is the first file any AI agent should read. It maps keywords to the exact file and section that contains the authoritative answer. Always read this file before generating code, user stories, or technical recommendations for this project.  
> **Organization:** Educare (Dada Chi Shala) Educational Trust  
> **Repository:** Dada Chi Shala NGO Website  
> **Last Updated:** 2026-03-09

---

## HOW TO USE THIS INDEX

1. Find the **keyword cluster** that matches your topic.
2. Go to the **linked file and section** — that is the source of truth.
3. **Do NOT hallucinate** collection names, field names, component APIs, or hook signatures.
4. If a topic is not covered in any KB file, flag the gap to the user.

---

## MODULE MAP (Functional Domains → Files)

| Module ID | Functional Domain | Primary File | Additional Files |
|-----------|-------------------|--------------|-----------------|
| M-01 | Public Information & Storytelling | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) | doc/quick-reference.md → Public Collections |
| M-02 | Events Management | [doc/02-events-module.md](doc/02-events-module.md) | doc/quick-reference.md → `events` collection |
| M-03 | Community Engagement — Volunteers & Branches | [doc/03-community-engagement-module.md](doc/03-community-engagement-module.md) | doc/quick-reference.md → `volunteers`, `branches` |
| M-04 | Donations & Fundraising | [doc/04-donations-fundraising-module.md](doc/04-donations-fundraising-module.md) | doc/quick-reference.md → `donations`, `donors` |
| M-05 | Admin Content Management | [doc/05-admin-content-management-module.md](doc/05-admin-content-management-module.md) | doc/quick-reference.md → Admin Collections |
| M-06 | Platform Infrastructure & Auth | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) | doc/quick-reference.md → Environment, Config |
| M-07 | Data Model (All Collections & Fields) | [doc/quick-reference.md](doc/quick-reference.md) → §1 Data Model | — |
| M-08 | React Query Hooks & Services | [doc/quick-reference.md](doc/quick-reference.md) → §2 Hooks | — |
| M-09 | Environment, Build & Deployment | [doc/quick-reference.md](doc/quick-reference.md) → §4 Environment | — |
| M-10 | Error Patterns & Debug Approaches | [doc/quick-reference.md](doc/quick-reference.md) → §5 Errors | — |

---

## KEYWORD → FILE LOOKUP TABLE

### A
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **About page** / `/about` | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) → §2.1.4 | HIGH |
| **Admin dashboard** / `/admin/dashboard` | [doc/05-admin-content-management-module.md](doc/05-admin-content-management-module.md) | HIGH |
| **AdminDashboard.jsx** | [doc/05-admin-content-management-module.md](doc/05-admin-content-management-module.md) → §2.1.4 | HIGH |
| **Admin login** / `/admin/login` / `AdminLogin.jsx` | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) → §2.1.2 FR-PI-03 | HIGH |
| **AnimatedCounter** / counter animation / impact numbers | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) → §2.1.4 | MEDIUM |
| **App.jsx** / root component / router | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) → §2.1.4 | HIGH |
| **awards** collection / awards management | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) | MEDIUM |
| **AuthContext** / authentication / Firebase Auth | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) → §2.1.2 FR-PI-03 | HIGH |

### B
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **Blog** / blogs collection / BlogCard / BlogManagement | [doc/05-admin-content-management-module.md](doc/05-admin-content-management-module.md) | HIGH |
| **Branches** / `/branches` / BranchCard / BranchManagement / branches collection | [doc/03-community-engagement-module.md](doc/03-community-engagement-module.md) → §2.1.2 FR-CE-05 | HIGH |
| **Build** / Vite / `npm run dev` / `npm run build` | [doc/quick-reference.md](doc/quick-reference.md) → §4 Environment | HIGH |

### C
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **cachedDatabaseService** / database abstraction / Firestore reads/writes | [doc/quick-reference.md](doc/quick-reference.md) → §2 Services | HIGH |
| **cacheService** / memory cache / localStorage cache | [doc/quick-reference.md](doc/quick-reference.md) → §2 Services | HIGH |
| **Cloud Functions** / `functions/index.js` / callable functions | [doc/04-donations-fundraising-module.md](doc/04-donations-fundraising-module.md) → §2.1.4 | HIGH |
| **Code splitting** / lazy loading / React.lazy / Suspense | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) → §2.1.3 NFR | HIGH |
| **Contact page** / `/contact` / ContactPage / EmailJS | [doc/quick-reference.md](doc/quick-reference.md) → §3 Pages | MEDIUM |
| **CRUD** / useCRUD / create update delete | [doc/quick-reference.md](doc/quick-reference.md) → §2 Hooks | HIGH |

### D
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **Donations** / `/donate` / DonatePage / Razorpay / `donations` collection | [doc/04-donations-fundraising-module.md](doc/04-donations-fundraising-module.md) | HIGH |
| **donors** collection / donor records / receipt | [doc/04-donations-fundraising-module.md](doc/04-donations-fundraising-module.md) → §2.1.2 FR-DF-04 | HIGH |
| **DonationManagement.jsx** / admin donations tab | [doc/05-admin-content-management-module.md](doc/05-admin-content-management-module.md) | HIGH |
| **Data model** / Firestore schema / collection fields | [doc/quick-reference.md](doc/quick-reference.md) → §1 Data Model | HIGH |
| **Deployment** / Firebase Hosting / Vercel / `firebase.json` / `vercel.json` | [doc/quick-reference.md](doc/quick-reference.md) → §4 Environment | HIGH |

### E
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **Events** / `/events` / EventsPage / EventManagement / `events` collection | [doc/02-events-module.md](doc/02-events-module.md) | HIGH |
| **EventCard.jsx** / EventForm.jsx / EventDetails.jsx | [doc/02-events-module.md](doc/02-events-module.md) → §2.1.4 | HIGH |
| **EmailJS** / email service / sendEmail | [doc/quick-reference.md](doc/quick-reference.md) → §2 Services | MEDIUM |
| **emailService.js** | [doc/quick-reference.md](doc/quick-reference.md) → §2 Services | MEDIUM |
| **Error boundary** / ErrorBoundary.jsx | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) | MEDIUM |
| **Environment variables** / VITE_FIREBASE / `.env` | [doc/quick-reference.md](doc/quick-reference.md) → §4 Environment | HIGH |

### F
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **Firebase** / Firestore / Auth / Storage / Realtime DB / Analytics | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) → §2.1.2 FR-PI-05 | HIGH |
| **firebase.js** / Firebase initialization / `services/firebase.js` | [doc/quick-reference.md](doc/quick-reference.md) → §2 Services | HIGH |
| **Firestore collections** / data schema | [doc/quick-reference.md](doc/quick-reference.md) → §1 Data Model | HIGH |
| **Footer.jsx** / Navbar.jsx / shared layout | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) → §2.1.4 | LOW |
| **Functions** / Cloud Functions / `createRazorpayOrder` / `verifyRazorpayPayment` / `razorpayWebhook` | [doc/04-donations-fundraising-module.md](doc/04-donations-fundraising-module.md) → §2.1.4 | HIGH |

### G
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **Gallery** / `/gallery` / GalleryPage / GalleryGrid / GalleryManagement / `gallery` collection | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) | HIGH |
| **GalleryCard.jsx** / GalleryForm.jsx / GalleryItemCard | [doc/05-admin-content-management-module.md](doc/05-admin-content-management-module.md) → §2.1.4 | HIGH |
| **governor limits** / performance / cache strategy | [doc/quick-reference.md](doc/quick-reference.md) → §5 Errors | MEDIUM |

### H
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **Hooks** / React Query hooks / `useFirebaseQueries` / custom hooks | [doc/quick-reference.md](doc/quick-reference.md) → §2 Hooks | HIGH |
| **HomePage.jsx** / homepage / hero / counters | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) → §2.1.4 | HIGH |

### I — J
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **Image upload** / Firebase Storage / `imageUploadService` | [doc/quick-reference.md](doc/quick-reference.md) → §2 Services | HIGH |
| **ImageUpload.jsx** | [doc/05-admin-content-management-module.md](doc/05-admin-content-management-module.md) → §2.1.4 | MEDIUM |

### M
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **Maintenance mode** / Realtime Database killswitch / `MaintenancePage.jsx` | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) → §2.1.2 FR-PI-04 | HIGH |
| **Media page** / `/media` / MediaPage / news / videos | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) | HIGH |
| **Modal** / common/Modal.jsx / shared modal component | [doc/quick-reference.md](doc/quick-reference.md) → §3 Components | MEDIUM |

### N
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **Navbar** / navigation / routing | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) → §2.1.4 | MEDIUM |
| **news** collection / press coverage | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) | MEDIUM |
| **NotificationContext** / notifications / toast | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) | MEDIUM |
| **NotFoundPage** / 404 | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) → §2.1.2 FR-PI-02 | LOW |

### P
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **Payment** / Razorpay / `razorpayService.js` / order / verify | [doc/04-donations-fundraising-module.md](doc/04-donations-fundraising-module.md) → §2.1.1 | HIGH |
| **ProtectedRoute** / auth guard / admin protection | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) → §2.1.2 FR-PI-03 | HIGH |
| **Public routes** / public pages / unauthenticated access | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) → §2.1.2 FR-PS-01 | HIGH |

### Q
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **queryClient** / React Query / stale time / cache invalidation | [doc/quick-reference.md](doc/quick-reference.md) → §2 Hooks | HIGH |
| **QUERY_KEYS** / query key constants | [doc/quick-reference.md](doc/quick-reference.md) → §2 Hooks | HIGH |

### R
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **Razorpay** / payment gateway / `createRazorpayOrder` | [doc/04-donations-fundraising-module.md](doc/04-donations-fundraising-module.md) | HIGH |
| **React Hook Form** / form validation / yup | [doc/quick-reference.md](doc/quick-reference.md) → §3 Components | MEDIUM |
| **React Query** / `@tanstack/react-query` / `useQuery` / `useMutation` | [doc/quick-reference.md](doc/quick-reference.md) → §2 Hooks | HIGH |
| **routes** / route map / `App.jsx` | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) → §2.1.4 | HIGH |

### S
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **sanitization** / XSS / input sanitize / `sanitization.js` | [doc/quick-reference.md](doc/quick-reference.md) → §5 Errors / Security | HIGH |
| **SEO** / `SEO.jsx` / meta tags / JSON-LD / react-helmet-async | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) → §2.1.2 FR-PS-05 | HIGH |
| **Stories** / success stories / testimonials / `successStories` / `testimonials` collections | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) | HIGH |
| **StoriesTestimonialsManagement.jsx** | [doc/05-admin-content-management-module.md](doc/05-admin-content-management-module.md) | HIGH |
| **Storage** / Firebase Storage / file upload / image | [doc/quick-reference.md](doc/quick-reference.md) → §2 Services | HIGH |

### T
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **Team** / `/team` / TeamPage / TeamManagement / `team` collection | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) | HIGH |
| **Tailwind** / CSS / styling / responsive | [doc/quick-reference.md](doc/quick-reference.md) → §4 Environment | MEDIUM |
| **Testimonials** / `testimonials` collection | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) | HIGH |

### U — V
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **upcoming events** / `useUpcomingEvents` / event date filter | [doc/02-events-module.md](doc/02-events-module.md) → §2.1.2 FR-EV-02 | HIGH |
| **useFirebaseQueries.js** / hook file | [doc/quick-reference.md](doc/quick-reference.md) → §2 Hooks | HIGH |
| **useFirestore.js** / `useCRUD.js` | [doc/quick-reference.md](doc/quick-reference.md) → §2 Hooks | HIGH |
| **validators.js** / form validation | [doc/quick-reference.md](doc/quick-reference.md) → §6 Utils | MEDIUM |
| **videos** collection / video gallery | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) | MEDIUM |
| **Vite** / build tool / `vite.config.js` | [doc/quick-reference.md](doc/quick-reference.md) → §4 Environment | MEDIUM |
| **Volunteer** / `/volunteer` / VolunteerManagement / `volunteers` collection | [doc/03-community-engagement-module.md](doc/03-community-engagement-module.md) | HIGH |

### W — Z
| Keyword | File → Section | Confidence |
|---------|---------------|------------|
| **webhook** / Razorpay webhook / `razorpayWebhook` Cloud Function | [doc/04-donations-fundraising-module.md](doc/04-donations-fundraising-module.md) → §2.1.4 | HIGH |

---

## FIRESTORE COLLECTION → MODULE MAP

| Collection Name | Owner Module | Primary Doc |
|-----------------|-------------|-------------|
| `events` | M-02 Events | [doc/02-events-module.md](doc/02-events-module.md) |
| `volunteers` | M-03 Community | [doc/03-community-engagement-module.md](doc/03-community-engagement-module.md) |
| `branches` | M-03 Community | [doc/03-community-engagement-module.md](doc/03-community-engagement-module.md) |
| `donations` | M-04 Donations | [doc/04-donations-fundraising-module.md](doc/04-donations-fundraising-module.md) |
| `donors` | M-04 Donations | [doc/04-donations-fundraising-module.md](doc/04-donations-fundraising-module.md) |
| `gallery` | M-01 Public / M-05 Admin | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) |
| `successStories` | M-01 Public / M-05 Admin | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) |
| `testimonials` | M-01 Public / M-05 Admin | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) |
| `blogs` | M-01 Public / M-05 Admin | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) |
| `team` | M-01 Public / M-05 Admin | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) |
| `awards` | M-01 Public / M-05 Admin | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) |
| `news` | M-01 Public | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) |
| `videos` | M-01 Public | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) |
| `config/maintenanceMode` | M-06 Infrastructure | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) |

---

## CROSS-REFERENCE MATRIX (Topic → Multiple Files)

| User Intent | Primary File | Secondary File |
|-------------|-------------|----------------|
| "Add/change donation feature" | [doc/04-donations-fundraising-module.md](doc/04-donations-fundraising-module.md) | [doc/quick-reference.md](doc/quick-reference.md) → `donations`, `donors` |
| "Add/change events feature" | [doc/02-events-module.md](doc/02-events-module.md) | [doc/quick-reference.md](doc/quick-reference.md) → `events` |
| "Add/change volunteer flow" | [doc/03-community-engagement-module.md](doc/03-community-engagement-module.md) | [doc/quick-reference.md](doc/quick-reference.md) → `volunteers` |
| "Modify admin dashboard" | [doc/05-admin-content-management-module.md](doc/05-admin-content-management-module.md) | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) |
| "Change gallery or media" | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) | [doc/05-admin-content-management-module.md](doc/05-admin-content-management-module.md) |
| "Authentication or protected routes" | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) | — |
| "Performance or caching" | [doc/quick-reference.md](doc/quick-reference.md) → §5 | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) |
| "SEO change" | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) → FR-PS-05 | [doc/quick-reference.md](doc/quick-reference.md) |
| "Deployment / hosting / env vars" | [doc/quick-reference.md](doc/quick-reference.md) → §4 | [doc/06-platform-infrastructure-auth-module.md](doc/06-platform-infrastructure-auth-module.md) |
| "Blog feature" | [doc/05-admin-content-management-module.md](doc/05-admin-content-management-module.md) | [doc/01-public-storytelling-module.md](doc/01-public-storytelling-module.md) |

---

## 7. AGENT OPERATION RULES

### 7.1 Your Role

You are a **development assistant** for the Dada Chi Shala NGO website. Your job is to produce correct, maintainable code, feature requirements, or technical guidance that developers can directly use. Every claim about the system must be traceable to a document in this Knowledge Base.

### 7.2 Mandatory Retrieval Sequence

```
STEP 1 → Read INDEX.md (this file)
          Identify target module by keyword
          
STEP 2 → Read the target doc/0N-*.md module file
          Extract: requirements, component structure, data flow, accepted field names
          
STEP 3 → Cross-reference doc/quick-reference.md
          Validate: collection names, field names, hook names, service method signatures
          
STEP 4 → If topic is NOT covered → FLAG to user:
          "Documentation for [topic] is not available in this KB."
```

### 7.3 Anti-Hallucination Rules

| Rule | Detail |
|------|--------|
| **R1: No invented collections** | Only use Firestore collection names documented in `doc/quick-reference.md` §1 |
| **R2: No invented fields** | Only reference field names documented in the data model |
| **R3: No invented hooks** | Only use hooks documented in §2 of `doc/quick-reference.md` |
| **R4: No invented routes** | Only use routes documented in `doc/06-platform-infrastructure-auth-module.md` |
| **R5: No invented service methods** | Only call methods documented in `doc/quick-reference.md` §2 Services |
| **R6: Cite your source** | Every technical claim must reference a KB file and section |
| **R7: Flag uncertainty** | If the KB doesn't cover a topic, say so explicitly |

### 7.4 Salesforce / Firebase Naming Conventions

- Firestore collection names: lowercase plural (e.g., `events`, `volunteers`)
- React components: PascalCase
- Hooks: camelCase starting with `use`
- Service functions: camelCase (`addEvent`, `updateGalleryItem`)
- Environment variables: `VITE_FIREBASE_*` prefix for client, no prefix for server Functions

### 7.5 Common Pitfalls to Avoid

| Pitfall | Correct Approach |
|---------|-----------------|
| Writing Firestore writes without cache invalidation | Always call `queryClient.invalidateQueries` after mutations |
| Assuming admin logic is server-enforced | Admin authorization is currently client-side via Firebase Auth (route level) |
| Adding synchronous Firestore operations in render | Firestore reads must use React Query hooks, never direct reads in component body |
| Forgetting to sanitize user input | All user-submitted text must pass through `sanitization.js` utilities |
| Hardcoding payment amounts | Donation categories and amounts come from component state/config, not hardcoded values |
| Assuming email is reliable | Email failures (EmailJS / Cloud Function) must never block successful data writes |

---

## 8. ROUTE MAP

| Route | Page Component | Auth Required | Module |
|-------|---------------|--------------|--------|
| `/` | `HomePage.jsx` | No | M-01 |
| `/about` | `AboutPage.jsx` | No | M-01 |
| `/gallery` | `GalleryPage.jsx` | No | M-01 |
| `/team` | `TeamPage.jsx` | No | M-01 |
| `/media` | `MediaPage.jsx` | No | M-01 |
| `/events` | `EventsPage.jsx` | No | M-02 |
| `/branches` | `BranchesPage.jsx` | No | M-03 |
| `/volunteer` | `VolunteerPage.jsx` | No | M-03 |
| `/donate` | `DonatePage.jsx` | No | M-04 |
| `/contact` | `ContactPage.jsx` | No | M-01 |
| `/admin` | `AdminLogin.jsx` | No | M-06 |
| `/admin/dashboard` | `AdminDashboard.jsx` | **Yes** | M-05 |
| `*` | `NotFoundPage.jsx` | No | M-06 |
