# Current Status / Next Steps

> **Living handoff doc — version-controlled.** Updated at the end of each work session so a fresh session (or Replit-side work) can pick up without re-explaining. Newest session-log entry on top. This file is committed and syncs to Replit; deeper design/architecture notes live in `CLAUDE.md`, which is local-only (gitignored) and won't be present on Replit.

## Architecture as of now

A full client/server app (no longer the single-file, in-memory prototype):

- **Frontend** — Vite + React, modular under `src/`: entry `src/main.jsx` → `src/App.jsx` (shell), `src/tabs/` (one file per tab), `src/components/` (profile / skills / prompts / farmer / leadership / chrome), `src/lib/` (domain constants + i18n). The former 3,000-line `employee-app-draft.jsx` is gone (split 2026-06-12).
- **Shape contract** — `src/api.js`'s `adaptEmployee` is the single adapter between backend payloads and the UI. `data/employee.json` now stores **wire-shaped** mock payloads (same JSON as `GET /api/employees/:id`, mirroring `db/002_seed_data.sql`), and mock mode runs them through the same adapter, so mock and live cannot drift silently.
- **Backend** — Express in `backend/`: `server.js`, routes in `backend/routes/` (`auth.js` = Slack OAuth, `employees.js` = employee/skill/request CRUD), `requireAuth` middleware, Postgres via `backend/db.js`.
- **Database** — Postgres. Schema in `db/001_initial_schema.sql`; reference data (stations, curriculum) in `db/002_reference_data.sql`; **fictional** demo employees in `db/003_demo_employees.sql` (opt-in via `SEED_DEMO=true`, never for production). Migrate with `npm run migrate --prefix backend`.
- **Demo vs real data policy** — the five demo profiles (Maria Santos, Diego Reyes, Priya Patel, Carlos Rivera, Jamie Chen) are fictional and live in git (`data/employee.json` + `003_demo_employees.sql`). Real employees are **never committed to the repo**: they get created directly in the production DB (future onboarding UI, or a gitignored one-off import) with real emails and empty progression.
- **Replit** — `.replit` runs Backend (`npm start --prefix backend`, port 3001) and Frontend (`npm run dev`, port 5000, externalPort 80) in parallel. Slack redirect + frontend URL are set in `[userenv.shared]`.

### Run commands
- Frontend only (local, against mock): `VITE_USE_MOCK=true npm run dev` (`VITE_MOCK_ME` picks the logged-in employee, default `emp_001`)
- Frontend (against live backend): `npm run dev` (expects backend on :3001)
- Backend: `npm start --prefix backend` (or `npm run dev --prefix backend` for watch mode)
- DB migrate: `npm run migrate --prefix backend` (schema + reference data only; add `SEED_DEMO=true` for the fictional demo employees)
- Note: on macOS, AirPlay (ControlCenter) squats on port 5000 — Vite auto-bumps to 5001.

### Replit gotchas — Slack login & secrets

Full battle-tested detail lives in [.agents/memory/slack-oauth-public-origin.md](.agents/memory/slack-oauth-public-origin.md); the short version:

- **`SLACK_CLIENT_SECRET` lives in Replit's Secrets pane** (platform env store), never in the repo — `.env*` files are gitignored, so git push/pull can never touch or overwrite it.
- **Replit resets/rollbacks have wiped it before**, together with the frontend's `5000 → externalPort 80` mapping. Symptoms: Slack login fails, and/or the public domain serves a plain-text `Running` page on every path while `localhost:5000` works. Fix: re-add the secret (GUI Secrets tab is the reliable path), re-run `configureWorkflow` for the Frontend (`outputType: webview`, port 5000), then **fully restart** both workflows.
- **Don't trust "secrets have been added" confirmations** — at least once the platform reported success while the store stayed empty. Verify in the Secrets tab, and confirm the running backend actually sees it before debugging anything else.
- **Health check after any port/env/redirect change:** `curl -s -o /dev/null -w '%{http_code} %{redirect_url}' https://$REPLIT_DEV_DOMAIN/auth/slack` → expect a 302 to slack.com. OAuth must be tested in a real browser tab (Slack blocks iframe auth, so it always fails inside the Replit preview).
- **Nobody can log in until an employee row has a real `email`** — demo profiles seed with `NULL` emails by design. Set one with `UPDATE employees SET email='...' WHERE id='...'` (and remember `requireAuth` matching is by Slack identity email).

## Open threads / next steps (agreed 2026-06-12, in priority order)

1. **Server-side authorization** — currently `requireAuth` only checks for a session; every route accepts any employee id, and supervisor mode is a client-side toggle (demo-only, by design — must change before launch). Agreed model:
   - Farmhand / Farmer / Senior Farmer: read **own** profile only, plus submit training/assessment requests **for themselves**.
   - Supervisor / AGM / GM: view all profiles; add/edit skills, suggestions, endorsements; respond to requests.
   - Implementation sketch: `requireSupervisor` middleware (rank check or `is_supervisor` flag) on mutating routes; self-only guard (`:id === session.employeeId`) on employee reads/requests; `GET /employees` supervisor-only.
2. **Fix frozen `TODAY`** (`src/lib/domain.js`, = 2026-05-17) — live data now drifts ~4 weeks; `computeDaysInRole` / cert expiry are wrong and "90+ days in role" is a promotion requirement. Plan: api layer exports the date — frozen in mock mode, real today in live mode.
3. **Single ownership of readiness rules** — 80h threshold lives in `roles.json` *and* hardcoded in SQL (`employees.js` log route); rolling-30-day violation logic exists only client-side. Compute eligibility server-side in one place when building the promotion-readiness / hours-logging mechanisms (both yet to be built).
4. Mechanisms to **update promotion readiness** (stage-progress UI for supervisors) and **log hours** (end-of-day confirmation) — endpoints exist (`PATCH /employees/:id/stage-progress`, `POST /employees/:id/log`), no UI yet.
5. **Production DB hygiene** — the dev database was seeded from the old mixed `002_seed_data.sql` before demo and production data were separated; any dev database predating that split should be dropped and re-created with `SEED_DEMO=true npm run migrate --prefix backend`.
6. `replit-dev` is the active branch; `main` is default. Keep an eye on divergence between local and Replit-side commits.

### Known cosmetic / cleanup items
- `EndorsedSkills` + `SkillChip` (`src/components/skills.jsx`) and `ordinal` (`src/lib/domain.js`) are currently unused — kept through the split; delete or wire up later.
- No favicon → harmless 404 in the browser console.
- Backend 500 handlers return raw `err.message`; Slack `access_token` is persisted but never used after login; sessions use in-memory store (logins drop on every restart — `connect-pg-simple` when convenient).
- `assessments.date` is a display TEXT ("Jan 8") in the DB while other dates are real DATEs — will bite when computing assessment recency server-side.

## Session log

- **2026-06-12 (UI pass)** — **Visual consistency pass.** New `src/components/ui.jsx` defines the shared vocabulary: white cards with a colored left accent bar (green = on track, amber = action needed, red = blocked/expired), one primary button (brand green), one neutral Pending chip, one muted list kicker. Applied across all ranks: the three request prompts, every "Next Step"/focus callout, dev suggestions (emoji dropped), certifications, leadership track cards (all bars green now), My Path lists, request-training card, clean-record badge. Station rings now hide never-worked stations behind a "Not started: …" text line; assessment dots use P/W letters instead of emoji. The old steel-blue/royal-blue/brown button colors are gone. Verified per-rank + mobile + ES via headless Chrome; mutations still work.
- **2026-06-12 (later)** — **Demo/real data separation.** Records carrying real employee names were removed from the repo: `data/employee.json` is now the five fictional profiles only; `002_seed_data.sql` split into `002_reference_data.sql` (stations + curriculum, prod config) and `003_demo_employees.sql` (fictional five, gated behind `SEED_DEMO=true` in `migrate.js` so a production migrate can never create fake records); ONE-PAGER roster updated. Policy going forward: real employees exist only as rows in the production database, never in version control.
- **2026-06-12** — **Repo reorganization (debt paydown before feature work).** Split `employee-app-draft.jsx` (3,001 lines) into 14 modules under `src/` (lib / components / tabs / App.jsx) — byte-for-byte extraction, no behavior change intended. Converted `data/employee.json` to backend wire shape and rewrote mock mode to run through `adaptEmployee` (one shape contract; mock mutations now mimic the Express routes, incl. SQL COALESCE semantics). Adapter fixes that fell out: DATE values normalized to `YYYY-MM-DD` (live Postgres dates serialize as full ISO timestamps and broke `computeDaysInRole`/`isCertExpired`), `practicalPass`/`writtenPass` now derived from assessments (UI read them; adapter never produced them), `promotionReqs`/`training` passthrough made explicit (null in live until backend serves them). Verified: eslint no-undef clean, vite build clean, headless-Chrome smoke test of all five tabs + supervisor mode + employee switcher + assessment-request mutation in mock mode. Synced CLAUDE.md (station ids/colors — canonical id is "Packaging"). Agreed priority order for next sessions captured above.
- **2026-06-11** — Moved discarded drafts (`beanstalk-progression-tracker.jsx`, `daily-board.jsx`, `weekly-planner.jsx`) out of the repo to `../progression-tracker-archive/`; scrubbed them from planning docs. Discovered `CLAUDE.md` is gitignored, so relocated this living status section out of `CLAUDE.md` into this tracked `STATUS.md` so it actually syncs to Replit.
- **2026-06-11** — Set up the living status section. Surveyed current state: backend + Postgres + Slack OAuth now exist; uncommitted offline-mock-mode work sitting in `src/api.js`. No code changes that session.
