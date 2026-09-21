import { useState } from "react";
import { CAREER_LADDER, NAV_TABS, STATIONS, computeDaysInRole, computeFarmerLevel } from "../lib/domain.js";
import { TRANS, tStage } from "../lib/i18n.jsx";

// ═══════════════════════════════════════════════
//  LAYOUT COMPONENTS
// ═══════════════════════════════════════════════

export function DesktopSidebar({ emp, tab, onTabChange, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const [hoveredTab, setHoveredTab] = useState(null);
  const days = computeDaysInRole(emp.rankStartDate || emp.startDate);
  const hasPending = (emp.pendingRequests || []).some(r => r.status === "pending");
  const currentRankIdx = CAREER_LADDER.findIndex(r => r.id === emp.rank);
  const currentStages  = CAREER_LADDER[currentRankIdx]?.stages || [];
  const isFarmer = emp.rank !== "Farmhand";
  const qualCount = (emp.stationExperience || []).filter(e => e.qualified).length;
  const farmerLevel = isFarmer ? computeFarmerLevel(emp.stationExperience) : null;

  return (
    <div style={{ width: "220px", flexShrink: 0, background: "linear-gradient(180deg, #1a3a5c 0%, #16304e 100%)", display: "flex", flexDirection: "column", borderRight: "1px solid #1e3d5e", position: "sticky", top: "48px", height: "calc(100vh - 48px)", overflowY: "auto" }}>
      {/* Profile */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1e3d5e" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#ffffff14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 800, color: "#fff", border: "1.5px solid #ffffff18", marginBottom: "12px" }}>
          {emp.name.charAt(0)}
        </div>
        <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{emp.name}</div>
        <div style={{ fontSize: "11px", color: "#ffffff66", marginTop: "3px" }}>{emp.rank}</div>
        <div style={{ marginTop: "5px", fontSize: "11px", color: "#cce866", fontWeight: 600 }}>{lang === "es" ? "Día" : "Day"} {days}</div>
        <div style={{ display: "flex", gap: "6px", marginTop: "12px", flexWrap: "wrap" }}>
          {[
            isFarmer
              ? { v: qualCount,              l: T.qualifiedStat }
              : { v: emp.stationExperience.length, l: T.stnsOf(STATIONS.length) },
            { v: emp.skills.length,          l: T.skillsStat },
            { v: emp.assessments.length,     l: T.passedStat },
          ].map((s, i) => (
            <div key={i} style={{ padding: "6px 10px", borderRadius: "8px", background: "#ffffff0c", border: "1px solid #ffffff12", display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>{s.v}</span>
              <span style={{ fontSize: "10px", color: "#ffffff66" }}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "10px", flex: 1 }}>
        {NAV_TABS.map(t => (
          <button key={t.id} onClick={() => onTabChange(t.id)} onMouseEnter={() => setHoveredTab(t.id)} onMouseLeave={() => setHoveredTab(null)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", marginBottom: "2px", background: tab === t.id ? "#ffffff18" : hoveredTab === t.id ? "#ffffff0e" : "transparent", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}>
            <span style={{ fontSize: "16px", opacity: tab === t.id ? 1 : hoveredTab === t.id ? 0.7 : 0.45, transition: "opacity 0.15s" }}>{t.icon}</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: tab === t.id ? "#fff" : hoveredTab === t.id ? "#ffffffaa" : "#ffffff55", flex: 1, transition: "color 0.15s" }}>{T["tab" + t.id.charAt(0).toUpperCase() + t.id.slice(1)]}</span>
            {t.id === "myPath" && hasPending && (
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: "14px 18px", borderTop: "1px solid #1e3d5e" }}>
        {isFarmer ? (
          <>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#cce866", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>{T.stationLevel}</div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>
              {farmerLevel.currentLevel} · {farmerLevel.qualCount}/7 {T.stationsQualified}
            </div>
            {farmerLevel.neededForNext > 0 && (
              <div style={{ fontSize: "10px", color: "#ffffff55", marginTop: "3px" }}>
                {farmerLevel.neededForNext} {T.moreTo} {farmerLevel.nextLevel}
              </div>
            )}
            {(emp.rank === "Senior Farmer" || emp.rank === "Supervisor") && emp.promotionReqs && (
              <div style={{ fontSize: "10px", color: "#ffffff55", marginTop: "5px", paddingTop: "5px", borderTop: "1px solid #1e3d5e" }}>
                {emp.promotionReqs.filter(r => r.met).length}/{emp.promotionReqs.length}{" "}
                {emp.rank === "Supervisor" ? T.agmReqsMet : T.supervisorReqsMet}
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#cce866", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>{T.currentStage}</div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>
              {(() => { const s = currentStages.find(s => s.id === emp.currentStage); return s ? (tStage(s.id, lang)?.name ?? s.name) : "—"; })()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function BottomTabBar({ tab, onTabChange, emp, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const hasPending = (emp.pendingRequests || []).some(r => r.status === "pending");
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "420px", background: "#fff", borderTop: "1.5px solid #e0ddd8", display: "flex", minHeight: "72px", padding: "4px 4px env(safe-area-inset-bottom, 10px)" }}>
      {NAV_TABS.map(t => {
        const isActive = tab === t.id;
        return (
          <button key={t.id} onClick={() => onTabChange(t.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: "4px 2px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", padding: "6px 12px", borderRadius: "14px", background: isActive ? "#e8f0f8" : "transparent", transition: "background 0.18s" }}>
              <div style={{ position: "relative" }}>
                <span style={{ fontSize: "22px", opacity: isActive ? 1 : 0.45, transition: "opacity 0.18s", display: "block" }}>{t.icon}</span>
                {t.id === "myPath" && hasPending && (
                  <div style={{ position: "absolute", top: 0, right: -5, width: "9px", height: "9px", borderRadius: "50%", background: "#f59e0b", border: "2px solid #fff" }} />
                )}
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: isActive ? "#1e3f61" : "#7a7772", transition: "color 0.18s", whiteSpace: "nowrap", lineHeight: 1 }}>
                {T["tab" + t.id.charAt(0).toUpperCase() + t.id.slice(1)]}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════
//  AUTH SCREENS
// ═══════════════════════════════════════════════

export function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf9f7", color: "#8a8780", fontFamily: "'Inter',-apple-system,sans-serif", fontSize: "14px" }}>
      Loading…
    </div>
  );
}

export function LoginScreen({ authError }) {
  const errMsg = {
    unauthorized: "Your Slack account isn't linked to an employee record. Please contact your supervisor.",
    failed: "Sign-in was cancelled or failed. Please try again.",
    error: "Something went wrong during sign-in. Please try again.",
  }[authError];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf9f7", fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "360px", background: "#fff", border: "1px solid #e8e6e1", borderRadius: "16px", padding: "32px 28px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "10px" }}>
          <img src="/logo.png" alt="Beanstalk" style={{ height: "28px", width: "auto" }} />
          <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: "24px", color: "#1e3f61" }}>Beanstalk</span>
        </div>
        <div style={{ fontSize: "13px", color: "#8a8780", marginBottom: "24px" }}>Progression Tracker</div>

        {errMsg && (
          <div style={{ fontSize: "12px", color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 12px", marginBottom: "18px", textAlign: "left" }}>
            {errMsg}
          </div>
        )}

        <a
          href="/auth/slack"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "#4A154B", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: 600, padding: "12px 16px", borderRadius: "10px" }}
        >
          <svg width="18" height="18" viewBox="0 0 122.8 122.8" aria-hidden="true">
            <path fill="#36C5F0" d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"/>
            <path fill="#2EB67D" d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"/>
            <path fill="#ECB22E" d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"/>
            <path fill="#E01E5A" d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"/>
          </svg>
          Sign in with Slack
        </a>
      </div>
    </div>
  );
}
