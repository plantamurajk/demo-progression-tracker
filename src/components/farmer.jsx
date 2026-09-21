// ═══════════════════════════════════════════════
//  FARMER WIDGETS — levels, station rings, certs, readiness
// ═══════════════════════════════════════════════

import { Fragment } from "react";
import { SC, QUAL_HOURS, STATIONS, FARMER_LEVELS, computeFarmerLevel, isCertExpired } from "../lib/domain.js";
import { TRANS } from "../lib/i18n.jsx";
import { ACCENT, Callout } from "./ui.jsx";

export function FarmerWhatNext({ emp, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const stationExp = emp.stationExperience || [];
  const qualCount = stationExp.filter(e => e.qualified).length;

  const closestInProgress = stationExp
    .filter(e => !e.qualified && e.hours > 0 && e.hours < QUAL_HOURS)
    .sort((a, b) => b.hours - a.hours)[0];

  let title, body, accent;

  if (closestInProgress) {
    title = T.farmerBuildTitle(closestInProgress.station, closestInProgress.hours, QUAL_HOURS);
    body  = T.farmerBuildBody(QUAL_HOURS - closestInProgress.hours);
    accent = "green";
  } else {
    title = T.farmerStartTitle;
    body  = T.farmerStartBody;
    accent = "amber";
  }

  return (
    <Callout accent={accent} style={{ marginBottom: "20px" }} kicker={T.nextStep} title={title} body={body} />
  );
}

export function FarmerLevelLadder({ emp, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const { currentLevel, currentIdx, qualCount, neededForNext } = computeFarmerLevel(emp.stationExperience);

  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935" }}>{T.stationLevel}</div>
        <div style={{ fontSize: "11px", color: "#8a8780" }}>
          {neededForNext > 0 ? T.moreToNext(neededForNext) : T.allQualified}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {FARMER_LEVELS.map((level, i) => {
          const done    = i < currentIdx;
          const current = i === currentIdx;
          return (
            <Fragment key={level.id}>
              {i > 0 && (
                <div style={{ flex: 1, height: "2px", background: i <= currentIdx ? "#2d6a4f" : "#e8e6e1", marginTop: "15px", transition: "background 0.3s" }} />
              )}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "52px" }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "50%",
                  background: done ? "#2d6a4f" : current ? "#fff" : "#f5f3ef",
                  border: current ? "2.5px solid #16a34a" : done ? "none" : "2px solid #d5d2cb",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: current ? "0 0 0 5px #16a34a18" : "none",
                  transition: "all 0.3s",
                }}>
                  {done
                    ? <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>✓</span>
                    : <span style={{ fontSize: "11px", fontWeight: 700, color: current ? "#16a34a" : "#a8a5a0" }}>{level.id}</span>
                  }
                </div>
                <div style={{ marginTop: "7px", textAlign: "center" }}>
                  <div style={{ fontSize: "10px", fontWeight: current ? 700 : 500, color: done ? "#2d6a4f" : current ? "#16a34a" : "#a8a5a0" }}>
                    {level.id}
                  </div>
                  <div style={{ fontSize: "10px", color: "#a8a5a0", lineHeight: 1.3, marginTop: "1px" }}>
                    {level.stations} {level.stations === 1 ? "stn" : "stns"}
                  </div>
                  {current && (
                    <div style={{ fontSize: "9px", fontWeight: 700, color: "#16a34a", background: "#dcfce7", padding: "2px 6px", borderRadius: "5px", marginTop: "3px", whiteSpace: "nowrap" }}>
                      {qualCount} {T.stationsQualified}
                    </div>
                  )}
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function FarmerStationRing({ station, exp, size = 52, lang = "en", showPositions = true }) {
  const color = SC[station] || "#6b7280";
  const hours = exp?.hours || 0;
  const qualified = exp?.qualified || false;
  const practicalPass = exp?.practicalPass || false;
  const writtenPass   = exp?.writtenPass   || false;
  const showAssessments = qualified || hours >= QUAL_HOURS;
  const positions = (exp?.positions || []).filter(Boolean);

  const pct = Math.min(100, (hours / QUAL_HOURS) * 100);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  // Amber ring when hours are met but assessments pending
  const ringColor = (!qualified && hours >= QUAL_HOURS) ? ACCENT.amber : color;

  const dotSize = Math.max(12, Math.round(size * 0.24));
  const dotFont = Math.max(6, Math.round(size * 0.12));

  return (
    <div style={{ textAlign: "center", width: size + 12 }}>
      <svg width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e8e6e1" strokeWidth="4.5" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={ringColor} strokeWidth="4.5"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dashoffset 1s ease" }} />
        {qualified
          ? <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="central"
              style={{ fontSize: "14px" }}>✓</text>
          : <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="central"
              style={{ fontSize: "11px", fontWeight: 700, fill: ringColor, fontFamily: "'Outfit',sans-serif" }}>{hours || ""}</text>
        }
      </svg>
      <div style={{ fontSize: "9px", fontWeight: 600, color: qualified ? color : "#8a8780", marginTop: "3px", lineHeight: 1.2 }}>
        {station}
      </div>
      {showAssessments ? (
        <div style={{ display: "flex", justifyContent: "center", gap: "3px", marginTop: "3px" }}>
          {[
            [lang === "es" ? "P" : "P", practicalPass, lang === "es" ? "Práctica" : "Practical"],
            [lang === "es" ? "E" : "W", writtenPass,   lang === "es" ? "Escrita"  : "Written"],
          ].map(([letter, passed, tooltip]) => (
            <div key={tooltip} title={`${tooltip}${passed ? " ✓" : ""}`} style={{
              width: dotSize, height: dotSize, borderRadius: "50%",
              background: passed ? "#e6f5ef" : "#fff",
              border: `1px solid ${passed ? "#2d6a4f" : "#d5d2cb"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: Math.max(7, Math.round(size * 0.13)), fontWeight: 700,
              color: passed ? "#2d6a4f" : "#a8a5a0",
              cursor: "default",
            }}>{letter}</div>
          ))}
        </div>
      ) : (
        // Reserve the same vertical space so rings stay aligned
        <div style={{ height: dotSize + 3 }} />
      )}
      {showPositions && qualified && positions.length > 0 ? (
        <div style={{ marginTop: "4px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2px", maxWidth: size + 12, overflow: "hidden" }}>
          {positions.slice(0, 2).map(p => (
            <span key={p} style={{ fontSize: "9px", fontWeight: 600, color: color, background: color + "12", border: `1px solid ${color}20`, borderRadius: "3px", padding: "1px 4px", whiteSpace: "nowrap", lineHeight: 1.4 }}>{p}</span>
          ))}
          {positions.length > 2 && (
            <span style={{ fontSize: "9px", fontWeight: 600, color: "#8a8780", background: "#f5f3ef", border: "1px solid #e8e6e1", borderRadius: "3px", padding: "1px 4px", lineHeight: 1.4 }}>+{positions.length - 2}</span>
          )}
        </div>
      ) : (
        showPositions && <div style={{ height: "16px" }} />
      )}
    </div>
  );
}

export function FarmerStationGrid({ emp, isMobile, lang = "en", title, subtitle, showPositions = true }) {
  const T = TRANS[lang] || TRANS.en;
  const expMap = Object.fromEntries((emp.stationExperience || []).map(e => [e.station, e]));
  const sorted = [...STATIONS].sort((a, b) => (expMap[b]?.hours || 0) - (expMap[a]?.hours || 0));
  // Untouched stations render as a quiet text line instead of empty rings
  const started    = sorted.filter(s => (expMap[s]?.hours || 0) > 0 || expMap[s]?.qualified);
  const notStarted = sorted.filter(s => !((expMap[s]?.hours || 0) > 0 || expMap[s]?.qualified));
  const resolvedTitle = title || T.stationProgress;
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935", marginBottom: "10px" }}>{resolvedTitle}</div>
      <div style={{ display: "flex", gap: isMobile ? "4px" : "10px", flexWrap: "wrap" }}>
        {started.map(s => (
          <FarmerStationRing key={s} station={s} exp={expMap[s]} size={isMobile ? 52 : 64} lang={lang} showPositions={showPositions} />
        ))}
      </div>
      {notStarted.length > 0 && (
        <div style={{ fontSize: "10px", color: "#a8a5a0", marginTop: "8px" }}>
          {T.notStartedStations}: {notStarted.join(" · ")}
        </div>
      )}
      <div style={{ fontSize: "10px", color: "#a8a5a0", marginTop: notStarted.length > 0 ? "3px" : "8px" }}>
        {subtitle || T.qualLine(QUAL_HOURS)}
      </div>
    </div>
  );
}

export function FarmerCertifications({ emp, nextRankLabel = "Sr. Farmer", lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const certs = emp.certifications || [];
  if (certs.length === 0) return null;

  const anyExpired = certs.some(c => c.status === "active" && isCertExpired(c.expires));
  // Show needed certs first, then active ones
  const sorted = [...certs].sort((a, b) => {
    const aNeeded = a.status !== "active";
    const bNeeded = b.status !== "active";
    if (aNeeded && !bNeeded) return -1;
    if (!aNeeded && bNeeded) return 1;
    return 0;
  });

  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935", marginBottom: "10px" }}>{T.certifications}</div>
      {anyExpired && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", background: "#fef2f2", border: "1px solid #fecaca", marginBottom: "10px" }}>
          <span style={{ fontSize: "13px" }}>⚠</span>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#991b1b" }}>{T.certExpiredWarning}</span>
        </div>
      )}
      {sorted.map((cert, i) => {
        const expired     = cert.status === "active" && isCertExpired(cert.expires);
        const isActive    = cert.status === "active" && !expired;
        const isNotStarted = cert.status !== "active";

        const accent      = expired ? ACCENT.red : isNotStarted ? ACCENT.amber : null;
        const iconBg      = expired ? "#fef2f2" : isActive ? "#e6f5ef" : "#f5f3ef";
        const iconColor   = expired ? "#dc2626" : isActive ? "#1a7a5a" : "#8a8780";
        const iconChar    = expired ? "!" : isActive ? "✓" : "○";
        const badgeBg     = expired ? "#fef2f2" : isActive ? "#e6f5ef" : "#f5f3ef";
        const badgeColor  = expired ? "#dc2626" : isActive ? "#1a7a5a" : "#8a8780";
        const badgeText   = expired ? T.expiredLabel : isActive ? T.active : T.notStarted;

        return (
          <div key={i} style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e8e6e1", borderLeft: accent ? `4px solid ${accent}` : "1px solid #e8e6e1", marginBottom: "8px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "15px", fontWeight: 700, color: iconColor }}>{iconChar}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#2a2925", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cert.name}</div>
                {expired && (
                  <div style={{ fontSize: "10px", color: "#dc2626", marginTop: "2px", fontWeight: 600 }}>
                    {T.expiresLabel} {cert.expires} — {T.expiredLabel.toLowerCase()}
                  </div>
                )}
                {isActive && cert.expires && (
                  <div style={{ fontSize: "10px", color: "#8a8780", marginTop: "2px" }}>{T.expiresLabel} {cert.expires}</div>
                )}
                {isActive && !cert.expires && (
                  <div style={{ fontSize: "10px", color: "#8a8780", marginTop: "2px" }}>
                    {T.noExpiration}
                    {cert.earned ? ` · ${T.certEarned} ${cert.earned}` : ""}
                  </div>
                )}
                {isNotStarted && (
                  <div style={{ fontSize: "10px", color: ACCENT.amber, fontWeight: 600, marginTop: "2px" }}>
                    {T.requiredFor} {nextRankLabel}
                  </div>
                )}
              </div>
              <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", padding: "2px 8px", borderRadius: "8px", color: badgeColor, background: badgeBg, flexShrink: 0 }}>
                {badgeText}
              </span>
            </div>
            {/* Action row */}
            {(isNotStarted || expired) && (
              <div style={{ borderTop: "1px solid #f5f3ef", padding: "9px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "10px", color: "#8a8780" }}>{T.trainingAvailable}</span>
                <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: "10px", fontWeight: 600, color: "#2d6a4f", textDecoration: "none" }}>
                  {T.viewCourse}
                </a>
              </div>
            )}
            {isActive && (
              <div style={{ borderTop: "1px solid #f5f3ef", padding: "9px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "10px", color: "#8a8780" }}>{T.certDocument}</span>
                <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: "10px", fontWeight: 600, color: "#2d6a4f", textDecoration: "none" }}>
                  {T.viewPDF}
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function FarmerPromotionReadiness({ promotionReqs, label = "Sr. Farmer Readiness", lang = "en" }) {
  if (!promotionReqs || promotionReqs.length === 0) return null;
  const metCount = promotionReqs.filter(r => r.met).length;
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935" }}>{label}</div>
        <span style={{ fontSize: "11px", fontWeight: 600, color: metCount === promotionReqs.length ? "#2d6a4f" : "#8a8780" }}>
          {metCount}/{promotionReqs.length}
        </span>
      </div>
      <div style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e8e6e1", overflow: "hidden" }}>
        {promotionReqs.map((req, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderBottom: i < promotionReqs.length - 1 ? "1px solid #f5f3ef" : "none" }}>
            <span style={{ width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, background: req.met ? "#e6f5ef" : "#f5f3ef", color: req.met ? "#1a7a5a" : "#d5d2cb" }}>
              {req.met ? "✓" : "○"}
            </span>
            <span style={{ flex: 1, fontSize: "12px", fontWeight: 500, color: req.met ? "#3a3935" : "#8a8780" }}>{req.label}</span>
            <span style={{ fontSize: "10px", color: req.met ? "#2d6a4f" : "#a8a5a0", flexShrink: 0 }}>{req.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
