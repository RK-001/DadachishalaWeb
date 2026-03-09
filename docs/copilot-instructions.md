# Copilot Instructions — Dada Chi Shala Website

> **Purpose:** Defines HOW AI agents and Copilot should operate in this repository. Domain knowledge lives in the Knowledge Base files — this file governs *behavior*.  
> **Organization:** Educare (Dada Chi Shala) Educational Trust  
> **Last Updated:** 2026-03-09

---

## 1. KNOWLEDGE BASE NAVIGATION

### File Map

```
(repo root)/
├── README.md                        ← Project overview + agent entry point
├── INDEX.md                         ← MASTER NAVIGATION — keyword map + agent rules
│
doc/
├── 01-public-storytelling-module.md ← Homepage, About, Gallery, Team, Media
├── 02-events-module.md              ← Events listing + admin CRUD
├── 03-community-engagement-module.md← Volunteers + Branches
├── 04-donations-fundraising-module.md← Razorpay + Cloud Functions + donor records
├── 05-admin-content-management-module.md ← Admin dashboard + all CRUD screens
├── 06-platform-infrastructure-auth-module.md ← Auth, routing, Firebase setup, maintenance mode
└── quick-reference.md               ← Data model, hooks, services, env vars, errors
```

### Retrieval Protocol (Mandatory)

Before answering any domain question or generating code, follow this sequence:

1. **Read `INDEX.md`** — find the file(s) relevant to the topic using keyword lookup.
2. **Read the identified module file** — extract requirements, component structure, and field names.
3. **Cross-reference `doc/quick-reference.md`** — validate collection names, field names, hook signatures, service methods.
4. **If topic is not covered** — state this explicitly. Never fill gaps with assumptions.

**Never answer domain questions from general knowledge alone.**

### File Priority (Token Optimization)

| Priority | File | When to Read |
|----------|------|-------------|
| 1 (Always) | `INDEX.md` | Every interaction — navigation + agent rules + route map |
| 2 (Always) | Target module `doc/0N-*.md` | Identified by keyword match |
| 3 (Usually) | `doc/quick-reference.md` | Collection names, fields, hooks, env vars, errors |
| 4 (Rare) | Other module docs | Only when topic spans multiple modules |

---

## 2. MANDATORY RULES

### Rule 1: KB-First — No Guessing

- Every technical claim about this codebase must be backed by a KB file.
- If the KB does not cover a topic, say so explicitly — never fill gaps with assumptions.
- When referencing collection names, field names, component names, or method signatures, look them up in the KB first.

### Rule 2: Anti-Hallucination

| What | Rule |
|------|------|
| **Firestore Collection Names** | Must exist in `doc/quick-reference.md` §1, or be explicitly marked as NEW |
| **Firestore Field Names** | Must exist in the data model, or be marked as NEW FIELD PROPOSED |
| **Hook Names** | Must match `useFirebaseQueries.js` exports documented in `doc/quick-reference.md` §2 |
| **Service Methods** | Must match `cachedDatabaseService.js` API documented in `doc/quick-reference.md` §2 |
| **Route Paths** | Must match the route map in `INDEX.md` §8 |
| **Cloud Function Names** | Must be from `doc/04-donations-fundraising-module.md` or `doc/03-community-engagement-module.md` |
| **Component File Names** | Must match the workspace file structure |

### Rule 3: Source Citation

Every technical claim must include a source:
- `[Source: FR-EV-02]` — functional requirement
- `[Source: doc/02-events-module.md §2.1.4]` — module doc
- `[Source: quick-reference.md §1 events collection]` — data model
- `[Source: User-provided]` — information given by user in conversation
- `[Source: PROPOSED]` — new suggestions not yet in KB

### Rule 4: Flag Gaps Immediately

If a topic is not covered in the KB:
> "WARNING: Documentation for **[topic]** is not available in this Knowledge Base. Generating from partial information. Manual validation required."

### Rule 5: React & Firebase Conventions

- Firestore reads must use React Query hooks — never raw Firestore SDK calls in component bodies.
- Mutations must call `queryClient.invalidateQueries` after success.
- User input must be sanitized before writing to Firestore (see `src/utils/sanitization.js`).
- Admin routes must use `ProtectedRoute` — never expose admin UI without auth guard.
- Cloud Function secrets (Razorpay key secret) must stay server-side in `functions/index.js` — never in client.
- Environment variables used in client code must be prefixed `VITE_`.

---

## 3. PROJECT QUICK SUMMARY

**What this is:** A React + Firebase single-page application for an NGO called Dada Chi Shala.

**Business model:** The organization provides free education to underprivileged children. The website serves as:
- A public portal for awareness, storytelling, gallery, team, events, and media.
- A volunteer recruitment portal (4-step form → Firestore → admin review).
- A donation portal (Razorpay online + manual bank transfer → Cloud Functions → donor records + email receipt).
- An admin dashboard for all content CRUD operations.

**Key architectural decisions:**
- One SPA handles both public and admin experiences via route-based code splitting.
- Firebase is the sole infrastructure dependency (Firestore, Auth, Storage, Realtime DB, Functions, Analytics).
- React Query is the data layer — all Firestore reads go through hooks in `useFirebaseQueries.js`.
- `cachedDatabaseService.js` is the Firestore abstraction — all writes go through it.
- Two-layer cache: memory + localStorage via `cacheService.js`.
- Maintenance mode is controlled via Firebase Realtime Database at `config/maintenanceMode`.

---

## 4. CODE QUALITY STANDARDS

When generating or modifying code:

| Concern | Standard |
|---------|----------|
| **Security** | Never expose secrets client-side. Sanitize all user input. Use Firebase Auth for admin. |
| **Data writes** | Always go through `cachedDatabaseService.js` methods, never direct Firestore SDK in components. |
| **Data reads** | Always go through React Query hooks from `useFirebaseQueries.js`. |
| **Forms** | Use react-hook-form + yup validation. |
| **Styling** | Tailwind CSS utility classes. Match existing class patterns. |
| **Mutations** | Invalidate relevant query keys after success. |
| **Errors** | Surface errors in UI state. Email/notification failures must not block data writes. |
| **Code splitting** | New pages should use `React.lazy` + `Suspense`. |
| **Naming** | Components: PascalCase. Hooks: `useXxx`. Services: camelCase functions. |
| **Comments** | Only add comments where logic is non-obvious. No docstrings on every function. |

---

## 5. OUTPUT STANDARDS

All generated code and documents must:
- Use **Markdown** format with clear headings for documents.
- Include **Mermaid diagrams** for process flows where helpful.
- Use **tables** for structured data (requirements, fields, test cases).
- Mark **new/proposed items** with `[PROPOSED]` or `NEW:` prefix.
- List **documentation gaps** explicitly — never hide missing information.
- Follow the **project naming conventions** for files, components, hooks, and collections.

---

## 6. ESCALATION PROTOCOL

Stop and inform the user when:

1. **Missing documentation:** Topic has no KB coverage → cite which KB sections were checked.
2. **Conflicting information:** Two files contradict each other → cite both references.
3. **Out-of-scope request:** Involves infrastructure or integrations not documented → request additional context.
4. **Security risk detected:** User request would expose secrets, bypass auth, or skip input validation → explain the risk and suggest a safe alternative.
