// ═══════════════════════════════════════════════
//  ACTION PROMPTS — assessment / module / forklift requests
//  All three render as the same amber "action needed" callout.
// ═══════════════════════════════════════════════

import { QUAL_HOURS, CURRICULUM } from "../lib/domain.js";
import { Callout, PendingChip, primaryBtn, quietBtn } from "./ui.jsx";

export function AssessmentReadyPrompt({ emp, lang = "en", onSubmitRequest }) {
  const stationExp  = emp.stationExperience || [];
  const passed      = (emp.assessments || []).filter(a => a.result === "Pass" && a.station);
  const pending     = (emp.pendingRequests || []).filter(r => r.status === "pending");

  // Build one entry per station with both assessment types that are not yet passed
  const readyByStation = {};
  stationExp.forEach(e => {
    if (e.hours < QUAL_HOURS) return;
    ["Practical", "Written"].forEach(type => {
      const reqType = `${type} Assessment`;
      if (passed.some(a => a.station === e.station && a.type === type)) return;
      if (!readyByStation[e.station]) readyByStation[e.station] = { items: [] };
      readyByStation[e.station].items.push({
        type, reqType,
        isPending: pending.some(r => r.station === e.station && r.type === reqType),
      });
    });
  });

  const stations = Object.entries(readyByStation).slice(0, 2);
  if (stations.length === 0) return null;

  return (
    <div style={{ marginBottom: "16px" }}>
      {stations.map(([station, { items }]) => {
        const needsRequest = items.filter(i => !i.isPending);
        const allPending   = needsRequest.length === 0;
        return (
          <Callout
            key={station}
            accent="amber"
            kicker={lang === "es" ? "Evaluación Disponible" : "Assessment Ready"}
            title={station}
            body={lang === "es" ? "Umbral de horas alcanzado" : "Hours threshold reached"}
            right={allPending
              ? <PendingChip lang={lang} />
              : <button
                  onClick={() => needsRequest.forEach(i => onSubmitRequest && onSubmitRequest(station, i.reqType))}
                  style={primaryBtn}>
                  {lang === "es" ? "Solicitar Evaluaciones" : "Request Assessments"}
                </button>
            }
          />
        );
      })}
    </div>
  );
}

export function ModuleAssessmentPrompt({ emp, lang = "en", onSubmitModuleRequest }) {
  const modules = CURRICULUM.filter(m => m.docType === "Module").sort((a, b) => a.id.localeCompare(b.id));
  const passedSet  = new Set((emp.assessments     || []).filter(a => a.result === "Pass" && a.module).map(a => a.module));
  const pendingSet = new Set((emp.pendingRequests || []).filter(r => r.status === "pending" && r.module).map(r => r.module));

  const unpassed = modules.filter(m => !passedSet.has(m.id));
  if (unpassed.length === 0) return null;

  const next = unpassed[0];
  const isPending = pendingSet.has(next.id);
  const title = lang === "es" ? next.titleEs : next.titleEn;
  const link  = lang === "es" ? (next.linkEs || next.linkEn) : (next.linkEn || next.linkEs);

  return (
    <Callout
      accent="amber"
      style={{ marginBottom: "16px", alignItems: "flex-start" }}
      kicker={lang === "es" ? "Capacitación Disponible" : "Training Available"}
      title={title}
      body={unpassed.length === 1
        ? (lang === "es" ? "Último módulo pendiente" : "Last module remaining")
        : (lang === "es" ? `${unpassed.length} módulos pendientes` : `${unpassed.length} of ${modules.length} modules remaining`)}
      right={
        <>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" style={quietBtn}>
              {lang === "es" ? "Ver Módulo" : "View Module"}
            </a>
          )}
          {isPending
            ? <PendingChip lang={lang} />
            : <button onClick={() => onSubmitModuleRequest && onSubmitModuleRequest(next.id, lang === "es" ? next.titleEs : next.titleEn)} style={primaryBtn}>
                {lang === "es" ? "Solicitar Evaluación" : "Request Assessment"}
              </button>
          }
        </>
      }
    />
  );
}

export function ForkliftCertPrompt({ emp, lang = "en", onSubmitForkliftRequest }) {
  const completed = emp.completedStages || [];
  if (!completed.includes("onboarding") || !completed.includes("foundations")) return null;

  const hasCert = (emp.certifications || []).some(c => c.name === "Forklift" && c.status === "active");
  if (hasCert) return null;

  const isPending = (emp.pendingRequests || []).some(r => r.type === "Forklift Training" && r.status === "pending");

  return (
    <Callout
      accent="amber"
      style={{ marginBottom: "16px" }}
      kicker={lang === "es" ? "Certificación Requerida" : "Certification Required"}
      title={lang === "es" ? "Obtén tu Certificación de Montacargas" : "Get Forklift Certified"}
      body={lang === "es" ? "Necesaria para avanzar a Farmer" : "Required to advance to Farmer"}
      right={isPending
        ? <PendingChip lang={lang} />
        : <button onClick={() => onSubmitForkliftRequest && onSubmitForkliftRequest()} style={primaryBtn}>
            {lang === "es" ? "Solicitar Capacitación" : "Request Training"}
          </button>
      }
    />
  );
}
