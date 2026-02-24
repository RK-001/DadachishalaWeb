# Dada Chi Shala Website

A modern, full-featured NGO website for **Educare (Dada Chi Shala) Education Trust** — a Pune-based organization providing free quality education to street and underprivileged children across Maharashtra.

Built with React 18, Vite, Tailwind CSS, and Firebase.

---

## Features

### Public Pages
| Page | Description |
|------|-------------|
| **Home** | Hero slider, animated impact counters, events carousel, success stories, testimonials, awards |
| **About** | Origin story, vision & mission, focus areas, impact stats |
| **Branches** | Branch locations with hero slider and details panel |
| **Team** | Founders, core team, volunteers with social links |
| **Gallery** | Photo gallery, video gallery, blogs, awards — with lightbox modals |
| **Events** | Event listing with status badges, date/time, location, Google Maps links |
| **Donate** | Razorpay online payment + manual bank transfer with QR code & receipt upload |
| **Volunteer** | Multi-step registration form (4 steps) with email confirmation |
| **Contact** | Contact form (EmailJS), contact info cards, Google Maps embed |
| **Media** | News/press coverage, video embeds, awards & recognitions |

### Admin Dashboard
- Secure Firebase Auth login (`/admin`)
- **Responsive sidebar** with mobile hamburger toggle
- Management panels for: Events, Gallery, Blogs, Branches, Team, Stories/Testimonials, Volunteers, Donations

### Technical Features
- **Code splitting** — React.lazy + Suspense for all page routes
- **Error boundary** — graceful error handling with retry
- **Scroll-to-top** on route changes
- **404 page** with helpful navigation links
- **Maintenance mode** — toggled via Firebase Realtime Database
- **SEO** — per-page meta tags and JSON-LD structured data via react-helmet-async
- **Caching** — dual-layer (memory + localStorage) cache wrapping Firebase calls
- **React Query** — centralized data fetching with 5-min stale time
- **Input sanitization** — XSS prevention on all user inputs
- **Responsive design** — mobile-first with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18.2 + Vite 7 |
| Styling | Tailwind CSS 3.3 |
| Routing | react-router-dom 6.15 (v7 future flags) |
| State/Data | @tanstack/react-query 5, React Context |
| Forms | react-hook-form + @hookform/resolvers + yup |
| Animation | framer-motion |
| Icons | lucide-react |
| Database | Firebase Firestore |
| Auth | Firebase Authentication (email/password) |
| Storage | Firebase Storage |
| Realtime | Firebase Realtime Database (maintenance mode) |
| Cloud Functions | Firebase Functions (Razorpay, emails) |
| Analytics | Firebase Analytics |
| Payments | Razorpay |
| Email | emailjs-com (client-side) + Firebase Functions (server-side) |
| SEO | react-helmet-async |

---

## Project Structure

```
src/
├── App.jsx                    # Root: routing, providers, maintenance mode
├── main.jsx                   # Entry point: React DOM render
├── index.css                  # Tailwind + custom animations & utilities
│
├── pages/                     # Route-level components (lazy-loaded)
│   ├── HomePage.jsx           # Hero, counters, events, stories, awards
│   ├── AboutPage.jsx          # Mission, vision, impact stats
│   ├── BranchesPage.jsx       # Branch cards + hero slider
│   ├── TeamPage.jsx           # Team members grid
│   ├── GalleryPage.jsx        # Photos, videos, blogs, awards
│   ├── EventsPage.jsx         # Events list with React Query
│   ├── DonatePage.jsx         # Razorpay + manual payment
│   ├── VolunteerPage.jsx      # 4-step registration form
│   ├── ContactPage.jsx        # Contact form + map
│   ├── MediaPage.jsx          # News, videos, awards
│   ├── AdminLogin.jsx         # Firebase Auth login
│   ├── AdminDashboard.jsx     # Admin panel with sidebar
│   ├── MaintenancePage.jsx    # Maintenance mode screen
│   └── NotFoundPage.jsx       # 404 error page
│
├── components/                # Shared UI components
│   ├── Navbar.jsx             # Responsive nav with mobile menu
│   ├── Footer.jsx             # Site footer with links & social
│   ├── ErrorBoundary.jsx      # React error boundary
│   ├── ScrollToTop.jsx        # Scroll restoration on navigation
│   ├── SEO.jsx                # Helmet meta tags + JSON-LD
│   ├── ProtectedRoute.jsx     # Auth guard for admin routes
│   ├── AnimatedCounter.jsx    # Number counting animation
│   ├── Card.jsx               # Reusable card component
│   ├── EventCard.jsx          # Event display card
│   ├── common/                # Button, FormInput, Modal, LoadingSpinner
│   ├── gallery/               # GalleryFormModal, GalleryItemCard
│   ├── stories/               # StoryTestimonialCard, StoryTestimonialFormModal
│   └── team/                  # TeamMemberCard, TeamMemberFormModal
│
├── services/                  # External service integrations
│   ├── firebase.js            # Firebase app init + service exports
│   ├── cachedDatabaseService.js # CRUD operations with cache layer
│   ├── cacheService.js        # Dual-layer cache (memory + localStorage)
│   ├── razorpayService.js     # Razorpay payment integration
│   ├── emailService.js        # EmailJS client-side emails
│   └── imageUploadService.js  # Firebase Storage uploads
│
├── hooks/                     # Custom React hooks
│   ├── useFirebaseQueries.js  # React Query hooks for all collections
│   ├── useCRUD.js             # Generic CRUD mutation hooks
│   └── useFirestore.js        # Low-level Firestore hook
│
├── context/                   # React Context providers
│   ├── AuthContext.jsx        # Firebase Auth state
│   └── NotificationContext.jsx # Toast notifications
│
├── config/
│   ├── colors.js              # Color system configuration
│   └── queryClient.jsx        # React Query client config
│
└── utils/
    ├── sanitization.js        # XSS prevention (sanitizeString, sanitizeUrl, etc.)
    ├── validators.js          # Form validation + re-exports from sanitization
    ├── helpers.js             # formatDate, formatCurrency, truncateText, etc.
    ├── formatters.js          # Additional formatting utilities
    ├── colorUtils.js          # Color manipulation
    ├── logger.js              # Logging utility
    └── adminSetup.js          # Admin account setup
```

---

## Setup

### Prerequisites
- Node.js v20.19+ or v22.12+
- Firebase project
- EmailJS account (optional, for contact form)
- Razorpay account (optional, for online payments)

### Installation

```bash
# Clone and install
git clone <repository-url>
cd dadachishala-website
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_rtdb_url

# EmailJS
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_USER_ID=your_user_id

# Razorpay
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

### Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database**
3. Enable **Authentication** (Email/Password provider)
4. Enable **Storage**
5. Enable **Realtime Database** (for maintenance mode flag)
6. Deploy Cloud Functions from the `functions/` directory

### Running

```bash
# Development
npm run dev

# Production build
npm run build

# Deploy to Vercel
vercel deploy
```

---

## Firestore Collections

| Collection | Key Fields |
|-----------|------------|
| `events` | event_name, description, event_date, location, imageURL, status |
| `branches` | branch_name, description, imageURL, location |
| `gallery` | title, imageURL, category, description |
| `successStories` | name, story, imageURL |
| `testimonials` | name, testimonial, role, imageURL |
| `blogs` | title, content, imageURL, category, createdAt |
| `awards` | title, description, imageURL, year |
| `news` | title, source, imageURL, publishedAt |
| `videos` | title, youtubeUrl, description |
| `donors` | firstName, lastName, email, phoneno, amount, status, screenshotURL |
| `contact` | first_name, last_name, email, phoneno, skills, availability, status |
| `teamMembers` | name, role, bio, imageURL, socialLinks |

---

## Deployment

### Vercel (configured)
The project includes `vercel.json` with SPA rewrites. Push to your Git repo and connect to Vercel.

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

