# CLAUDE.md

Context for Claude Code (or any AI agent) working in this repository.

## Project

Personal portfolio website for Vishnu Vijayakumar, built with Next.js. Projects
are stored in Supabase and manageable through a password-protected admin
portal at `/admin`.

- Framework: Next.js (App Router), on Next.js 16 (uses the `proxy.ts` convention, not `middleware.ts`)
- Language: TypeScript
- Styling: Tailwind CSS v4
- Database: Supabase (Postgres) — project ref `lyehiinchmdzcysmfsau`
- Linting: ESLint (eslint-config-next)

## Structure

- `src/app/page.tsx` — assembles the page from section components
- `src/app/layout.tsx` — root layout, fonts, metadata
- `src/app/globals.css` — Tailwind import and theme tokens (light/dark via `prefers-color-scheme`)
- `src/components/Hero.tsx` — hero section with name + tagline
- `src/components/About.tsx` — about me section
- `src/components/Projects.tsx` — public projects grid; async Server Component that reads from the `projects` table via `supabasePublic` (anon key, RLS-restricted to `select`)
- `src/components/Contact.tsx` — contact form (name, email, message); client component, currently simulates submission locally (no backend wired up)
- `src/components/Footer.tsx` — site footer
- `src/lib/supabase.ts` — exports `supabasePublic` (anon key, safe anywhere) and `getSupabaseAdmin()` (service role key, **server-only**, bypasses RLS)
- `src/lib/admin-auth.ts` — shared-password session helpers (cookie-based, see Admin portal below)
- `src/proxy.ts` — Next.js proxy (formerly "middleware") that gates all `/admin/*` routes except `/admin/login`
- `src/app/admin/login/` — login page + server action, checks `ADMIN_PASSWORD` and sets the session cookie
- `src/app/admin/page.tsx` — admin dashboard: lists projects, add/edit/delete
- `src/app/admin/actions.ts` — server actions for create/update/delete/logout, all re-check auth and use `getSupabaseAdmin()`
- `src/app/admin/ProjectRow.tsx`, `NewProjectForm.tsx` — client components for the edit/add forms
- `supabase/schema.sql` — DDL for the `projects` table + RLS policy + seed data; already run against the live project, kept here as the source of truth for the schema

## Admin portal

- Auth model: a single shared password (`ADMIN_PASSWORD` env var), not per-user Supabase Auth accounts.
- On login, the server action compares the submitted password to `ADMIN_PASSWORD` and, if it matches, sets an `admin_session` cookie whose value is `ADMIN_SESSION_SECRET` (httpOnly, sameSite=lax, 7-day expiry).
- `src/proxy.ts` runs on every `/admin/*` request and redirects to `/admin/login` unless the cookie matches `ADMIN_SESSION_SECRET`. This check is a plain string comparison (not HMAC) specifically so it can run in the Edge runtime, which doesn't have Node's `crypto`.
- Server actions in `actions.ts` also call `isAdminAuthenticated()` themselves before touching the database — defense in depth in case an action is invoked directly.
- All admin writes go through `getSupabaseAdmin()` (service role key), never the anon key — the `projects` table has no insert/update/delete RLS policy for `anon`/`authenticated`, so writes are only possible server-side.

## Database

`projects` table (see `supabase/schema.sql`):

| column | type | notes |
|---|---|---|
| `id` | uuid | PK, default `gen_random_uuid()` |
| `title` | text | required |
| `description` | text | required |
| `tags` | text[] | default `{}` |
| `link` | text | default `'#'` |
| `sort_order` | integer | controls display order, ascending |
| `created_at` | timestamptz | default `now()` |

RLS is enabled with a single `select`-only public policy. Any future schema
change should be added to `supabase/schema.sql` and run manually in the
Supabase SQL Editor — there's no migration tooling wired up.

## Conventions

- Each page section is its own component under `src/components/`, composed in `src/app/page.tsx`.
- Styling is done inline with Tailwind utility classes — no CSS modules or styled-components.
- Dark mode follows system preference (`dark:` variants + `prefers-color-scheme` in `globals.css`), no manual toggle.
- Anchors (`#about`, `#projects`, `#contact`) are used for in-page navigation from the hero CTAs.
- `Projects.tsx` and `admin/page.tsx` call `revalidatePath` after mutations so the static-ish Server Components pick up fresh data without a full rebuild.

## Environment variables

Defined in `.env.local` (gitignored; see `.env.example` for the shape):

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL, safe to expose
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key, safe to expose (RLS limits it to reads)
- `SUPABASE_SERVICE_ROLE_KEY` — full-access key, **server-only**, never import into a Client Component
- `ADMIN_PASSWORD` — the shared admin login password
- `ADMIN_SESSION_SECRET` — random secret used as the session cookie's value

## Known gaps / next steps

- The contact form does not send anywhere yet — `Contact.tsx` just flips local state to show a "thanks" message on submit. To make it functional, wire it to an API route (e.g. `src/app/api/contact/route.ts`) or a third-party form service (Formspree, Resend, etc.), and add real client + server-side validation.
- Admin auth is a single shared password with no rate limiting or lockout — fine for one owner, not appropriate if more admins are added later (switch to Supabase Auth at that point).
- Delete in the admin UI uses a native `confirm()` dialog, which browser-automation tools tend to auto-dismiss — this is expected, not a bug, if you see delete "not working" under automated testing.
- No test suite has been set up.

## Commands

```bash
npm run dev     # start dev server
npm run build   # production build
npm run lint    # run ESLint
```
