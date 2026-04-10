# Wedora - AI Handover Document

**Target Audience:** Future Developers & AI Coding Assistants
**Purpose:** Provide comprehensive context, architectural decisions, database schemas, and specific tech-stack quirks necessary to successfully extend or debug the Wedora application without breaking existing functionality.

---

## 1. Project Overview
**Name:** Wedora
**Description:** A premium, mobile-responsive wedding planning platform. It allows users to manage budgets, guests, timelines, vendors, and tasks. It also features a built-in SEO-optimized blog module acting as the public-facing inbound marketing engine.
**Core Philosophy:** 
- Glassmorphic, highly aesthetic tailwind design (colors: `rose-gold`, `plum`, `blush`, `ivory`).
- Optimistic UI updates (instant local state changes synced asynchronously to the DB).

---

## 2. Tech Stack & Critical Quirks
- **Framework:** React 19.1.0 
- **Bundler:** Vite 8.0.3
- **Styling:** Tailwind CSS v4.2.2 (Using the new Vite plugin: `@tailwindcss/vite`)
- **Routing:** React Router v7 (`react-router-dom`)
- **Backend/Auth:** Supabase (`@supabase/supabase-js` v2.101.1)
- **Deployment Build:** Vercel (Configured via `vercel.json` for client-side routing)
- **Icons:** `lucide-react`
- **Markdown (Blog):** `react-markdown` + `remark-gfm`
- **Mobile Wrapper:** Capacitor v8

⚠️ **CRITICAL AI INSTRUCTIONS / QUIRKS:**
1. **Vite 8 & React Ecosystem:** The project specifically uses `@vitejs/plugin-react-swc`. Do NOT install `@vitejs/plugin-react` (Babel) as it has compatibility issues with Vite 8's newer Rolldown engine and causes the app to throw "Invalid options / jsx" errors.
2. **Tailwind v4:** Uses CSS-based configuration inside `src/index.css`. There is no `tailwind.config.js`. Do not generate one. Use generic class utilities or CSS variables based on existing conventions.
3. **Optimistic Context Sync:** The application state heavily relies on `src/context/AppContext.jsx`. It uses an internal `useReducer` to manipulate data instantly on the UI, and a custom `useCallback` dispatch that synchronizes with Supabase *in the background*.

---

## 3. Database Schema (Supabase PostgreSQL)

All tables rely on Row Level Security (RLS) linked to `auth.users`. 

### `weddings`
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary Key |
| `user_id` | uuid | Foreign Key to auth.users |
| `partner1` | text | |
| `partner2` | text | |
| `wedding_date` | timestamp | |
| `location` | text | |
| `wedding_style` | text | Hindu, Christian, etc. |
| `total_budget` | numeric | Used for auto-allocating category percentages |
| `whatsapp_template` | text | |

*(Note: Almost all user sub-tables map back to this `wedding_id` via a Foreign Key)*

### Sub-tables
- **`guests`**: `id`, `wedding_id`, `name`, `phone`, `email`, `category`, `rsvp`, `plus_one`, `notes`, `table_number`
- **`budget_categories`**: `id`, `wedding_id`, `name`, `icon`, `color`, `allocated`
- **`expenses`**: `id`, `wedding_id`, `category_id`, `name`, `amount`, `date`
- **`tasks`**: `id`, `wedding_id`, `title`, `notes`, `due_date`, `status`
- **`timeline_events`**: `id`, `wedding_id`, `name`, `start_time`, `date`, `venue`, `notes`
- **`vendors`**: `id`, `wedding_id`, `category`, `name`, `contact_person`, `phone`, `email`, `quoted_amount`, `advance_paid`, `next_payment_date`, `notes`, `status`
- **`inspirations`**: `id`, `wedding_id`, `title`, `image_url`, `category`, `notes`

### `blogs` (Public Access & Admin Controlled)
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `title` | text | |
| `slug` | text | UNIQUE, used for `/blog/:slug` routing |
| `content` | text | Markdown format |
| `excerpt` | text | |
| `featured_image`| text | Image URL string |
| `tags` | text | Comma-separated |
| `meta_title` | text | SEO Optimization |
| `meta_description`| text| SEO Optimization |
| `status` | text | 'draft' or 'published' |

---

## 4. Architectural Patterns

### Authentication & Access Control List (ACL)
- Handled in `AuthContext.jsx`.
- **RBAC Strategy:** If `user_metadata.role === 'admin'` OR `email === 'admin@wedora.in'`, `isAdmin` becomes true. 
- **Route Guards:** Located in `App.jsx`.
  - `<ProtectedRoute>`: Prevents access if logged out.
  - `<OnboardedRoute>`: Prevents access to Dashboard if `weddings` table doesn't have an entry for user.
  - `<AdminRoute>`: Redirects to dashboard if `!isAdmin`.
  - `<PublicRoute>`: Redirects logged-in users away from auth pages (Login/Signup).

### Application State & Supabase Hydration
- **Data Flow:** `AppContext.jsx` executes a monolithic parallel Supabase fetch via `Promise.all` on initialization.
- **Fail-safe Auto-Repair:** If `budget_categories`, `tasks`, or `events` fetch empty (e.g. legacy DB corruption), the `loadSupabaseData` function automatically re-seeds them using `src/data/templates.js`, repairing the DOM.

### Versioning & Caching Strategy
- **`versionCheck.js`**: Re-evaluates `APP_VERSION` on hard load. If mismatched:
  1. Purges local `wedora_*` storage.
  2. Purges `sb-` auth session storage.
  3. Purges Service Worker cache and reloads.
- **Loading Watchdog**: Wraps the `<AppProvider>` in `App.jsx`. If Supabase DB sync freezes or hangs over 6000ms, it presents a Fallback UI that offers localized emergency cache-clearing to prevent the "White Screen of Death".

## 5. Environment Specifics

Create a `.env` file at the project root for local development.
*(If `.env` is absent, `src/lib/supabase.js` implements a placeholder fallback to prevent initial compilation panics, but DB functions will fail).*

```env
VITE_SUPABASE_URL=YOUR_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_API_KEY
```

## 6. How to Extend (AI Prompting Guide)
When asked to build new features:
1. **Frontend additions:** Use `lucide-react` for graphics. Always lean on existing tailwind variables in `index.css`.
2. **Database additions:** 1) Provide the raw SQL to the user to execute in Supabase, 2) update the backend `useCallback` dispatch inside `AppContext.jsx` to map payload to DB snake_case columns.
3. **New Admin Features:** Ensure they are exclusively encapsulated under `/admin/*` routes wrapped explicitly in `<AdminRoute>`.
