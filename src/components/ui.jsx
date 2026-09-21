// ═══════════════════════════════════════════════
//  UI PRIMITIVES — shared visual language
//  One accent vocabulary across every rank and tab:
//    green  = on track / current focus
//    amber  = action needed from the employee
//    red    = blocked / expired
//  Cards stay white; the left bar + kicker carry the meaning.
// ═══════════════════════════════════════════════

export const ACCENT = {
  green: "#2d6a4f",
  amber: "#b45309",
  red: "#dc2626",
  neutral: "#8a8780",
};

// White card with a colored left bar — replaces the old full-tint callout cards.
export function Callout({ accent = "green", kicker, title, body, right, children, style }) {
  const c = ACCENT[accent] || accent;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "12px", background: "#fff", border: "1px solid #e8e6e1", borderLeft: `4px solid ${c}`, marginBottom: "10px", ...style }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {kicker && <div style={{ fontSize: "10px", fontWeight: 700, color: c, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: title ? "3px" : 0 }}>{kicker}</div>}
        {title && <div style={{ fontSize: "14px", fontWeight: 700, color: "#2a2925", lineHeight: 1.3 }}>{title}</div>}
        {body && <div style={{ fontSize: "11px", color: "#8a8780", marginTop: "4px", lineHeight: 1.5 }}>{body}</div>}
        {children}
      </div>
      {right && <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "6px" }}>{right}</div>}
    </div>
  );
}

// The one primary-action button. Quiet variant for secondary actions/links.
export const primaryBtn = { fontSize: "12px", fontWeight: 600, color: "#fff", background: "#2d6a4f", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", whiteSpace: "nowrap", minHeight: "36px" };
export const primaryBtnSm = { ...primaryBtn, fontSize: "11px", padding: "5px 12px", minHeight: "32px" };
export const quietBtn = { fontSize: "12px", fontWeight: 600, color: "#2d6a4f", background: "#fff", border: "1px solid #d5d2cb", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", whiteSpace: "nowrap", minHeight: "36px", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" };

// The one "request is pending" chip.
export function PendingChip({ lang = "en" }) {
  return (
    <span style={{ fontSize: "10px", fontWeight: 600, color: "#8a8780", background: "#f5f3ef", border: "1px solid #e8e6e1", padding: "4px 10px", borderRadius: "6px", whiteSpace: "nowrap", textAlign: "center" }}>
      {lang === "es" ? "Pendiente" : "Pending"}
    </span>
  );
}

// Muted uppercase kicker above grouped lists (assessments, modules, …).
export const listKicker = { fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8a8780", marginBottom: "6px" };
