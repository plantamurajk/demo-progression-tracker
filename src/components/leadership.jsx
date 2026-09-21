import { TRANS } from "../lib/i18n.jsx";
import { Callout } from "./ui.jsx";

// ═══════════════════════════════════════════════
//  SENIOR FARMER HOME SUB-COMPONENTS
// ═══════════════════════════════════════════════

export function SrFarmerWhatNext({ emp, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const promotionReqs = emp.promotionReqs || [];
  const training = emp.training || {};
  const trained = (training.peopleTrained || []).length;
  const shifts  = (training.shiftsLed || []).length;
  const TARGET  = 5;
  const metCount = promotionReqs.filter(r => r.met).length;
  const needInterview = promotionReqs.find(r => r.label.toLowerCase().includes("interview") && !r.met);

  let title, body, accent;

  if (trained < TARGET) {
    const remaining = TARGET - trained;
    title = T.srDocMoreTitle(remaining);
    body  = T.srDocMoreBody(trained, TARGET);
    accent = "amber";
  } else if (shifts < TARGET) {
    const remaining = TARGET - shifts;
    title = T.srLeadMoreTitle(remaining);
    body  = T.srLeadMoreBody(shifts, TARGET);
    accent = "amber";
  } else if (needInterview) {
    title = T.srInterviewTitle;
    body  = T.srInterviewBody(metCount, promotionReqs.length);
    accent = "green";
  } else {
    title = T.srEligibleTitle;
    body  = T.srEligibleBody;
    accent = "green";
  }

  return (
    <Callout accent={accent} style={{ marginBottom: "20px" }} kicker={T.nextStep} title={title} body={body} />
  );
}

export function SrFarmerTrainingRecord({ training, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const trained = training?.peopleTrained || [];
  const shifts  = training?.shiftsLed || [];
  const TARGET  = 5;

  const TrackCard = ({ label, sublabel, items, count, barColor, renderRow, nextRole = "Supervisor" }) => (
    <div style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e8e6e1", overflow: "hidden", marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px" }}>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#2a2925" }}>{label}</div>
          <div style={{ fontSize: "10px", color: "#a8a5a0", marginTop: "1px" }}>{sublabel}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "20px", fontWeight: 700, color: count >= TARGET ? "#2d6a4f" : "#3a3935" }}>{count}</span>
          <span style={{ fontSize: "11px", color: "#a8a5a0" }}>/{TARGET}</span>
        </div>
      </div>
      <div style={{ height: "3px", background: "#e8e6e1" }}>
        <div style={{ height: "100%", width: `${Math.min(100, (count / TARGET) * 100)}%`, background: barColor, transition: "width 0.8s ease" }} />
      </div>
      {items.map((item, i) => renderRow(item, i, items.length))}
      {count < TARGET && (
        <div style={{ padding: "9px 14px", background: "#fafaf9", fontSize: "10px", color: "#8a8780", borderTop: items.length > 0 ? "1px solid #f5f3ef" : "none" }}>
          {T.moreNeededFor(TARGET - count, nextRole)}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935", marginBottom: "10px" }}>{T.leadershipActivity}</div>
      <TrackCard
        label={T.peopleTrained} sublabel={T.docCrossTraining}
        items={trained} count={trained.length} barColor="#2d6a4f"
        renderRow={(t, i, len) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: i < len - 1 ? "1px solid #f5f3ef" : "none", borderTop: i === 0 ? "1px solid #f5f3ef" : "none" }}>
            <div style={{ fontSize: "11px" }}>
              <span style={{ fontWeight: 600, color: "#3a3935" }}>{t.name}</span>
              <span style={{ color: "#a8a5a0" }}> · {t.station}</span>
            </div>
            <span style={{ fontSize: "10px", color: "#a8a5a0" }}>{t.date}</span>
          </div>
        )}
      />
      <TrackCard
        label={T.shiftsLed} sublabel={T.docShiftLead}
        items={shifts} count={shifts.length} barColor="#2d6a4f"
        renderRow={(s, i, len) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: i < len - 1 ? "1px solid #f5f3ef" : "none", borderTop: i === 0 ? "1px solid #f5f3ef" : "none" }}>
            <div style={{ fontSize: "11px" }}>
              <span style={{ fontWeight: 600, color: "#3a3935" }}>{s.station}</span>
              {s.note && <span style={{ color: "#a8a5a0" }}> · {s.note}</span>}
            </div>
            <span style={{ fontSize: "10px", color: "#a8a5a0" }}>{s.date}</span>
          </div>
        )}
      />
    </div>
  );
}
// ═══════════════════════════════════════════════
//  SUPERVISOR HOME SUB-COMPONENTS
// ═══════════════════════════════════════════════

export function SupervisorWhatNext({ emp, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const stationExp = emp.stationExperience || [];
  const qualCount  = stationExp.filter(e => e.qualified).length;
  const training   = emp.training || {};
  const shiftsLed  = (training.shiftsLed || []).length;
  const casDone    = (training.correctiveActions || []).length;
  const promotionReqs = emp.promotionReqs || [];
  const metCount   = promotionReqs.filter(r => r.met).length;
  const STATION_TARGET = 7;  // need L4 (all 7) for AGM
  const needsMoreStations = qualCount < STATION_TARGET;
  const needsMoreMetrics  = !needsMoreStations && (shiftsLed < 10 || casDone < 10);
  const missingCert = !needsMoreStations && !needsMoreMetrics &&
    (emp.certifications || []).find(c => c.status === "not-started");
  const needsInterview = promotionReqs.find(r => r.label.toLowerCase().includes("interview") && !r.met);

  let title, body, accent;

  if (needsMoreStations) {
    const rem = STATION_TARGET - qualCount;
    title = T.supQualifyTitle(rem);
    body  = T.supQualifyBody(qualCount);
    accent = "amber";
  } else if (needsMoreMetrics) {
    const rawWhat = shiftsLed < 10 ? T.supLeadMore(10 - shiftsLed) : T.supCaMore(10 - casDone);
    title = rawWhat.charAt(0).toUpperCase() + rawWhat.slice(1);
    body  = T.supMetricsBody(shiftsLed, casDone);
    accent = "amber";
  } else if (missingCert) {
    title = T.supCertTitle(missingCert.name);
    body  = T.supCertBody(missingCert.name);
    accent = "amber";
  } else if (needsInterview) {
    title = T.supInterviewTitle;
    body  = T.supInterviewBody(metCount, promotionReqs.length);
    accent = "green";
  } else {
    title = T.supEligibleTitle;
    body  = T.supEligibleBody;
    accent = "green";
  }

  return (
    <Callout accent={accent} style={{ marginBottom: "20px" }} kicker={T.nextStep} title={title} body={body} />
  );
}

export function SupervisorTrainingRecord({ training, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const trained = training?.peopleTrained || [];
  const shifts  = training?.shiftsLed || [];
  const cas     = training?.correctiveActions || [];
  const TARGET  = 10;

  const TrackCard = ({ label, sublabel, items, count, barColor, renderRow }) => (
    <div style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e8e6e1", overflow: "hidden", marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px" }}>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#2a2925" }}>{label}</div>
          <div style={{ fontSize: "10px", color: "#a8a5a0", marginTop: "1px" }}>{sublabel}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "20px", fontWeight: 700, color: count >= TARGET ? "#2d6a4f" : "#3a3935" }}>{count}</span>
          <span style={{ fontSize: "11px", color: "#a8a5a0" }}>/{TARGET}</span>
        </div>
      </div>
      <div style={{ height: "3px", background: "#e8e6e1" }}>
        <div style={{ height: "100%", width: `${Math.min(100, (count / TARGET) * 100)}%`, background: barColor, transition: "width 0.8s ease" }} />
      </div>
      {items.map((item, i) => renderRow(item, i, items.length))}
      {count < TARGET && (
        <div style={{ padding: "9px 14px", background: "#fafaf9", fontSize: "10px", color: "#8a8780", borderTop: items.length > 0 ? "1px solid #f5f3ef" : "none" }}>
          {T.moreNeededFor(TARGET - count, "AGM")}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935", marginBottom: "10px" }}>{T.leadershipActivity}</div>
      <TrackCard
        label={T.shiftsLed} sublabel={T.docShiftLead}
        items={shifts} count={shifts.length} barColor="#2d6a4f"
        renderRow={(s, i, len) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: i < len - 1 ? "1px solid #f5f3ef" : "none", borderTop: i === 0 ? "1px solid #f5f3ef" : "none" }}>
            <div style={{ fontSize: "11px" }}>
              <span style={{ fontWeight: 600, color: "#3a3935" }}>{s.station}</span>
              {s.note && <span style={{ color: "#a8a5a0" }}> · {s.note}</span>}
            </div>
            <span style={{ fontSize: "10px", color: "#a8a5a0" }}>{s.date}</span>
          </div>
        )}
      />
      <TrackCard
        label={T.correctiveActions} sublabel={T.docCA}
        items={cas} count={cas.length} barColor="#2d6a4f"
        renderRow={(c, i, len) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: i < len - 1 ? "1px solid #f5f3ef" : "none", borderTop: i === 0 ? "1px solid #f5f3ef" : "none" }}>
            <div style={{ fontSize: "11px" }}>
              <span style={{ fontWeight: 600, color: "#3a3935" }}>{c.type}</span>
              {c.note && <span style={{ color: "#a8a5a0" }}> · {c.note}</span>}
            </div>
            <span style={{ fontSize: "10px", color: "#a8a5a0" }}>{c.date}</span>
          </div>
        )}
      />
      <TrackCard
        label={T.peopleTrained} sublabel={T.docCrossTraining}
        items={trained} count={trained.length} barColor="#2d6a4f"
        renderRow={(t, i, len) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: i < len - 1 ? "1px solid #f5f3ef" : "none", borderTop: i === 0 ? "1px solid #f5f3ef" : "none" }}>
            <div style={{ fontSize: "11px" }}>
              <span style={{ fontWeight: 600, color: "#3a3935" }}>{t.name}</span>
              <span style={{ color: "#a8a5a0" }}> · {t.station}</span>
            </div>
            <span style={{ fontSize: "10px", color: "#a8a5a0" }}>{t.date}</span>
          </div>
        )}
      />
    </div>
  );
}
