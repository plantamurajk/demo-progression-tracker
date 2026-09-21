import { useState, Fragment } from "react";
import { CAREER_LADDER, FARMER_LEVELS, QUAL_HOURS, SC, STATIONS, computeFarmerLevel } from "../lib/domain.js";
import { TRANS, tRank } from "../lib/i18n.jsx";

export function RankCard({ rank, isCurrent, isCompleted, isExpanded, onToggle, promotionReqs, currentLevelIdx = -1, highlights = null, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const activeColor = isCurrent ? "#16a34a" : isCompleted ? "#2d6a4f" : "#6b7280";
  const rt = tRank(rank.id, lang);
  const reqs = promotionReqs || (rt?.reqsForNext ?? rank.reqsForNext);
  const displayLevels = (rt?.levels ?? rank.levels)?.map((l, i) => ({ ...rank.levels?.[i], ...l }));
  const displayDesc = rt?.desc ?? rank.desc;
  const nextRankName = CAREER_LADDER[CAREER_LADDER.findIndex(r => r.id === rank.id) + 1]?.name;
  return (
    <div style={{ marginBottom: "12px" }}>
      <div onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: isExpanded ? "12px 12px 0 0" : "12px", cursor: "pointer", background: isCurrent ? "#fff" : isCompleted ? "#f7f9f7" : "#fbfaf8", border: isCurrent ? `2px solid ${activeColor}` : "1px solid #e8e6e1", boxShadow: isCurrent ? `0 2px 12px ${activeColor}12` : "none", transition: "all 0.2s" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0, background: isCompleted ? "#2d6a4f" : isCurrent ? activeColor : "#e8e6e1", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isCompleted
            ? <span style={{ color: "#fff", fontSize: "16px", fontWeight: 700 }}>✓</span>
            : isCurrent
              ? (rank.levels
                  ? <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>{FARMER_LEVELS[currentLevelIdx]?.id ?? "L1"}</span>
                  : <span style={{ color: "#fff", fontSize: "16px", fontWeight: 700 }}>✓</span>)
              : <span style={{ color: "#a8a5a0", fontSize: "18px", fontWeight: 400 }}>○</span>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "15px", fontWeight: 700, color: isCurrent ? activeColor : isCompleted ? "#2d6a4f" : "#a8a5a0" }}>{rank.name}</span>
            {isCurrent && <span style={{ fontSize: "9px", fontWeight: 700, color: "#fff", background: activeColor, padding: "2px 8px", borderRadius: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{T.currentBadge}</span>}
          </div>
          <div style={{ fontSize: "11px", color: "#8a8780", marginTop: "1px" }}>{rank.pay} · {displayDesc}</div>
        </div>
        <span style={{ fontSize: "12px", color: "#a8a5a0", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "none" }}>▾</span>
      </div>

      {isExpanded && (
        <div style={{ padding: "16px", background: "#fff", borderRadius: "0 0 12px 12px", border: "1px solid #e8e6e1", borderTop: "none" }}>
          {rank.levels && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#5a5855", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>{T.stationLevels}</div>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                {(displayLevels || rank.levels).map((l, idx) => {
                  const done    = idx < currentLevelIdx;
                  const current = idx === currentLevelIdx;
                  const lvl     = rank.levels[idx];
                  return (
                    <Fragment key={idx}>
                      {idx > 0 && (
                        <div style={{ flex: 1, height: "2px", background: idx <= currentLevelIdx ? "#2d6a4f" : "#e8e6e1", marginTop: "14px", transition: "background 0.3s" }} />
                      )}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "56px" }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%",
                          background: done ? "#2d6a4f" : current ? "#fff" : "#f5f3ef",
                          border: current ? "2.5px solid #16a34a" : done ? "none" : "2px solid #d5d2cb",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: current ? "0 0 0 4px #16a34a18" : "none",
                          transition: "all 0.3s",
                        }}>
                          {done
                            ? <span style={{ color: "#fff", fontSize: "11px", fontWeight: 700 }}>✓</span>
                            : <span style={{ fontSize: "10px", fontWeight: 700, color: current ? "#16a34a" : "#a8a5a0" }}>{lvl.l}</span>
                          }
                        </div>
                        <div style={{ marginTop: "6px", textAlign: "center" }}>
                          <div style={{ fontSize: "10px", fontWeight: current ? 700 : 500, color: done ? "#2d6a4f" : current ? "#16a34a" : "#a8a5a0" }}>{lvl.l}</div>
                          <div style={{ fontSize: "10px", color: done ? "#8a8780" : current ? "#5a8a6a" : "#c0bdb8", marginTop: "1px", lineHeight: 1.3 }}>{l.desc}</div>
                          <div style={{ fontSize: "10px", fontWeight: 600, color: done ? "#2d6a4f" : current ? "#16a34a" : "#c0bdb8", marginTop: "2px" }}>{l.bonus}</div>
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          )}
          {reqs && (
            <div>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#5a5855", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                {promotionReqs && nextRankName ? T.toAdvanceTo(nextRankName) : T.requirementsToAdvance}
              </div>
              {reqs.map((req, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 0", borderBottom: i < reqs.length - 1 ? "1px solid #f5f3ef" : "none" }}>
                  {promotionReqs
                    ? <span style={{ width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, background: req.met ? "#e6f5ef" : "#f5f3ef", color: req.met ? "#1a7a5a" : "#d5d2cb" }}>{req.met ? "✓" : "○"}</span>
                    : <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d5d2cb", flexShrink: 0 }} />
                  }
                  <span style={{ flex: 1, fontSize: "12px", fontWeight: 500, color: promotionReqs ? (req.met ? "#3a3935" : "#8a8780") : "#8a8780" }}>{req.label}</span>
                  <span style={{ fontSize: "11px", color: promotionReqs ? (req.met ? "#2d6a4f" : "#a8a5a0") : "#a8a5a0" }}>{req.detail}</span>
                </div>
              ))}
            </div>
          )}
          {rank.minTime && (
            <div style={{ marginTop: "12px", padding: "8px 12px", borderRadius: "8px", background: "#f5f3ef", fontSize: "11px", color: "#8a8780" }}>
              {T.minTimeAtLevel} {rank.minTime}
            </div>
          )}
          {highlights && highlights.length > 0 && (
            <div style={{ marginTop: (reqs || rank.levels || rank.minTime) ? "16px" : "0" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#5a5855", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
                {T.keyResponsibilities}
              </div>
              {highlights.map((h, j) => (
                <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "5px 0", borderBottom: j < highlights.length - 1 ? "1px solid #f5f3ef" : "none" }}>
                  <span style={{ color: isCompleted ? "#2d6a4f" : isCurrent ? "#16a34a" : "#6b7280", fontSize: "11px", marginTop: "1px", flexShrink: 0 }}>▸</span>
                  <span style={{ fontSize: "12px", color: "#5a5855", lineHeight: 1.4 }}>{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export function LadderTab({ emp, isMobile, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const currentRankIdx = CAREER_LADDER.findIndex(r => r.id === emp.rank);
  const { currentIdx: empLevelIdx } = computeFarmerLevel(emp.stationExperience);
  const [expandedRank, setExpandedRank] = useState(emp.rank);
  return (
    <div style={{ padding: "20px", maxWidth: isMobile ? "none" : "680px" }}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "20px", fontWeight: 700, color: "#2a2925", marginBottom: "4px" }}>
          {T.ladderTitle}
        </div>
        <div style={{ fontSize: "12px", color: "#8a8780", lineHeight: 1.5 }}>
          {T.ladderDesc}
        </div>
      </div>
      {CAREER_LADDER.map((rank, i) => {
        const hasHighlights = rank.highlights && !rank.stages && !rank.levels;
        const rt = tRank(rank.id, lang);
        const displayHighlights = rt?.highlights ?? rank.highlights;
        return (
          <div key={rank.id}>
            <RankCard rank={rank}
              isCurrent={i === currentRankIdx}
              isCompleted={i < currentRankIdx}
              isExpanded={expandedRank === rank.id}
              onToggle={() => setExpandedRank(expandedRank === rank.id ? null : rank.id)}
              promotionReqs={i === currentRankIdx ? emp.promotionReqs : null}
              currentLevelIdx={i < currentRankIdx ? 3 : i === currentRankIdx ? empLevelIdx : -1}
              highlights={hasHighlights ? displayHighlights : null}
              lang={lang}
            />
          </div>
        );
      })}
      <div style={{ marginTop: "16px", padding: "14px 16px", borderRadius: "12px", background: "#fff", border: "1px solid #e8e6e1" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935", marginBottom: "6px" }}>
          {T.howStationLevels}
        </div>
        <div style={{ fontSize: "11px", color: "#8a8780", lineHeight: 1.6 }}>
          {T.howStationLevelsDesc(QUAL_HOURS)}
        </div>
        <div style={{ display: "flex", gap: "4px", marginTop: "10px", flexWrap: "wrap" }}>
          {STATIONS.map(s => (
            <span key={s} style={{ fontSize: "9px", fontWeight: 600, padding: "2px 7px", borderRadius: "6px", background: SC[s] + "0c", color: SC[s], border: `1px solid ${SC[s]}15` }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
