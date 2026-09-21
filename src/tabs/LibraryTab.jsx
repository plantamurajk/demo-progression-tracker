import { CURRICULUM, DOCTYPE_COLORS, stationsData } from "../lib/domain.js";

export function DocRow({ item, lang }) {
  const title  = lang === "es" ? item.titleEs : item.titleEn;
  const link   = lang === "es" ? (item.linkEs || item.linkEn) : item.linkEn;
  const dtColor = DOCTYPE_COLORS[item.docType] || "#6b7280";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 0", borderBottom: "1px solid #f5f3ef" }}>
      <span style={{ fontSize: "14px", color: "#c0bdb8", flexShrink: 0, lineHeight: 1 }}>•</span>
      {link
        ? <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#2d6a4f", textDecoration: "underline", flex: 1 }}>{title}</a>
        : <span style={{ fontSize: "12px", color: "#a8a5a0", flex: 1 }}>{title}<span style={{ fontSize: "10px", marginLeft: "6px", color: "#c0bdb8" }}>(coming soon)</span></span>
      }
    </div>
  );
}

export function LibrarySection({ title, children }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#2a2925", marginBottom: "10px" }}>{title}</div>
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e8e6e1", padding: "0 16px", boxShadow: "0 1px 4px #0000000a" }}>
        {children}
      </div>
    </div>
  );
}

export function LibraryTab({ isMobile, lang = "en" }) {
  const foundational = CURRICULUM.filter(d => d.category === "foundational");
  const misc         = CURRICULUM.filter(d => d.category === "misc");
  const stationIds   = [...new Set(CURRICULUM.filter(d => d.category === "station").map(d => d.station))];

  return (
    <div style={{ padding: "20px", maxWidth: isMobile ? "none" : "680px" }}>
      <div style={{ fontSize: "20px", fontWeight: 700, color: "#2a2925", marginBottom: "4px" }}>
        {lang === "es" ? "Recursos" : "Resources"}
      </div>
      <div style={{ fontSize: "12px", color: "#8a8780", marginBottom: "24px" }}>
        {lang === "es" ? "Módulos, SOPs y materiales de referencia" : "Training modules, SOPs, and reference materials"}
      </div>

      <LibrarySection title={lang === "es" ? "Módulos de Capacitación" : "Training Modules"}>
        {foundational.map(item => <DocRow key={item.id} item={item} lang={lang} />)}
      </LibrarySection>

      {stationIds.map(stationId => {
        const stationData = stationsData.find(s => s.id === stationId);
        const items = CURRICULUM.filter(d => d.station === stationId);
        const color = stationData?.color || "#6b7280";
        return (
          <div key={stationId} style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color, marginBottom: "10px" }}>{stationId}</div>
            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e8e6e1", padding: "0 16px", boxShadow: "0 1px 4px #0000000a" }}>
              {items.map(item => <DocRow key={item.id} item={item} lang={lang} />)}
            </div>
          </div>
        );
      })}

      <LibrarySection title={lang === "es" ? "Procedimientos Generales" : "General Procedures"}>
        {misc.map(item => <DocRow key={item.id} item={item} lang={lang} />)}
      </LibrarySection>
    </div>
  );
}
