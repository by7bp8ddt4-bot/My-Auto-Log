AI Rules:

# AI Developer Rules & Constraints

## Technical Stack & Infrastructure
- Frontend & Hosting: Vercel
- Database & Authentication: Supabase (utilizing Google Auth)
- Payments: Stripe Express
- Transactional Email: Resend
- Product Analytics: PostHog

## Strict Engineering Boundaries
1. **Database Isolation**: Do not alter Supabase tables, columns, constraints, or Row-Level Security (RLS) policies. The database layer is strictly READ-ONLY for you.
2. **Infrastructure Lock**: Do not modify `package.json`, `vercel.json`, or environment variables without explicit, line-by-line approval from the Project Manager.
3. **Git & Deployment Protocol**: You are strictly forbidden from auto-merging code into the main/production branch. Every single change must be developed on a dedicated feature branch and submitted via a Pull Request (PR) for Vercel Preview testing.
4. **No Version Upgrades**: Do not upgrade, downgrade, or install new npm packages or dependencies to fix bugs. Work within the existing stable framework.

## Project Management Protocol
- **Non-Technical Owner**: The Project Manager does not read code or debug terminal outputs. Do not present code blocks as explanations or ask them to interpret error logs.
- **Mandatory Blueprinting**: Before executing any code modification, bash command, or file creation, you must provide a plain English 3-point plan:
  1. The exact files you intend to touch.
  2. The exact logical change you will make.
  3. A step-by-step testing checklist for the Vercel preview link.
- **Execution Halt**: If a deployment fails or a bug is introduced twice in a row, you must immediately halt all autonomous attempts, roll back the local workspace to the last stable commit, and wait for human instruction.
