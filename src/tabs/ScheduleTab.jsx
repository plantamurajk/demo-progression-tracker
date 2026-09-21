import { TRANS } from "../lib/i18n.jsx";

export function ScheduleTab({ lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ fontSize: "20px", fontWeight: 700, color: "#2a2925", marginBottom: "4px" }}>{T.tabSchedule}</div>
      <div style={{ fontSize: "12px", color: "#8a8780", marginBottom: "20px" }}>{T.scheduleSubtitle}</div>
      <div style={{ padding: "32px 20px", borderRadius: "12px", background: "#f5f3ef", border: "2px dashed #d5d2cb", textAlign: "center" }}>
        <div style={{ fontSize: "28px", marginBottom: "8px", opacity: 0.4 }}>📅</div>
        <div style={{ fontSize: "14px", fontWeight: 600, color: "#8a8780", marginBottom: "6px" }}>{T.scheduleIntegration}</div>
        <div style={{ fontSize: "12px", color: "#a8a5a0", lineHeight: 1.5, maxWidth: "260px", margin: "0 auto" }}>
          {T.scheduleModuleDesc}
        </div>
        <div style={{ marginTop: "16px", padding: "10px 16px", borderRadius: "8px", background: "#fff", border: "1px solid #e8e6e1", display: "inline-block" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#5a5855", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>{T.expectedData}</div>
          <div style={{ fontSize: "11px", color: "#8a8780", textAlign: "left" }}>
            {T.scheduleItems.map((item, i) => (
              <div key={i} style={{ padding: "2px 0" }}>· {item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
