// ─── API + adapter layer ──────────────────────────────────────────────────────
// Talks to the Express backend through the Vite dev proxy (same origin), and
// reshapes the backend's snake_case / by-stage payloads into the nested,
// camelCase shape the React UI expects.
//
// adaptEmployee is the single shape contract between server payloads and the
// UI. Mock mode stores wire-shaped payloads (same JSON GET /api/employees/:id
// returns) and runs them through the same adapter, so the two modes cannot
// drift apart silently.

import CURRICULUM from "../data/curriculum.json";
import MOCK_EMPLOYEES from "../data/employee.json";

// Offline mock mode — set VITE_USE_MOCK=true (e.g. in .env.local) to run the
// entire UI against data/employee.json with no backend / DB / Slack. Mutations
// persist for the session and reset on page reload.
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const TITLE_BY_MODULE = Object.fromEntries(
  CURRICULUM.map(m => [m.id, { en: m.titleEn, es: m.titleEs }])
);

async function request(path, options = {}) {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 401) {
    const err = new Error("unauthenticated");
    err.status = 401;
    throw err;
  }
  if (!res.ok) {
    let detail = "";
    try { detail = (await res.json()).error || ""; } catch { /* noop */ }
    throw new Error(`${res.status} ${path} ${detail}`.trim());
  }
  if (res.status === 204) return null;
  return res.json();
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
// Postgres DATE columns serialize to full ISO timestamps over HTTP
// ("2026-06-09T05:00:00.000Z"); the UI's date math expects bare "YYYY-MM-DD".
function isoDay(value) {
  if (!value) return null;
  const iso = value instanceof Date ? value.toISOString() : String(value);
  return iso.slice(0, 10);
}

// ISO/Date string → "Jun 9" (avoids TZ day-shift)
function fmtDate(value) {
  const s = isoDay(value);
  if (!s) return "";
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return String(value);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function titleFor(moduleId) {
  if (!moduleId) return undefined;
  const t = TITLE_BY_MODULE[moduleId];
  return t ? (t.en || t.es) : undefined;
}

const STAGE_ORDER = ["onboarding", "foundations", "proficiency", "farmer-ready"];

// ─── Reshape a full backend employee payload into the UI's emp shape ──────────
export function adaptEmployee(raw) {
  if (!raw) return null;

  const progressByStage = raw.stageProgress || {};
  const currentStage = raw.current_stage || null;

  const completedStages = STAGE_ORDER.filter(stage => {
    if (stage === currentStage) return false;
    const items = progressByStage[stage];
    if (!items) return false;
    const vals = Object.values(items);
    return vals.length > 0 && vals.every(Boolean);
  });

  // Passed assessments per station — drives the practical/written badges on
  // station rings.
  const passedByStation = {};
  for (const a of raw.assessments || []) {
    if (a.result === "Pass" && a.station_id) {
      (passedByStation[a.station_id] ||= {})[a.type] = true;
    }
  }

  return {
    id: raw.id,
    name: raw.name,
    rank: raw.rank,
    level: raw.level,
    primaryStation: raw.primary_station,
    startDate: isoDay(raw.start_date),
    rankStartDate: isoDay(raw.rank_start_date),
    language: raw.language,
    avatarUrl: raw.avatar_url,

    stationExperience: (raw.stationExperience || []).map(e => ({
      station: e.station_id,
      hours: Number(e.hours) || 0, // NUMERIC serializes to a string over HTTP
      qualified: e.qualified,
      positions: e.positions || [],
      practicalPass: !!passedByStation[e.station_id]?.Practical,
      writtenPass: !!passedByStation[e.station_id]?.Written,
    })),

    certifications: (raw.certifications || []).map(c => ({
      name: c.name,
      status: c.status,
      earned: isoDay(c.earned),
      expires: isoDay(c.expires),
    })),

    skills: (raw.skills || []).map(s => ({
      id: s.id,
      name: { en: s.name_en, es: s.name_es },
      level: s.level,
      category: s.category,
      station: s.station_id,
      notes: { en: s.notes_en, es: s.notes_es },
      endorsedBy: s.endorsed_by,
      dateAdded: isoDay(s.date_added),
    })),

    devSuggestions: (raw.devSuggestions || []).map(d => ({
      id: d.id,
      skill: { en: d.skill_en, es: d.skill_es },
      station: d.station_id,
      from: d.suggested_by,
      reason: { en: d.reason_en, es: d.reason_es },
    })),

    assessments: (raw.assessments || []).map(a => ({
      station: a.station_id,
      module: a.module_id,
      title: titleFor(a.module_id),
      type: a.type,
      result: a.result,
      date: a.date,
    })),

    violations: (raw.violations || []).map(v => ({
      type: v.type, date: isoDay(v.date), note: v.note, level: v.level,
    })),

    pendingRequests: (raw.requests || []).map(r => ({
      id: r.id,
      type: r.type,
      station: r.station_id,
      module: r.module_id,
      title: titleFor(r.module_id),
      date: fmtDate(r.requested_at),
      status: r.status,
      response: r.response,
    })),

    completedStages,
    currentStage,
    currentStageProgress: progressByStage[currentStage] || {},

    // Not yet served by the backend (no tables wired into GET /employees/:id).
    // The mock payload carries them so Farmer+ demo profiles stay rich; live
    // payloads leave them null until the endpoints exist.
    promotionReqs: raw.promotionReqs ?? null,
    training: raw.training ?? null,
    schedule: null,
    referenceMaterials: null,
  };
}

// Summary row shape used by the supervisor's employee switcher.
const teamSummary = r => ({
  id: r.id,
  name: r.name,
  rank: r.rank,
  level: r.level,
  primaryStation: r.primary_station,
  currentStage: r.current_stage,
});

// ─── Live backend ─────────────────────────────────────────────────────────────
const liveApi = {
  async getMe() {
    return request("/auth/me");
  },

  async logout() {
    return request("/auth/logout", { method: "POST" });
  },

  // ─── Reads ───
  async getTeam() {
    const rows = await request("/api/employees");
    return rows.map(teamSummary);
  },

  async getEmployee(id) {
    const raw = await request(`/api/employees/${id}`);
    return adaptEmployee(raw);
  },

  // ─── Skills ───
  addSkill(empId, skill) {
    return request(`/api/employees/${empId}/skills`, {
      method: "POST",
      body: JSON.stringify({
        nameEn: skill.name?.en || skill.name?.es || "",
        nameEs: skill.name?.es || null,
        level: skill.level,
        category: skill.category,
        stationId: skill.station || null,
        notesEn: skill.notes?.en || null,
        notesEs: skill.notes?.es || null,
      }),
    });
  },

  updateSkill(skillId, updates) {
    return request(`/api/skills/${skillId}`, {
      method: "PATCH",
      body: JSON.stringify({
        level: updates.level,
        notesEn: updates.notes?.en ?? null,
        notesEs: updates.notes?.es ?? null,
      }),
    });
  },

  removeSkill(skillId) {
    return request(`/api/skills/${skillId}`, { method: "DELETE" });
  },

  // ─── Dev suggestions ───
  addDevSuggestion(empId, s) {
    return request(`/api/employees/${empId}/dev-suggestions`, {
      method: "POST",
      body: JSON.stringify({
        skillEn: s.skill?.en || s.skill?.es || "",
        skillEs: s.skill?.es || null,
        stationId: s.station || null,
        reasonEn: s.reason?.en || null,
        reasonEs: s.reason?.es || null,
      }),
    });
  },

  removeDevSuggestion(suggestionId) {
    return request(`/api/dev-suggestions/${suggestionId}`, { method: "DELETE" });
  },

  // ─── Requests ───
  submitRequest(empId, { type, stationId, moduleId }) {
    return request(`/api/employees/${empId}/requests`, {
      method: "POST",
      body: JSON.stringify({ type, stationId: stationId || null, moduleId: moduleId || null }),
    });
  },
};

// ─── Offline mock implementation ──────────────────────────────────────────────
// Mirrors every liveApi method against an in-memory store of wire-shaped
// employee payloads (data/employee.json). Mutations mimic what the Express
// routes write; reads run through adaptEmployee exactly like live responses.

const MOCK_ME_ID = import.meta.env.VITE_MOCK_ME || "emp_001";

const mockStore = USE_MOCK
  ? Object.fromEntries(structuredClone(MOCK_EMPLOYEES).map(e => [e.id, e]))
  : {};
let _mockSeq = 1000; // seeded row ids are small ints; new rows start at 1000
const todayISO = () => new Date().toISOString().slice(0, 10);

// Find the {list, idx} owning the record matching `match` in list `listOf(emp)`.
function findInStore(listOf, match) {
  for (const emp of Object.values(mockStore)) {
    const list = listOf(emp);
    const idx = list ? list.findIndex(match) : -1;
    if (idx !== -1) return { list, idx };
  }
  return null;
}

const mockApi = {
  // Mirrors GET /auth/me (employees row + avatar)
  async getMe() {
    const e = mockStore[MOCK_ME_ID] || Object.values(mockStore)[0];
    if (!e) { const err = new Error("unauthenticated"); err.status = 401; throw err; }
    const { id, name, email, rank, level, primary_station, current_stage, language, start_date, avatar_url } = e;
    return { id, name, email, rank, level, primary_station, current_stage, language, start_date, avatar_url };
  },

  async logout() { return { ok: true }; },

  async getTeam() {
    return Object.values(mockStore).map(teamSummary);
  },

  async getEmployee(id) {
    const e = mockStore[id];
    return e ? adaptEmployee(structuredClone(e)) : null;
  },

  async addSkill(empId, skill) {
    const e = mockStore[empId];
    if (!e) throw new Error("mock: employee not found");
    const row = {
      id: _mockSeq++,
      name_en: skill.name?.en || skill.name?.es || "",
      name_es: skill.name?.es || null,
      level: skill.level,
      category: skill.category,
      station_id: skill.station || null,
      notes_en: skill.notes?.en || null,
      notes_es: skill.notes?.es || null,
      endorsed_by: MOCK_ME_ID,
      date_added: todayISO(),
    };
    (e.skills ||= []).push(row);
    return row;
  },

  async updateSkill(skillId, updates) {
    const found = findInStore(e => e.skills, s => s.id === skillId);
    if (!found) throw new Error("mock: skill not found");
    const s = found.list[found.idx];
    // COALESCE semantics, matching PATCH /api/skills/:id
    if (updates.level != null) s.level = updates.level;
    if (updates.notes?.en != null) s.notes_en = updates.notes.en;
    if (updates.notes?.es != null) s.notes_es = updates.notes.es;
    return s;
  },

  async removeSkill(skillId) {
    const found = findInStore(e => e.skills, s => s.id === skillId);
    if (found) found.list.splice(found.idx, 1);
    return { ok: true };
  },

  async addDevSuggestion(empId, s) {
    const e = mockStore[empId];
    if (!e) throw new Error("mock: employee not found");
    const row = {
      id: _mockSeq++,
      skill_en: s.skill?.en || s.skill?.es || "",
      skill_es: s.skill?.es || null,
      station_id: s.station || null,
      suggested_by: MOCK_ME_ID,
      reason_en: s.reason?.en || null,
      reason_es: s.reason?.es || null,
    };
    (e.devSuggestions ||= []).push(row);
    return row;
  },

  async removeDevSuggestion(id) {
    const found = findInStore(e => e.devSuggestions, d => d.id === id);
    if (found) found.list.splice(found.idx, 1);
    return { ok: true };
  },

  async submitRequest(empId, { type, stationId, moduleId }) {
    const e = mockStore[empId];
    if (!e) throw new Error("mock: employee not found");
    const row = {
      id: _mockSeq++,
      type,
      station_id: stationId || null,
      module_id: moduleId || null,
      requested_at: todayISO(),
      status: "pending",
      response: null,
    };
    (e.requests ||= []).push(row);
    return row;
  },
};

export const api = USE_MOCK ? mockApi : liveApi;

if (USE_MOCK && typeof console !== "undefined") {
  console.info(
    "%c[api] OFFLINE MOCK MODE — serving data/employee.json, no backend",
    "color:#2d6a4f;font-weight:bold"
  );
}
