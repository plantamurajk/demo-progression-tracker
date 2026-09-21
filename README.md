<img width="552" height="402" alt="Screenshot 2026-09-21 at 1 29 11 PM" src="https://github.com/user-attachments/assets/840ad5fd-b20d-4e27-9799-ee3c6a027a7e" />
<img width="552" height="402" alt="Screenshot 2026-09-21 at 1 32 10 PM" src="https://github.com/user-attachments/assets/2266b08d-4aa9-4de4-bc72-df1f11a0505c" />


# Beanstalk Progression Tracker

An internal web app built for the production floor of a vertical farming facility, giving every employee a real-time view of where they stand in the company's career ladder and what they need to do next.

**[Live demo](https://demo-progression-tracker-fgtv.vercel.app/)**. Runs entirely on fictional data. No login required.

---

## The problem

Beanstalk introduced a four-tier advancement system (Farmhand, Farmer, Senior Farmer, Supervisor) for our Farm Operations employees. Promotion depended on hours worked at each of seven production stations, completed trainings and certifications, practical and written assessments, and a supervisor recommendation.

Uptake was poor because, following the initial presentation of the system, the ranks, requirements, and payscale were out of sight and out of mind. Employees had no way to see their own progress. They didn't know how close they were to qualifying at a station, which checkpoints were still open, or what the path to the next rank actually looked like. All of that lived in scheduling spreadsheets and supervisor memory. Supervisors spent time answering questions the system should have been able to answer on its own.

I proposed the app and built it, with a company founder as stakeholder holding sign-off on anything touching shared infrastructure.

## What it does

Five tabs, with content that adapts to the viewer's rank:

| Tab | Purpose |
|---|---|
| **Home** | Current stage progress, station experience rings, endorsed skills, next-step prompt |
| **Ladder** | The full career ladder with per-rank requirements and a visual level stepper |
| **My Path** | Personalized study guide for the current stage, assessment requests, training requests |
| **Library** | SOPs and training materials organized by station and document type (document links are omitted from this repo and the demo) |
| **Schedule** | Reserved for weekly station assignments (not built) |

A Farmhand sees 90-day onboarding checkpoints. A Farmer sees station qualification progress toward L1–L4. A Senior Farmer sees training sessions led and shift-lead counts. The home screen is a different screen depending on who is looking at it.

Supervisor mode adds skill endorsement, development suggestions, and access to any employee's profile.

The entire UI is bilingual English/Spanish because a large share of the production team spoke Spanish as a first language, and the purpose of the app is to make the progression system legible to the whole production team. 

## Data reconstruction

The advancement rules were retroactive: hours already worked counted toward qualification. But the company had never tracked hours by station. The only record was 16 months of hand-formatted scheduling spreadsheets covering about 24 employees, where station assignments appeared as free-text task descriptions written by whoever built that week's schedule.

I wrote a pipeline to parse those spreadsheets and a text classifier to map free-text task descriptions onto the seven stations, then reconstructed per-employee station-hours history from the result.

Because this data was collected in a relatively coarse-grained way, every backfilled figure carries a confidence rating and is presented as an estimate, not as a measurement. Employees could see which of their hours were reconstructed and flag them for correction.

## Technical decisions worth explaining

**Slack OAuth instead of Google Workspace.** The obvious identity layer was Google Workspace, but the company had stopped issuing email addresses to new hires. That meant the newest employees, the ones with the most to gain from a progression tracker, would have been the ones locked out. Every employee was already in Slack. Using Slack as the identity provider was the only approach that didn't reintroduce the exact access friction the app existed to remove.

**Presigned URLs for training materials.** The Library tab serves proprietary SOPs and training documents. Gating the interface behind a login doesn't gate the files, so the plan was to move them into private storage and serve them through authenticated routes and presigned URLs, rather than public links behind a UI that merely looks locked. This wasn't built before the company wound down: the prototype linked to shared Google Drive files. Those links have been removed from this repository and the demo, so documents show as "coming soon".

**One shape contract between mock and live.** `src/api.js` exposes a single `adaptEmployee` adapter that every backend payload passes through, and offline mock mode runs the same fixtures through the same adapter. Without this, mock data and live data drift apart silently and the offline mode stops being a useful test surface.

**Ruled out, with reasons.** Google Sheets as a backend (no real access control, and concurrent writes from a shared spreadsheet were already the problem being solved). Gusto as an auth and roster source (roster data was accurate but the integration surface was wrong for a read-heavy employee-facing app).

I also deliberately did not make certain calls alone. Anything with organization-wide implications, such as the identity provider or where proprietary documents lived, paused for founder sign-off rather than getting decided by whoever was closest to the keyboard.

## Working method

Small, independently verifiable, shippable increments, with something demoable to leadership at any point rather than a long silent build. Read the actual artifacts, the real spreadsheets and the real SOPs, before recommending anything.

## Status

Beanstalk wound down in August 2026 and the app was never deployed to production. The frontend, the data pipeline, the schema, and the Express/Postgres backend are complete and functional; server-side authorization was the next item on the list and was never finished, which is why the live demo runs in offline mode rather than against a database.

Known incomplete work is documented honestly in [STATUS.md](STATUS.md), including the things that were wrong at the time I stopped.

## Data policy

**No real employee data appears in this repository or in the demo.** The five profiles (Maria Santos, Jamie Chen, Diego Reyes, Priya Patel, Carlos Rivera) are invented, with invented progression histories. The design intent was that real employee records would be created directly in the production database and never committed to version control. Demo seed data is gated behind `SEED_DEMO=true` so a production migration cannot create fictional records.

## Running it

```bash
npm install

# Offline demo. No backend, no database, no Slack app needed.
VITE_USE_MOCK=true npm run dev
```

Full stack:

```bash
npm install && npm install --prefix backend
cp backend/.env.example backend/.env   # fill in Postgres + Slack credentials
npm run migrate --prefix backend       # add SEED_DEMO=true for demo profiles
npm start --prefix backend             # :3001
npm run dev                            # :5000
```

## Stack

React 18, Vite, Express, PostgreSQL, Slack OAuth. No UI framework; styles are inline.
