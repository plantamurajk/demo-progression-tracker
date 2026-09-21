// ═══════════════════════════════════════════════
//  DOMAIN — data-driven constants & business helpers
// ═══════════════════════════════════════════════

import stationsData from "../../data/stations.json";
import rolesData from "../../data/roles.json";
import CURRICULUM from "../../data/curriculum.json";

export { stationsData, CURRICULUM };

// ─── Derived lookups ───
export const STATIONS   = stationsData.map(s => s.id);
export const SC         = Object.fromEntries(stationsData.map(s => [s.id, s.color]));
export const CAREER_LADDER  = rolesData.ranks;
export const SKILL_CATS   = rolesData.skillCategories;
export const SL_LABELS    = rolesData.skillLevels.labels;
export const SL_COLORS    = rolesData.skillLevels.colors;
export const QUAL_HOURS   = rolesData.qualificationHours;

export const FARMER_LEVELS = [
  { id: "L1", stations: 1 },
  { id: "L2", stations: 3 },
  { id: "L3", stations: 5 },
  { id: "L4", stations: 7 },
];

export function computeFarmerLevel(stationExperience) {
  const qualCount = (stationExperience || []).filter(e => e.qualified).length;
  const current = [...FARMER_LEVELS].reverse().find(l => qualCount >= l.stations) || FARMER_LEVELS[0];
  const currentIdx = FARMER_LEVELS.findIndex(l => l.id === current.id);
  const next = FARMER_LEVELS.find(l => qualCount < l.stations);
  return {
    currentLevel: current.id,
    currentIdx,
    qualCount,
    nextLevel: next?.id || null,
    neededForNext: next ? next.stations - qualCount : 0,
  };
}

export function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const NAV_TABS = [
  { id: "home",     icon: "⬡" },
  { id: "ladder",   icon: "◈" },
  { id: "schedule", icon: "▦" },
  { id: "myPath", icon: "✦" },
  { id: "library",  icon: "⊞" },
];
// ═══════════════════════════════════════════════════════════════════════════════
//  CURRICULUM CATALOG
//  Source of truth for training doc → stage/station mapping.
//  URLs are null until Drive links are wired in. status is derived at runtime.
//  category: "foundational" | "station" | "misc"
//  docType:  "Module" | "SOP" | "SSOP" | "Reference"
//  station:  null = not station-specific | else matches station id in stations.json
//  requiredAtStage: the Farmhand stage at which this doc becomes required (null = all ranks)
// ═══════════════════════════════════════════════════════════════════════════════

// Stage order for comparisons (Farmhand track only; other ranks skip ahead)
export const FARMHAND_STAGE_ORDER = ["onboarding", "foundations", "proficiency", "farmer-ready"];

export function stageIndex(id) { return FARMHAND_STAGE_ORDER.indexOf(id); }

// Returns CURRICULUM items annotated with a derived `status` field:
//   "required"   — employee should engage with this now
//   "available"  — accessible but not the current focus
//   "completed"  — requirement met (stage done or station qualified)
//   "locked"     — prerequisite not yet reached
// Also sets:
//   assessmentReady  — station has ≥80h and no passed assessments yet
//   assessmentPending — a request for this station is already in flight
export function getCurriculumForEmployee(emp) {
  const completedStages = emp.completedStages || [];
  const currentStage    = emp.currentStage    || null;
  const rank            = emp.rank            || "Farmhand";
  const isFarmhand      = rank === "Farmhand";
  const stationExp      = emp.stationExperience || [];
  const assessments     = emp.assessments       || [];
  const pendingRequests = emp.pendingRequests   || [];

  // Index station hours for quick lookup
  const expByStation = {};
  stationExp.forEach(e => { expByStation[e.station] = e; });

  // Index passed assessments: { [station]: { Practical: bool, Written: bool } }
  const passedByStation = {};
  assessments.forEach(a => {
    if (a.result === "Pass") {
      if (!passedByStation[a.station]) passedByStation[a.station] = {};
      passedByStation[a.station][a.type] = true;
    }
  });

  const hasPendingAssessment = (station) =>
    pendingRequests.some(r => r.station === station &&
      (r.type === "Practical Assessment" || r.type === "Written Assessment"));

  const currentStageIdx = stageIndex(currentStage);

  return CURRICULUM.map(item => {
    let status = "locked";
    let assessmentReady   = false;
    let assessmentPending = false;

    if (item.category === "station") {
      const exp    = expByStation[item.station];
      const hours  = exp?.hours || 0;
      const stationDone = exp?.qualified &&
        passedByStation[item.station]?.Practical &&
        passedByStation[item.station]?.Written;

      // Station SOPs unlock at proficiency stage (or any Farmer+ rank)
      const unlockedByStage = !isFarmhand ||
        completedStages.includes("proficiency") ||
        currentStage === "proficiency" ||
        currentStage === "farmer-ready";

      if (!unlockedByStage || hours < 1) {
        status = "locked";
      } else if (stationDone) {
        status = "completed";
      } else if (hours >= 80) {
        status = "required";
        assessmentReady   = !(passedByStation[item.station]?.Practical && passedByStation[item.station]?.Written);
        assessmentPending = hasPendingAssessment(item.station);
      } else if (hours >= 20) {
        status = "required";
      } else {
        status = "available";
      }

    } else {
      // Foundational / misc modules — keyed by stage
      const reqIdx = stageIndex(item.requiredAtStage);

      if (!isFarmhand) {
        // Farmers+ are presumed to have completed all foundational content
        status = (item.category === "foundational") ? "completed" : "available";
      } else if (reqIdx < 0) {
        status = "available";
      } else if (completedStages.includes(item.requiredAtStage)) {
        status = "completed";
      } else if (currentStageIdx >= reqIdx) {
        status = "required";
      } else {
        status = "locked";
      }
    }

    return { ...item, status, assessmentReady, assessmentPending };
  });
}
export const TODAY = "2026-05-17";

export function isCertExpired(expires) {
  if (!expires) return false;
  return new Date(expires + "T00:00:00") < new Date(TODAY + "T00:00:00");
}

export function computeDaysInRole(startDate) {
  return Math.floor((new Date(TODAY + "T00:00:00") - new Date(startDate + "T00:00:00")) / 86400000);
}
export const DOCTYPE_COLORS = { Module: "#2d6a4f", SOP: "#1d4ed8", SSOP: "#7c3aed", Reference: "#92400e" };
