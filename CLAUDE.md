# MTXtrkr — Project Conventions

## Stack
- **Frontend:** React 19, Vite, Tailwind CSS v4
- **Backend/DB:** Supabase (auth, PostgreSQL, storage, Realtime)
- **Payments:** Stripe (Express)
- **Email:** Resend (transactional)
- **Analytics:** PostHog
- **Mobile:** Capacitor (iOS)
- **OCR:** Tesseract.js (client-side receipt scanning)
- **Charts:** Recharts
- **PDF:** jsPDF + jspdf-autotable
- **Testing:** Vitest (smoke tests), Playwright (config exists)
- **Hosting:** Vercel (serverless functions in `/api/`)

## Architecture
- **Offline-first SPA:** localStorage is the primary data store; Supabase is the cloud sync layer.
- **Custom routing:** Event-based routing in `App.jsx` — no React Router. Components render based on a `currentPage` state variable.
- **Monorepo layout:** Frontend at root (`src/`), serverless API functions in `/api/`, tests in `__tests__/`.
- **Data flow:** `useLocalStorage` hook reads/writes localStorage; `useSupabaseData` hook handles Supabase sync (push/pull). Two-way sync on login (push local → pull cloud).
- **Auth:** Supabase Auth with email/password, Google OAuth, Apple OAuth. `AuthPage.jsx` handles the UI.

## Key Conventions
- **Feature branches only.** Never commit directly to `main`. All changes go through feature branches and PRs.
- **Do NOT merge to main.** PRs are reviewed and merged by the team lead.
- **Follow `AI_RULES.md` strictly.** No DB schema changes, no `package.json` or `vercel.json` modifications without PM approval. No npm package installs/upgrades to fix bugs.
- **Run `bun run build` before pushing.** Build must pass.
- **Blueprint before code.** Before any code change, provide a 3-point plan: files touched, logic change, test checklist.
- **Two consecutive failures on the same bug → roll back and wait for human instruction.**

## Data Layer (`src/data/`)
All vehicle data is in JavaScript/JSON modules. See `src/data/README.md` for full format docs.

| File | Purpose |
|------|---------|
| `maintenance-schedules.js` | 65+ manufacturer maintenance intervals + fluid specs + tire pressures + lookup helpers |
| `fuse-boxes.js` | Fuse box locations + fuse/relay indexes (14 vehicles across 7 makes) |
| `symptom-decoder.js` / `.json` | Free-text symptom matching → likely causes with severity/urgency/cost |
| `jargon-translator.js` / `.json` | 40+ mechanic terms → plain English |
| `vin-decoder.js` / `.json` | VIN validation, WMI decoding, model year lookup |

## Testing
- **Vitest:** Smoke tests in `__tests__/smoke/` — `bun run test:smoke`
- **Gate test:** `bun run test:gate` — data integrity gate
- **Playwright config:** exists but not actively used in CI
- **QA smoke tests:** QA Engineer runs manual smoke tests against Vercel preview deployments using browser automation

## Common Gotchas
- **localStorage quota:** Can be exceeded. The app warns the user via `sanitizeForStorage()` with cycle detection and base64 regex cleaning.
- **Sync is two-way on login:** Push local data to Supabase first, then pull cloud data down. Timestamps preserved across all sync paths.
- **Premium status:** Stored in `profiles.premium` column. Hardened persistence — never downgrades from a failed DB query, retries on auth sign-in.
- **Service worker:** Auto-updates on version bump (currently v5). Bump the version in the SW config when making caching changes.
- **Supabase Realtime:** Cross-tab sync — Realtime changes propagate to localStorage across open tabs.
- **Empty string → null:** Date columns need empty string → null conversion before Supabase writes.
- **Per-table column whitelists:** Sync only writes whitelisted columns to Supabase to prevent app-only fields from breaking sync.
- **iOS/App Store:** Stripe checkout redirects must be hidden on iOS. Premium activation supports URL parameters (`?activate=premium`, `?restore-premium=1`).
