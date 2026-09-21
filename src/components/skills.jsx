// ═══════════════════════════════════════════════
//  SKILLS — chips, endorsements, suggestions, forms
// ═══════════════════════════════════════════════

import { useState } from "react";
import { SC, SL_COLORS, SL_LABELS, SKILL_CATS, STATIONS, TODAY } from "../lib/domain.js";
import { TRANS, BilingualText, tContent } from "../lib/i18n.jsx";
import { ACCENT, PendingChip } from "./ui.jsx";

export function SkillChip({ skill, lang = "en" }) {
  const lc = SL_COLORS[skill.level] || "#6b7280";
  const levelLabel = (TRANS[lang] || TRANS.en).skillLevelLabels[skill.level] || SL_LABELS[skill.level];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "20px", background: lc + "0c", border: `1px solid ${lc}20` }}>
      {skill.station && <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: SC[skill.station] || "#6b7280" }} />}
      <BilingualText field={skill.name} lang={lang} style={{ fontSize: "11px", fontWeight: 600, color: "#2a2925" }} />
      <span style={{ fontSize: "9px", fontWeight: 700, color: lc, textTransform: "uppercase", letterSpacing: "0.04em" }}>{levelLabel}</span>
    </div>
  );
}
export function EndorsedSkills({ skills, lang = "en", supervisorMode, onAddSkill, onUpdateSkill, onRemoveSkill }) {
  const T = TRANS[lang] || TRANS.en;
  const [showForm, setShowForm]           = useState(false);
  const [editingIdx, setEditingIdx]       = useState(null);

  function handleSave(skill) {
    if (editingIdx !== null) { onUpdateSkill(editingIdx, skill); setEditingIdx(null); }
    else onAddSkill(skill);
    setShowForm(false);
  }

  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935" }}>{T.endorsedSkills}</div>
        {supervisorMode && !showForm && (
          <button onClick={() => { setEditingIdx(null); setShowForm(true); }} style={{ fontSize: "11px", fontWeight: 600, color: "#2d6a4f", background: "#e6f5ef", border: "1px solid #bbf7d0", borderRadius: "7px", padding: "3px 9px", cursor: "pointer" }}>
            + {lang === "es" ? "Avalar" : "Endorse"}
          </button>
        )}
      </div>
      {supervisorMode && showForm && (
        <SkillEndorseForm
          initial={editingIdx !== null ? skills[editingIdx] : null}
          lang={lang}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingIdx(null); }}
        />
      )}
      {skills.length === 0
        ? <div style={{ fontSize: "12px", color: "#a8a5a0", fontStyle: "italic" }}>{T.noSkillsYet}</div>
        : <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {skills.map((s, i) => {
              if (editingIdx === i && showForm) return null;
              const { text: notesText, sourceLang: notesLang } = tContent(s.notes, lang);
              return (
                <div key={i} style={{ display: "inline-flex", flexDirection: "column", gap: "2px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <SkillChip skill={s} lang={lang} />
                    {supervisorMode && (
                      <>
                        <button onClick={() => { setEditingIdx(i); setShowForm(true); }} style={{ fontSize: "9px", color: "#2d6a4f", background: "#e6f5ef", border: "1px solid #bbf7d0", borderRadius: "4px", padding: "1px 5px", cursor: "pointer" }}>✎</button>
                        <button onClick={() => onRemoveSkill(i)} style={{ fontSize: "9px", color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "4px", padding: "1px 5px", cursor: "pointer" }}>×</button>
                      </>
                    )}
                  </div>
                  {notesText && (
                    <div style={{ fontSize: "9px", color: "#8a8780", paddingLeft: "8px" }}>
                      {notesText}
                      {notesLang && (
                        <span style={{ fontSize: "8px", fontWeight: 700, color: "#a8a5a0", textTransform: "uppercase", marginLeft: "4px", background: "#f5f3ef", border: "1px solid #e8e6e1", borderRadius: "3px", padding: "0 3px" }}>{notesLang}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
      }
    </div>
  );
}

export function DevSuggestions({ suggestions, lang = "en", supervisorMode, onAddDevSuggestion, onRemoveDevSuggestion }) {
  const T = TRANS[lang] || TRANS.en;
  const [showForm, setShowForm] = useState(false);
  if (!supervisorMode && (!suggestions || suggestions.length === 0)) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935" }}>{T.suggestedForYou}</div>
        {supervisorMode && !showForm && (
          <button onClick={() => setShowForm(true)} style={{ fontSize: "11px", fontWeight: 600, color: "#2d6a4f", background: "#e6f5ef", border: "1px solid #bbf7d0", borderRadius: "7px", padding: "3px 9px", cursor: "pointer" }}>
            + {lang === "es" ? "Sugerir" : "Suggest"}
          </button>
        )}
      </div>
      {supervisorMode && showForm && (
        <DevSuggestionForm
          lang={lang}
          onSave={s => { onAddDevSuggestion(s); setShowForm(false); }}
          onCancel={() => setShowForm(false)}
        />
      )}
      {(suggestions || []).map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "11px 14px", borderRadius: "10px", background: "#fff", border: "1px solid #e8e6e1", borderLeft: `4px solid ${ACCENT.amber}`, marginBottom: "6px" }}>
          <div style={{ flex: 1 }}>
            <BilingualText field={d.skill} lang={lang} style={{ fontSize: "12px", fontWeight: 600, color: "#2a2925" }} />
            <div style={{ fontSize: "10px", color: "#8a8780", marginTop: "1px" }}>{T.from} {d.from}{d.station ? ` · ${d.station}` : ""}</div>
            {d.reason && tContent(d.reason, lang).text && (
              <div style={{ fontSize: "10px", color: "#8a8780", marginTop: "3px", fontStyle: "italic" }}>
                <BilingualText field={d.reason} lang={lang} />
              </div>
            )}
          </div>
          {supervisorMode && (
            <button onClick={() => onRemoveDevSuggestion(i)} style={{ fontSize: "11px", color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "5px", padding: "2px 7px", cursor: "pointer", flexShrink: 0 }}>×</button>
          )}
        </div>
      ))}
    </div>
  );
}

export function PendingRequests({ requests, lang = "en" }) {
  const T = TRANS[lang] || TRANS.en;
  const pending = (requests || []).filter(r => r.status === "pending");
  if (pending.length === 0) return null;
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935", marginBottom: "8px" }}>{T.yourRequests}</div>
      {pending.map((r, i) => (
        <div key={i} style={{ padding: "10px 14px", borderRadius: "10px", marginBottom: "5px", background: "#fff", border: "1px solid #e8e6e1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#3a3935" }}>{T.requestTypes[r.type] || r.type}{(r.title || r.station) ? ` — ${r.title || r.station}` : ""}</div>
            <div style={{ fontSize: "10px", color: "#a8a5a0" }}>{r.date}</div>
          </div>
          <PendingChip lang={lang} />
        </div>
      ))}
    </div>
  );
}
// ─── Supervisor skill endorsement form ────────────────────────────────────────

export const BLANK_SKILL = { name: { en: "", es: "" }, level: "competent", category: "technique", station: null, notes: { en: "", es: "" }, endorsedBy: "Jack P.", dateAdded: TODAY };

export function SkillEndorseForm({ initial = null, lang = "en", onSave, onCancel }) {
  const T = TRANS[lang] || TRANS.en;
  const [form, setForm] = useState(initial ?? { ...BLANK_SKILL, name: { en: "", es: "" }, notes: { en: "", es: "" } });
  const [inputLang, setInputLang] = useState(lang);

  function set(path, val) {
    setForm(f => {
      const copy = JSON.parse(JSON.stringify(f));
      const keys = path.split(".");
      let cur = copy;
      keys.slice(0, -1).forEach(k => { cur = cur[k]; });
      cur[keys[keys.length - 1]] = val;
      return copy;
    });
  }

  const canSave = form.name.en.trim() || form.name.es.trim();

  const inputStyle = { width: "100%", padding: "8px 10px", fontSize: "16px", border: "1px solid #e8e6e1", borderRadius: "8px", background: "#fff", color: "#2a2925", boxSizing: "border-box", fontFamily: "inherit" };
  const labelStyle = { fontSize: "10px", fontWeight: 700, color: "#5a5855", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px", display: "block" };

  return (
    <div style={{ background: "#f0fdf7", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "16px", marginBottom: "10px" }}>

      {/* Language toggle for input */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#166534" }}>
          {initial ? (lang === "es" ? "Editar Habilidad" : "Edit Skill") : (lang === "es" ? "Avalar Habilidad" : "Endorse Skill")}
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {["en", "es"].map(l => (
            <button key={l} onClick={() => setInputLang(l)} style={{ fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "6px", border: "none", cursor: "pointer", background: inputLang === l ? "#2d6a4f" : "#e6f5ef", color: inputLang === l ? "#fff" : "#2d6a4f" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div style={{ marginBottom: "10px" }}>
        <label style={labelStyle}>{lang === "es" ? "Nombre de la Habilidad" : "Skill Name"}</label>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ flex: 1 }}>
            <input
              placeholder={inputLang === "en" ? "e.g. Case Packing (speed)" : "e.g. Velocidad de Empaque"}
              value={form.name[inputLang] || ""}
              onChange={e => set(`name.${inputLang}`, e.target.value)}
              style={inputStyle}
            />
            <div style={{ fontSize: "9px", color: "#8a8780", marginTop: "2px", marginLeft: "2px" }}>{inputLang.toUpperCase()}</div>
          </div>
          <div style={{ flex: 1 }}>
            <input
              placeholder={inputLang === "en" ? "Spanish (optional)" : "Inglés (opcional)"}
              value={form.name[inputLang === "en" ? "es" : "en"] || ""}
              onChange={e => set(`name.${inputLang === "en" ? "es" : "en"}`, e.target.value)}
              style={{ ...inputStyle, background: "#f9fafb", color: "#5a5855" }}
            />
            <div style={{ fontSize: "9px", color: "#8a8780", marginTop: "2px", marginLeft: "2px" }}>{(inputLang === "en" ? "es" : "en").toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Category / Level row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
        <div>
          <label style={labelStyle}>{lang === "es" ? "Categoría" : "Category"}</label>
          <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
            {SKILL_CATS.map(c => <option key={c.id} value={c.id}>{T.skillCatLabels[c.id] || c.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{lang === "es" ? "Nivel" : "Level"}</label>
          <select value={form.level} onChange={e => set("level", e.target.value)} style={inputStyle}>
            {["learning", "competent", "proficient", "certified"].map(l => (
              <option key={l} value={l}>{T.skillLevelLabels[l]}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Station row — full width */}
      <div style={{ marginBottom: "10px" }}>
        <label style={labelStyle}>{lang === "es" ? "Estación" : "Station"}</label>
        <select value={form.station || ""} onChange={e => set("station", e.target.value || null)} style={inputStyle}>
          <option value="">{lang === "es" ? "General" : "General"}</option>
          {STATIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>{lang === "es" ? "Notas (opcional)" : "Notes (optional)"}</label>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ flex: 1 }}>
            <textarea
              rows={2}
              placeholder={inputLang === "en" ? "e.g. Consistently hits 40+ cases/hr" : "e.g. Alcanza 40+ cajas/hora"}
              value={form.notes[inputLang] || ""}
              onChange={e => set(`notes.${inputLang}`, e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            <div style={{ fontSize: "9px", color: "#8a8780", marginTop: "2px", marginLeft: "2px" }}>{inputLang.toUpperCase()}</div>
          </div>
          <div style={{ flex: 1 }}>
            <textarea
              rows={2}
              placeholder={inputLang === "en" ? "Spanish (optional)" : "Inglés (opcional)"}
              value={form.notes[inputLang === "en" ? "es" : "en"] || ""}
              onChange={e => set(`notes.${inputLang === "en" ? "es" : "en"}`, e.target.value)}
              style={{ ...inputStyle, resize: "vertical", background: "#f9fafb", color: "#5a5855" }}
            />
            <div style={{ fontSize: "9px", color: "#8a8780", marginTop: "2px", marginLeft: "2px" }}>{(inputLang === "en" ? "es" : "en").toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => canSave && onSave({ ...form, name: { en: form.name.en.trim(), es: form.name.es.trim() || null }, notes: { en: form.notes.en.trim() || null, es: form.notes.es.trim() || null } })}
          style={{ flex: 1, padding: "9px", minHeight: "44px", fontSize: "12px", fontWeight: 600, background: canSave ? "#2d6a4f" : "#d5d2cb", color: "#fff", border: "none", borderRadius: "8px", cursor: canSave ? "pointer" : "default" }}
        >
          {T.submitRequest}
        </button>
        <button onClick={onCancel} style={{ padding: "9px 16px", minHeight: "44px", fontSize: "12px", fontWeight: 600, background: "#fff", color: "#8a8780", border: "1px solid #d5d2cb", borderRadius: "8px", cursor: "pointer" }}>
          {T.cancel}
        </button>
      </div>
    </div>
  );
}

export function DevSuggestionForm({ lang = "en", onSave, onCancel }) {
  const T = TRANS[lang] || TRANS.en;
  const [inputLang, setInputLang] = useState(lang);
  const [form, setForm] = useState({ skill: { en: "", es: "" }, station: null, from: "Jack P.", reason: { en: "", es: "" } });

  function set(path, val) {
    setForm(f => {
      const copy = JSON.parse(JSON.stringify(f));
      const keys = path.split(".");
      let cur = copy;
      keys.slice(0, -1).forEach(k => { cur = cur[k]; });
      cur[keys[keys.length - 1]] = val;
      return copy;
    });
  }

  const canSave = form.skill.en.trim() || form.skill.es.trim();
  const inputStyle = { width: "100%", padding: "8px 10px", fontSize: "16px", border: "1px solid #e8e6e1", borderRadius: "8px", background: "#fff", color: "#2a2925", boxSizing: "border-box", fontFamily: "inherit" };
  const labelStyle = { fontSize: "10px", fontWeight: 700, color: "#5a5855", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px", display: "block" };

  return (
    <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", padding: "16px", marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#92400e" }}>{lang === "es" ? "Sugerir Aprendizaje" : "Suggest Learning"}</div>
        <div style={{ display: "flex", gap: "4px" }}>
          {["en", "es"].map(l => (
            <button key={l} onClick={() => setInputLang(l)} style={{ fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "6px", border: "none", cursor: "pointer", background: inputLang === l ? "#2d6a4f" : "#e6f5ef", color: inputLang === l ? "#fff" : "#2d6a4f" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label style={labelStyle}>{lang === "es" ? "Habilidad / Área" : "Skill / Area"}</label>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ flex: 1 }}>
            <input placeholder={inputLang === "en" ? "e.g. Wash Line Operation" : "e.g. Operación de Lavado"} value={form.skill[inputLang] || ""} onChange={e => set(`skill.${inputLang}`, e.target.value)} style={inputStyle} />
            <div style={{ fontSize: "9px", color: "#8a8780", marginTop: "2px", marginLeft: "2px" }}>{inputLang.toUpperCase()}</div>
          </div>
          <div style={{ flex: 1 }}>
            <input placeholder={inputLang === "en" ? "Spanish (optional)" : "Inglés (opcional)"} value={form.skill[inputLang === "en" ? "es" : "en"] || ""} onChange={e => set(`skill.${inputLang === "en" ? "es" : "en"}`, e.target.value)} style={{ ...inputStyle, background: "#f9fafb", color: "#5a5855" }} />
            <div style={{ fontSize: "9px", color: "#8a8780", marginTop: "2px", marginLeft: "2px" }}>{(inputLang === "en" ? "es" : "en").toUpperCase()}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
        <div>
          <label style={labelStyle}>{lang === "es" ? "Estación" : "Station"}</label>
          <select value={form.station || ""} onChange={e => set("station", e.target.value || null)} style={inputStyle}>
            <option value="">{lang === "es" ? "General" : "General"}</option>
            {STATIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{lang === "es" ? "De parte de" : "From"}</label>
          <input value={form.from} onChange={e => set("from", e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>{lang === "es" ? "Razón (opcional)" : "Reason (optional)"}</label>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ flex: 1 }}>
            <input placeholder={inputLang === "en" ? "e.g. 8h from qualification" : "e.g. A 8h de calificarse"} value={form.reason[inputLang] || ""} onChange={e => set(`reason.${inputLang}`, e.target.value)} style={inputStyle} />
            <div style={{ fontSize: "9px", color: "#8a8780", marginTop: "2px", marginLeft: "2px" }}>{inputLang.toUpperCase()}</div>
          </div>
          <div style={{ flex: 1 }}>
            <input placeholder={inputLang === "en" ? "Spanish (optional)" : "Inglés (opcional)"} value={form.reason[inputLang === "en" ? "es" : "en"] || ""} onChange={e => set(`reason.${inputLang === "en" ? "es" : "en"}`, e.target.value)} style={{ ...inputStyle, background: "#f9fafb", color: "#5a5855" }} />
            <div style={{ fontSize: "9px", color: "#8a8780", marginTop: "2px", marginLeft: "2px" }}>{(inputLang === "en" ? "es" : "en").toUpperCase()}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => canSave && onSave({ skill: { en: form.skill.en.trim(), es: form.skill.es.trim() || null }, station: form.station, from: form.from, reason: { en: form.reason.en.trim() || null, es: form.reason.es.trim() || null } })}
          style={{ flex: 1, padding: "9px", minHeight: "44px", fontSize: "12px", fontWeight: 600, background: canSave ? "#2d6a4f" : "#d5d2cb", color: "#fff", border: "none", borderRadius: "8px", cursor: canSave ? "pointer" : "default" }}
        >
          {T.submitRequest}
        </button>
        <button onClick={onCancel} style={{ padding: "9px 16px", minHeight: "44px", fontSize: "12px", fontWeight: 600, background: "#fff", color: "#8a8780", border: "1px solid #d5d2cb", borderRadius: "8px", cursor: "pointer" }}>
          {T.cancel}
        </button>
      </div>
    </div>
  );
}
