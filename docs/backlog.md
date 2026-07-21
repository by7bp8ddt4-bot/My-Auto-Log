# QA Backlog

| ID | Description | Status | Date |
|----|-------------|--------|------|
| QA-001 | SPA routing: vercel.json missing rewrite rules causes 404 on direct URL access to routes like /auth, /dashboard, /vehicles | ✅ Fixed | 2026-07-21 |

**QA-001 Details:**
- **Bug:** Direct URL access to client-side routes (e.g., /auth, /dashboard, /vehicles) returned 404 because vercel.json had no SPA rewrite rule.
- **Root Cause:** vercel.json only had domain redirects; no rewrite rule mapping non-file paths to index.html.
- **Fix:** Added `rewrites` section with a Vercel SPA rewrite pattern that maps all non-file, non-API paths to `/index.html` while preserving direct access to static assets, `auth.html`, `activate-premium.html`, favicon, manifest, sw.js, and API routes.
- **Commit:** Added 2026-07-21.
