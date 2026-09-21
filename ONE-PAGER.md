# Beanstalk Progression Tracker
### Employee-Facing Career Development App — Internal Tool

---

## What it is

A mobile-first app that gives every Beanstalk farmhand a clear, real-time view of where they stand in their career and exactly what they need to do next. It replaces informal check-ins and supervisor memory with a transparent, structured record that employees can access themselves.

---

## The problem it solves

Advancement at Beanstalk depends on accumulated station hours, checkpoint completions, assessments, and a supervisor recommendation — but employees currently have no way to track their own progress. They don't know how close they are to qualifying at a station, which checkpoints are still open, or what the path to Farmer or Senior Farmer actually looks like. Supervisors spend time answering questions that the app could answer automatically.

---

## Who it's for

**Employees** — check their own progress, understand what's next, submit training requests, see their recognized skills and endorsements.

**Supervisors** — add skill endorsements, suggest development areas, view any employee's profile, confirm advancement readiness.

---

## Five tabs

| Tab | What it does |
|---|---|
| **Home** | "What's next" prompt, stage progress bar, station experience rings, skills & endorsements chip cloud, development suggestions |
| **Ladder** | Full career ladder (Farmhand → Farmer → Sr. Farmer → Supervisor → AGM → GM) with expandable rank cards, pay levels, advancement requirements, and a visual station-level stepper per rank |
| **Schedule** | Placeholder — reserved for weekly station assignments |
| **My Path** | Personalized study guide for current stage and active stations, assessment request prompts, skills & endorsements (editable in supervisor mode), training requests |
| **Library** | All SOPs and training materials organized by station and document type, assessments log |

---

## Key features

**Role-aware content.** The home screen adapts completely based on rank. A Farmhand sees 90-day checkpoint progress. A Farmer sees their station qualification ladder (L1–L4). A Sr. Farmer sees training sessions led and shift lead count. A Supervisor sees AGM readiness. Everyone sees exactly what's relevant to them.

**Station qualification tracking.** Each station requires 80 hours + practical + written assessment. Progress rings show hours logged, color-coded by station, with clear visual indication of qualification status.

**Skills & endorsements.** Supervisors can tag employees with specific proficiencies (machine operation, techniques, safety certifications, leadership) across four levels: Learning → Competent → Proficient → Certified. Skills display as a compact chip cloud on both the Home and Learning tabs — tap any chip to expand endorser, station, and notes inline. These feed into scheduling decisions.

**Development suggestions.** Supervisors can attach lightweight "suggested next learning" notes to any profile — a structured alternative to freeform notes that can later power cross-training recommendations.

**Bilingual.** Full English/Spanish toggle. All UI text, career content, and skill labels render in either language instantly.

**Supervisor mode.** A toggle in the app bar switches between employee view (read-only, personal) and supervisor view (add/edit skills, suggest development areas, see full team context).

---

## Career path overview

```
Farmhand → Farmer (L1–L4) → Senior Farmer (L1–L4) → Supervisor (L1–L4) → AGM → GM
```

Farmer, Senior Farmer, and Supervisor levels are earned by qualifying at more stations (1 → 3 → 5 → 7). Each qualification requires 80h + practical + written assessment. The Ladder tab shows a visual stepper for each ranked role — completed levels in dark green, current level highlighted, future levels greyed out. Rank card icons reflect status at a glance: ✓ for completed ranks, the employee's current level (L1–L4) for their active rank, ○ for future ranks. Senior Farmer adds mentorship and shift lead requirements. Supervisor adds corrective action documentation and certification requirements for AGM.

---

## Tech

Single-file React app (Vite). No backend — all state in memory with mock data. Data loaded from JSON files (`employee.json`, `roles.json`, `stations.json`). All styles inline. Mobile breakpoint at 640px. Visual identity: Inter for UI, DM Serif Display for the wordmark, Outfit for SVG ring numbers, brand blue (`#1e3f61`) nav, lime accent. SOP links in the Library tab point to the Beanstalk Google Drive folder.

---

## Layout

Mobile (≤640px): bottom tab bar navigation, single-column card layout. Desktop: persistent left sidebar with profile summary and nav links, wider content area. Both views share identical functionality.

---

## Status

Working demo with 5 fictional employee profiles spanning all career stages. Switch between profiles via dropdown in the app bar. (All demo people are invented; real employees will only ever exist as records in the production database, never in the repo.)

| Name | Rank |
|---|---|
| Maria Santos | Farmhand |
| Jamie Chen | Farmhand |
| Diego Reyes | Farmer |
| Priya Patel | Senior Farmer |
| Carlos Rivera | Supervisor |
