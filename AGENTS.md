# AGENTS.md — Quick Reference for AI Agents

## Before touching any code
1. Read `AI_RULES.md` — no DB changes, no package/env mods without PM approval
2. Feature branch only, PR only, never merge to main
3. Blueprint first: state files, logic, test plan
4. Run `bun run build` before pushing
5. Two failures on same bug → roll back and wait

## Stack
React 19 + Vite + Tailwind CSS v4. Supabase (auth/DB/storage/Realtime). Stripe, Resend, Tesseract.js, PostHog, Capacitor. Hosted on Vercel with serverless functions in `/api/`.

## Architecture
Offline-first SPA. localStorage is primary store, Supabase is cloud sync. Custom event-based routing in `App.jsx` — no React Router. Two-way sync on login (push local then pull cloud).

## Data layer
`src/data/` — `maintenance-schedules.js` (65+ makes), `fuse-boxes.js`, `symptom-decoder.js`, `jargon-translator.js`, `vin-decoder.js`. See `src/data/README.md`.

## Key gotchas
- localStorage quota can overflow — `sanitizeForStorage()` handles it
- Premium status in `profiles.premium` — hardened, never downgrades
- Service worker auto-updates on version bump
- Empty string → null for date columns before Supabase writes
- Per-table column whitelists for Supabase writes
- Stripe checkout hidden on iOS (App Store compliance)
