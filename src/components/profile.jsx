import { useState } from "react";
import { SC, QUAL_HOURS, STATIONS, TODAY, computeDaysInRole } from "../lib/domain.js";
import { TRANS, tStage } from "../lib/i18n.jsx";
import { ACCENT, Callout } from "./ui.jsx";

// ═══════════════════════════════════════════════
//  BASE UI COMPONENTS
// ═══════════════════════════════════════════════

export function StationRing({ station, hours, qualified, size = 52 }) {
  const color = SC[station] || "#6b7280";
  const pct = Math.min(100, (hours / QUAL_HOURS) * 100);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ textAlign: "center", width: size + 12 }}>
      <svg width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e8e6e1" strokeWidth="4.5" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4.5"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dashoffset 1s ease" }} />
        {qualified
          ? <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="central"
              style={{ fontSize: "14px" }}>✓</text>
          : <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="central"
              style={{ fontSize: "11px", fontWeight: 700, fill: color, fontFamily: "'Outfit',sans-serif" }}>{hours}</text>
        }
      </svg>
      <div style={{ fontSize: "9px", fontWeight: 600, color: qualified ? color : "#8a8780", marginTop: "3px", lineHeight: 1.2 }}>
        {station}
      </div>
    </div>
  );
}
// ═══════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════

export function JourneyLadder({ stages, completedStages, currentStage, currentProgress, lang = "en" }) {
  return (
    <div style={{ position: "relative", padding: "0 0 0 30px" }}>
      <div style={{ position: "absolute", left: "12px", top: "6px", bottom: "6px", width: "2px", background: "#e8e6e1" }} />
      {stages.map((stage, i) => {
        const done = completedStages.includes(stage.id);
        const current = currentStage === stage.id;
        const future = !done && !current;
        const st = tStage(stage.id, lang);
        const displayName  = st?.name  ?? stage.name;
        const displayDesc  = st?.desc  ?? stage.desc;
        const displayItems = st?.items ?? stage.items;
        return (
          <div key={stage.id} style={{ position: "relative", paddingBottom: i < stages.length - 1 ? "16px" : "0" }}>
            <div style={{ position: "absolute", left: "-30px", top: "3px", width: "24px", height: "24px", borderRadius: "50%", zIndex: 1, background: done ? "#2d6a4f" : current ? "#fff" : "#f5f3ef", border: current ? "3px solid #2d6a4f" : done ? "none" : "2px solid #d5d2cb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {done && <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>✓</span>}
              {current && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2d6a4f" }} />}
            </div>
            <div style={{ padding: current ? "10px 14px" : "6px 14px", background: current ? "#f0fdf7" : "transparent", borderRadius: "10px", border: current ? "1px solid #bbf7d0" : "1px solid transparent", opacity: future ? 0.45 : 1, transition: "opacity 0.3s" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: done ? "#2d6a4f" : current ? "#166534" : "#8a8780" }}>{displayName}</div>
              <div style={{ fontSize: "11px", color: "#8a8780", marginTop: "2px" }}>{displayDesc}</div>
              {(done || current) && (
                <div style={{ marginTop: "8px" }}>
                  {displayItems.map((item) => {
                    const itemDone = done || (current && currentProgress && currentProgress[item.id]);
                    return (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "3px 0", fontSize: "12px" }}>
                        <span style={{ width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: itemDone ? "#e6f5ef" : "#f5f3ef", color: itemDone ? "#1a7a5a" : "#d5d2cb", fontSize: "10px", fontWeight: 700 }}>
                          {itemDone ? "✓" : "○"}
                        </span>
                        <span style={{ color: itemDone ? "#3a3935" : "#a8a5a0" }}>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
// ═══════════════════════════════════════════════
//  FARMHAND HOME SUB-COMPONENTS
// ═══════════════════════════════════════════════

export function MobileProfileHeader({ emp, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const days = computeDaysInRole(emp.rankStartDate || emp.startDate);
  const qualCount = (emp.stationExperience || []).filter(e => e.qualified).length;
  const isFarmer = emp.rank !== "Farmhand";
  return (
    <div style={{ background: "linear-gradient(145deg, #1a3a5c 0%, #1e4878 100%)", padding: "22px 20px 26px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -30, right: -20, width: "100px", height: "100px", borderRadius: "50%", background: "#ffffff06" }} />
      <div style={{ position: "absolute", bottom: -40, left: 20, width: "80px", height: "80px", borderRadius: "50%", background: "#ffffff04" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "14px", position: "relative" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#ffffff14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 800, color: "#fff", border: "1.5px solid #ffffff18" }}>
          {emp.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>{emp.name}</div>
          <div style={{ fontSize: "12px", color: "#ffffff77", fontWeight: 500 }}>{emp.rank} · {emp.primaryStation}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#fff", lineHeight: 1 }}>{days}</div>
          <div style={{ fontSize: "10px", color: "#ffffff55", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>{T.daysInRole}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", marginTop: "16px", position: "relative" }}>
        {[
          isFarmer
            ? { v: qualCount,                   l: T.stns, s: T.stationsQualified }
            : { v: emp.stationExperience.length, l: T.stns, s: `${T.of} ${STATIONS.length}` },
          { v: emp.skills.length,     l: T.skills,      s: T.endorsed },
          { v: emp.assessments.length, l: T.assessments, s: T.passed },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "10px 8px", borderRadius: "10px", background: "#ffffff0c", border: "1px solid #ffffff0a", textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>{s.v}</div>
            <div style={{ fontSize: "10px", color: "#ffffff66", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.l} · {s.s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StageProgressBar({ stages, completedStages, currentStage, currentStageProgress, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935", marginBottom: "10px" }}>{T.progress}</div>
      <div style={{ display: "flex", gap: "6px" }}>
        {stages.map(stage => {
          const done = completedStages.includes(stage.id);
          const current = currentStage === stage.id;
          const items = stage.items || [];
          const donePct = done ? 100
            : current ? Math.round((Object.values(currentStageProgress || {}).filter(Boolean).length / items.length) * 100)
            : 0;
          return (
            <div key={stage.id} style={{ flex: 1 }}>
              <div style={{ height: "6px", borderRadius: "3px", background: "#e8e6e1", overflow: "hidden", marginBottom: "5px" }}>
                <div style={{ height: "100%", width: `${donePct}%`, background: done ? "#2d6a4f" : "#3d8b6e", borderRadius: "3px", transition: "width 0.8s ease" }} />
              </div>
              <div style={{ fontSize: "9px", fontWeight: done || current ? 600 : 400, color: done ? "#2d6a4f" : current ? "#3a3935" : "#a8a5a0", lineHeight: 1.3 }}>
                {tStage(stage.id, lang)?.name ?? stage.name}
                {current && <span style={{ color: "#8a8780", fontWeight: 400 }}> · {donePct}%</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CurrentFocusBanner({ stages, currentStage, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const stage = stages.find(s => s.id === currentStage);
  if (!stage) return null;
  const st = tStage(stage.id, lang);
  return (
    <Callout
      accent="green"
      style={{ marginBottom: "20px" }}
      kicker={T.currentFocusLabel}
      title={st?.name ?? stage.name}
      body={st?.desc ?? stage.desc}
    />
  );
}

export function StationExperience({ stationExperience, isMobile, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const expMap = Object.fromEntries(stationExperience.map(e => [e.station, e]));
  const sorted = [...STATIONS].sort((a, b) => (expMap[b]?.hours || 0) - (expMap[a]?.hours || 0));
  // Untouched stations render as a quiet text line instead of empty rings
  const started    = sorted.filter(s => (expMap[s]?.hours || 0) > 0 || expMap[s]?.qualified);
  const notStarted = sorted.filter(s => !((expMap[s]?.hours || 0) > 0 || expMap[s]?.qualified));
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935", marginBottom: "10px" }}>{T.stationExperience}</div>
      <div style={{ display: "flex", gap: isMobile ? "4px" : "10px", flexWrap: "wrap" }}>
        {started.map(s => {
          const exp = expMap[s];
          return <StationRing key={s} station={s} hours={exp?.hours || 0} qualified={exp?.qualified || false} size={isMobile ? 52 : 64} />;
        })}
      </div>
      {notStarted.length > 0 && (
        <div style={{ fontSize: "10px", color: "#a8a5a0", marginTop: "8px" }}>
          {T.notStartedStations}: {notStarted.join(" · ")}
        </div>
      )}
      <div style={{ fontSize: "10px", color: "#a8a5a0", marginTop: notStarted.length > 0 ? "3px" : "8px" }}>
        {T.qualLine(QUAL_HOURS)}
      </div>
    </div>
  );
}
// ═══════════════════════════════════════════════
//  CLEAN RECORD WIDGET
// ═══════════════════════════════════════════════

export function CleanRecordBadge({ violations = [], lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const [expanded, setExpanded] = useState(false);

  const todayMs   = new Date(TODAY + "T00:00:00").getTime();
  const thirtyAgo = todayMs - 30 * 86400000;
  const recent    = violations.filter(v => new Date(v.date + "T00:00:00").getTime() >= thirtyAgo);
  const hasRecent = recent.length > 0;

  const lastMs    = violations.length > 0
    ? Math.max(...violations.map(v => new Date(v.date + "T00:00:00").getTime()))
    : null;
  const daysSince = lastMs ? Math.floor((todayMs - lastMs) / 86400000) : null;

  const byType = {};
  recent.forEach(v => { byType[v.type] = (byType[v.type] || 0) + 1; });
  const blocked = Object.values(byType).some(c => c >= 2);

  const accent = hasRecent ? ACCENT.amber : ACCENT.green;
  const labelColor = "#2a2925";
  const subColor   = "#8a8780";

  const subtext = hasRecent
    ? (recent.length === 1 ? T.recentIncident1 : T.recentIncidentN(recent.length))
    : (daysSince ? T.daysSinceViolation(daysSince) : T.noViolations);

  return (
    <div style={{ marginBottom: "22px" }}>
      <button
        onClick={() => hasRecent && setExpanded(e => !e)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: expanded ? "10px 10px 0 0" : "10px", background: "#fff", border: "1px solid #e8e6e1", borderLeft: `4px solid ${accent}`, cursor: hasRecent ? "pointer" : "default", textAlign: "left" }}
      >
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: labelColor }}>{T.cleanRecord}</span>
          <span style={{ fontSize: "10px", color: subColor, marginLeft: "8px" }}>{subtext}</span>
        </div>
        {hasRecent && (
          <span style={{ fontSize: "11px", color: subColor, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none", flexShrink: 0 }}>▾</span>
        )}
      </button>

      {expanded && hasRecent && (
        <div style={{ background: "#fff", border: "1px solid #e8e6e1", borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
          {blocked && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 14px", background: "#fef2f2", borderBottom: "1px solid #fecaca" }}>
              <span style={{ fontSize: "11px" }}>⚠</span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#991b1b" }}>{T.violationBlocked}</span>
            </div>
          )}
          {recent.map((v, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", borderBottom: i < recent.length - 1 ? "1px solid #f5f3ef" : "none" }}>
              <div style={{ fontSize: "11px" }}>
                <span style={{ fontWeight: 600, color: "#5a5855" }}>{v.type}</span>
                {v.note && <span style={{ color: "#a8a5a0" }}> · {v.note}</span>}
              </div>
              <span style={{ fontSize: "10px", color: "#a8a5a0", flexShrink: 0, marginLeft: "8px" }}>
                {new Date(v.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
