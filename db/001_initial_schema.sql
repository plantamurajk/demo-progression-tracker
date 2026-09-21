-- ─── Reference tables ────────────────────────────────────────────────────────

CREATE TABLE stations (
  id        TEXT PRIMARY KEY,
  color     TEXT    NOT NULL,
  essential BOOLEAN NOT NULL DEFAULT false,
  positions TEXT[]  NOT NULL DEFAULT '{}'
);

CREATE TABLE curriculum_docs (
  id                TEXT PRIMARY KEY,
  title_en          TEXT NOT NULL,
  title_es          TEXT,
  category          TEXT NOT NULL,  -- 'foundational' | 'station' | 'misc'
  doc_type          TEXT NOT NULL,  -- 'Module' | 'SOP' | 'SSOP' | 'Reference'
  station_id        TEXT REFERENCES stations(id),
  required_at_stage TEXT,           -- 'onboarding' | 'foundations' | 'proficiency' | 'farmer-ready'
  link_en           TEXT,
  link_es           TEXT
);

-- ─── Employee core ────────────────────────────────────────────────────────────

CREATE TABLE employees (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  email           TEXT UNIQUE,
  rank            TEXT NOT NULL,              -- 'Farmhand' | 'Farmer' | 'Senior Farmer' | 'Supervisor' | 'AGM' | 'GM'
  level           TEXT,                       -- 'L1'–'L4', null for Farmhand
  primary_station TEXT REFERENCES stations(id),
  start_date      DATE NOT NULL,
  rank_start_date DATE NOT NULL,
  current_stage   TEXT,                       -- 'onboarding' | 'foundations' | 'proficiency' | 'farmer-ready' | null for Farmer+
  language        TEXT NOT NULL DEFAULT 'en',
  status          TEXT NOT NULL DEFAULT 'active', -- 'active' | 'on-leave' | 'terminated'
  avatar_url      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Individual checklist items within each stage.
-- completedStages and currentStage are derived from this, not stored.
CREATE TABLE stage_progress (
  id           SERIAL PRIMARY KEY,
  employee_id  TEXT NOT NULL REFERENCES employees(id),
  stage        TEXT NOT NULL,  -- 'onboarding' | 'foundations' | 'proficiency' | 'farmer-ready'
  item_id      TEXT NOT NULL,  -- named key matching roles.json, e.g. 'safety_quiz', 'forklift_cert'
  completed    BOOLEAN     NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by TEXT REFERENCES employees(id),
  UNIQUE (employee_id, stage, item_id)
);

-- Cached hours and qualification status per station.
-- Source of truth is daily_log_entries; this is updated on end-of-day confirmation.
CREATE TABLE station_experience (
  id          SERIAL PRIMARY KEY,
  employee_id TEXT    NOT NULL REFERENCES employees(id),
  station_id  TEXT    NOT NULL REFERENCES stations(id),
  hours       NUMERIC(7,2) NOT NULL DEFAULT 0,
  qualified   BOOLEAN NOT NULL DEFAULT false,
  positions   TEXT[]  NOT NULL DEFAULT '{}',
  UNIQUE (employee_id, station_id)
);

CREATE TABLE certifications (
  id          SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES employees(id),
  name        TEXT NOT NULL,                        -- 'Forklift' | 'HACCP' | 'CPR/AED' | etc.
  status      TEXT NOT NULL DEFAULT 'not-started',  -- 'active' | 'expired' | 'not-started'
  earned      DATE,
  expires     DATE
);

CREATE TABLE skills (
  id          SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES employees(id),
  name_en     TEXT NOT NULL,
  name_es     TEXT,
  level       TEXT NOT NULL,  -- 'learning' | 'competent' | 'proficient' | 'certified'
  category    TEXT NOT NULL,  -- 'certification' | 'machine' | 'technique' | 'safety' | 'leadership'
  station_id  TEXT REFERENCES stations(id),
  notes_en    TEXT,
  notes_es    TEXT,
  endorsed_by TEXT,
  date_added  DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Supervisor-suggested learning goals; feeds cross-training suggestions on the daily board.
CREATE TABLE dev_suggestions (
  id          SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES employees(id),
  skill_en    TEXT NOT NULL,
  skill_es    TEXT,
  station_id  TEXT REFERENCES stations(id),
  suggested_by TEXT,
  reason_en   TEXT,
  reason_es   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Activity records ─────────────────────────────────────────────────────────

CREATE TABLE assessments (
  id          SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES employees(id),
  module_id   TEXT REFERENCES curriculum_docs(id),
  station_id  TEXT REFERENCES stations(id),
  type        TEXT NOT NULL,  -- 'Written' | 'Practical'
  result      TEXT NOT NULL,  -- 'Pass' | 'Fail'
  date        TEXT NOT NULL,  -- compact display string, e.g. 'Jan 8'
  evaluator_id TEXT REFERENCES employees(id),
  CONSTRAINT assessment_has_target CHECK (module_id IS NOT NULL OR station_id IS NOT NULL)
);

CREATE TABLE violations (
  id          SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES employees(id),
  type        TEXT NOT NULL,  -- 'Late Arrival' | 'Long Break' | 'PPE Violation'
  date        DATE NOT NULL,
  note        TEXT,
  level       INT  NOT NULL DEFAULT 1
);

CREATE TABLE requests (
  id           SERIAL PRIMARY KEY,
  employee_id  TEXT NOT NULL REFERENCES employees(id),
  type         TEXT NOT NULL,  -- 'Practical Assessment' | 'Training' | etc.
  station_id   TEXT REFERENCES stations(id),
  module_id    TEXT REFERENCES curriculum_docs(id),  -- set for Module Assessment requests
  requested_at DATE NOT NULL DEFAULT CURRENT_DATE,
  status       TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'acknowledged' | 'completed'
  response     TEXT,
  responded_by TEXT REFERENCES employees(id),
  responded_at TIMESTAMPTZ
);

-- People trained by this employee (Senior Farmer+ requirement).
CREATE TABLE training_sessions (
  id           SERIAL PRIMARY KEY,
  trainer_id   TEXT NOT NULL REFERENCES employees(id),
  trainee_name TEXT NOT NULL,
  trainee_id   TEXT REFERENCES employees(id),
  station_id   TEXT REFERENCES stations(id),
  date         TEXT NOT NULL,
  notes        TEXT
);

-- Shifts led by this employee (Senior Farmer+ requirement).
CREATE TABLE shifts_led (
  id          SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES employees(id),
  date        TEXT NOT NULL,
  station_id  TEXT REFERENCES stations(id),
  note        TEXT
);

-- Corrective actions managed by this employee (Supervisor+ requirement).
CREATE TABLE corrective_actions (
  id            SERIAL PRIMARY KEY,
  supervisor_id TEXT NOT NULL REFERENCES employees(id),
  subject_name  TEXT NOT NULL,
  subject_id    TEXT REFERENCES employees(id),
  type          TEXT NOT NULL,
  date          TEXT NOT NULL,
  note          TEXT
);

-- Source of truth for station hours.
-- One row per person per station per day (multiple rows if different positions worked).
-- station_experience.hours is a cached sum; rebuilt on end-of-day confirmation.
CREATE TABLE daily_log_entries (
  id           SERIAL PRIMARY KEY,
  employee_id  TEXT         NOT NULL REFERENCES employees(id),
  date         DATE         NOT NULL,
  station_id   TEXT         NOT NULL REFERENCES stations(id),
  position     TEXT         NOT NULL,
  hours        NUMERIC(3,1) NOT NULL,
  confirmed_by TEXT REFERENCES employees(id),
  confirmed_at TIMESTAMPTZ,
  CONSTRAINT positive_hours CHECK (hours > 0)
);

-- ─── Auth ─────────────────────────────────────────────────────────────────────

-- Employees can exist before they log in (added by a supervisor).
-- email on employees is matched to Slack identity on first login.
CREATE TABLE user_accounts (
  id            SERIAL PRIMARY KEY,
  employee_id   TEXT NOT NULL UNIQUE REFERENCES employees(id),
  slack_user_id TEXT NOT NULL UNIQUE,
  email         TEXT NOT NULL,
  avatar_url    TEXT,
  access_token  TEXT,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
