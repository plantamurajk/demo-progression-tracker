import { useState } from "react";
import { CURRICULUM, DOCTYPE_COLORS, QUAL_HOURS, SC, SKILL_CATS, SL_COLORS, SL_LABELS, STATIONS, getCurriculumForEmployee } from "../lib/domain.js";
import { TRANS, BilingualText, tContent } from "../lib/i18n.jsx";
import { SkillEndorseForm, DevSuggestionForm } from "../components/skills.jsx";
import { AssessmentReadyPrompt, ModuleAssessmentPrompt, ForkliftCertPrompt } from "../components/prompts.jsx";
import { ACCENT, PendingChip, primaryBtnSm, listKicker } from "../components/ui.jsx";

export function FocusSection({ emp, lang, onTabChange }) {
  const items = getCurriculumForEmployee(emp);
  const required = items.filter(i => i.status === "required");

  const sorted = [
    ...required.filter(i => i.assessmentReady),
    ...required.filter(i => !i.assessmentReady && i.category !== "station"),
    ...required.filter(i => !i.assessmentReady && i.category === "station"),
  ];

  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935" }}>
          {lang === "es" ? "Qué Estudiar" : "What to Study"}
        </div>
        {onTabChange && (
          <button onClick={() => onTabChange("library")} style={{ fontSize: "11px", fontWeight: 600, color: "#2d6a4f", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {lang === "es" ? "Recursos →" : "Resources →"}
          </button>
        )}
      </div>
      <div style={{ fontSize: "11px", color: "#a8a5a0", marginBottom: "10px" }}>
        {lang === "es" ? "Materiales más relevantes para tu etapa y estaciones activas" : "Most relevant for your current stage and active stations"}
      </div>

      {sorted.length === 0 ? (
        <div style={{ padding: "14px", fontSize: "12px", color: "#a8a5a0", textAlign: "center", background: "#fff", borderRadius: "10px", border: "1px solid #e8e6e1" }}>
          {lang === "es" ? "Estás al día — todos los materiales están en Recursos." : "You're all caught up — find all materials in the Resources tab."}
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e8e6e1", overflow: "hidden" }}>
          {sorted.map((item, i) => {
            const title = lang === "es" ? item.titleEs : item.titleEn;
            const link  = lang === "es" ? (item.linkEs || item.linkEn) : (item.linkEn || item.linkEs);
            const stationColor = item.station ? SC[item.station] : null;
            const dtColor = DOCTYPE_COLORS[item.docType] || "#6b7280";
            const isLast  = i === sorted.length - 1;
            const rowBg   = i % 2 === 0 ? "#fff" : "#fafaf9";

            return (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderBottom: isLast ? "none" : "1px solid #f5f3ef", background: rowBg }}>
                {stationColor
                  ? <div style={{ width: "3px", alignSelf: "stretch", borderRadius: "2px", background: stationColor, flexShrink: 0 }} />
                  : <div style={{ width: "3px", flexShrink: 0 }} />
                }
                <div style={{ fontSize: "12px", flex: 1, lineHeight: 1.3 }}>
                  {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: "#2d6a4f", fontWeight: 600, textDecoration: "none" }}>
                      {title} →
                    </a>
                  ) : (
                    <span style={{ color: "#2a2925" }}>{title}</span>
                  )}
                  {item.station && <span style={{ fontSize: "10px", color: "#a8a5a0", marginLeft: "5px" }}>· {item.station}</span>}
                </div>
                {item.assessmentReady && !item.assessmentPending && (
                  <span style={{ fontSize: "10px", fontWeight: 600, color: ACCENT.amber, background: "#fff", border: `1px solid ${ACCENT.amber}40`, padding: "3px 8px", borderRadius: "6px", flexShrink: 0, whiteSpace: "nowrap" }}>
                    {lang === "es" ? "Eval. lista ↓" : "Assess ready ↓"}
                  </span>
                )}
                {item.assessmentReady && item.assessmentPending && (
                  <PendingChip lang={lang} />
                )}
                {!link && !item.assessmentReady && (
                  <span style={{ fontSize: "10px", color: "#c0bdb8", flexShrink: 0, fontStyle: "italic" }}>
                    {lang === "es" ? "próximo" : "soon"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MyPathTab({ emp, onSubmitRequest, onSubmitAssessmentRequest, onSubmitModuleRequest, onSubmitForkliftRequest, isMobile, lang = "en", supervisorMode = false, onAddSkill, onUpdateSkill, onRemoveSkill, onAddDevSuggestion, onRemoveDevSuggestion, onTabChange }) {
  const T = TRANS[lang] || TRANS.en;
  const [showForm, setShowForm]         = useState(false);
  const [reqStation, setReqStation]     = useState("");
  const [submitted, setSubmitted]       = useState(false);
  const [showSkillForm, setShowSkillForm]     = useState(false);
  const [editingSkillIdx, setEditingSkillIdx] = useState(null);
  const [selectedSkillIdx, setSelectedSkillIdx] = useState(null);
  const [showSuggestForm, setShowSuggestForm] = useState(false);

  function handleSubmit() {
    if (!reqStation) return;
    onSubmitRequest(reqStation);
    setReqStation("");
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  function handleSaveSkill(skill) {
    if (editingSkillIdx !== null) {
      onUpdateSkill(editingSkillIdx, skill);
      setEditingSkillIdx(null);
    } else {
      onAddSkill(skill);
    }
    setShowSkillForm(false);
  }

  return (
    <div style={{ padding: "20px", maxWidth: isMobile ? "none" : "680px" }}>
      <div style={{ fontSize: "20px", fontWeight: 700, color: "#2a2925", marginBottom: "4px" }}>{T.tabMyPath}</div>
      <div style={{ fontSize: "12px", color: "#8a8780", marginBottom: "20px" }}>{T.myPathSubtitle}</div>

      {emp.rank === "Farmhand"
        ? <>
            <ModuleAssessmentPrompt emp={emp} lang={lang} onSubmitModuleRequest={onSubmitModuleRequest} />
            <ForkliftCertPrompt emp={emp} lang={lang} onSubmitForkliftRequest={onSubmitForkliftRequest} />
          </>
        : <AssessmentReadyPrompt emp={emp} lang={lang} onSubmitRequest={onSubmitAssessmentRequest} />
      }

      {supervisorMode && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 13px", borderRadius: "10px", background: "#fff", border: "1px solid #e8e6e1", borderLeft: `4px solid ${ACCENT.green}`, marginBottom: "20px" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#2d6a4f" }}>{lang === "es" ? "Modo supervisor activo" : "Supervisor mode active"}</span>
        </div>
      )}

      <FocusSection emp={emp} lang={lang} onTabChange={onTabChange} />

      {/* Skills */}
      <div style={{ marginBottom: "22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935" }}>{T.skillsAndEndorsements}</div>
          {supervisorMode && !showSkillForm && (
            <button onClick={() => { setEditingSkillIdx(null); setShowSkillForm(true); }} style={{ fontSize: "11px", fontWeight: 600, color: "#2d6a4f", background: "#e6f5ef", border: "1px solid #bbf7d0", borderRadius: "7px", padding: "4px 10px", cursor: "pointer" }}>
              + {lang === "es" ? "Avalar habilidad" : "Endorse skill"}
            </button>
          )}
        </div>

        {supervisorMode && showSkillForm && (
          <SkillEndorseForm
            initial={editingSkillIdx !== null ? emp.skills[editingSkillIdx] : null}
            lang={lang}
            onSave={handleSaveSkill}
            onCancel={() => { setShowSkillForm(false); setEditingSkillIdx(null); }}
          />
        )}

        {emp.skills.length === 0
          ? <div style={{ fontSize: "12px", color: "#a8a5a0", fontStyle: "italic" }}>{T.noSkillsYet}</div>
          : <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {emp.skills.map((s, i) => {
                const lc = SL_COLORS[s.level];
                const cat = SKILL_CATS.find(c => c.id === s.category);
                const catLabel = T.skillCatLabels[s.category] || cat?.label;
                const levelLabel = T.skillLevelLabels[s.level] || SL_LABELS[s.level];
                const { text: notesText, sourceLang: notesLang } = tContent(s.notes, lang);
                const isEditing = editingSkillIdx === i && showSkillForm;
                if (isEditing) return null;
                const isSelected = selectedSkillIdx === i;
                return (
                  <div key={i} onClick={() => setSelectedSkillIdx(isSelected ? null : i)}
                    style={{ width: isSelected ? "100%" : "auto", borderRadius: "10px", cursor: "pointer", background: isSelected ? "#f7faf8" : "#fff", border: isSelected ? "1px solid #2d6a4f30" : "1px solid #e8e6e1", transition: "all 0.15s", overflow: "hidden" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: cat?.color || "#6b7280", flexShrink: 0 }} />
                      <BilingualText field={s.name} lang={lang} style={{ fontSize: "12px", fontWeight: 600, color: "#2a2925" }} />
                      <span style={{ fontSize: "10px", fontWeight: 700, color: lc, background: lc + "18", padding: "2px 7px", borderRadius: "8px", textTransform: "uppercase" }}>{levelLabel}</span>
                      {isSelected && <span style={{ fontSize: "10px", color: "#a8a5a0", marginLeft: "auto", display: "inline-block", transform: "rotate(180deg)" }}>▾</span>}
                    </div>
                    {isSelected && (
                      <div style={{ padding: "6px 12px 10px 12px", borderTop: "1px solid #e8f0ee" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                          <div style={{ fontSize: "10px", color: "#a8a5a0" }}>
                            {catLabel}{s.station ? ` · ${s.station} ${T.stationSuffix}` : ""}
                            {s.endorsedBy && <span style={{ marginLeft: "6px", color: "#c0bdb8" }}>· {lang === "es" ? "avalado por" : "endorsed by"} {s.endorsedBy}</span>}
                          </div>
                          {supervisorMode && (
                            <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                              <button onClick={e => { e.stopPropagation(); setEditingSkillIdx(i); setShowSkillForm(true); }} style={{ fontSize: "10px", color: "#2d6a4f", background: "#e6f5ef", border: "1px solid #bbf7d0", borderRadius: "5px", padding: "2px 7px", cursor: "pointer" }}>
                                {lang === "es" ? "Editar" : "Edit"}
                              </button>
                              <button onClick={e => { e.stopPropagation(); onRemoveSkill(i); setSelectedSkillIdx(null); }} style={{ fontSize: "10px", color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "5px", padding: "2px 7px", cursor: "pointer" }}>×</button>
                            </div>
                          )}
                        </div>
                        {notesText && (
                          <div style={{ fontSize: "11px", color: "#5a5855", marginTop: "5px", lineHeight: 1.4 }}>
                            {notesText}
                            {notesLang && <span style={{ fontSize: "8px", fontWeight: 700, color: "#a8a5a0", textTransform: "uppercase", marginLeft: "4px", background: "#f5f3ef", border: "1px solid #e8e6e1", borderRadius: "3px", padding: "0 3px" }}>{notesLang}</span>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
        }
      </div>

      {/* Development suggestions — supervisor editable */}
      {(supervisorMode || (emp.devSuggestions && emp.devSuggestions.length > 0)) && (
        <div style={{ marginBottom: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935" }}>{T.suggestedForYou}</div>
            {supervisorMode && !showSuggestForm && (
              <button onClick={() => setShowSuggestForm(true)} style={{ fontSize: "11px", fontWeight: 600, color: "#2d6a4f", background: "#e6f5ef", border: "1px solid #bbf7d0", borderRadius: "7px", padding: "4px 10px", cursor: "pointer" }}>
                + {lang === "es" ? "Sugerir" : "Suggest"}
              </button>
            )}
          </div>
          {supervisorMode && showSuggestForm && (
            <DevSuggestionForm
              lang={lang}
              onSave={s => { onAddDevSuggestion(s); setShowSuggestForm(false); }}
              onCancel={() => setShowSuggestForm(false)}
            />
          )}
          {(emp.devSuggestions || []).map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "11px 14px", borderRadius: "10px", background: "#fff", border: "1px solid #e8e6e1", borderLeft: `4px solid ${ACCENT.amber}`, marginBottom: "6px" }}>
              <div style={{ flex: 1 }}>
                <BilingualText field={d.skill} lang={lang} style={{ fontSize: "12px", fontWeight: 600, color: "#2a2925", display: "block" }} />
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
      )}


      {/* Assessments */}
      <div style={{ marginBottom: "22px" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935", marginBottom: "10px" }}>
          {T.assessmentsHeader}
        </div>

        {/* Training module assessments — all 8 modules */}
        {(() => {
          const modules = CURRICULUM.filter(m => m.docType === "Module").sort((a, b) => a.id.localeCompare(b.id));
          const passedSet  = new Set((emp.assessments     || []).filter(a => a.result === "Pass" && a.module).map(a => a.module));
          const pendingSet = new Set((emp.pendingRequests || []).filter(r => r.status === "pending" && r.module).map(r => r.module));
          const unpassed = modules.filter(m => !passedSet.has(m.id));
          if (unpassed.length === 0) return null;
          return (
            <div style={{ marginBottom: "10px" }}>
              <div style={listKicker}>
                {lang === "es" ? "Módulos de Capacitación" : "Training Modules"}
              </div>
              <div style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e8e6e1", overflow: "hidden" }}>
                {unpassed.map((m, i) => {
                  const title = lang === "es" ? m.titleEs : m.titleEn;
                  const isPending = pendingSet.has(m.id);
                  return (
                    <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: i < unpassed.length - 1 ? "1px solid #f5f3ef" : "none", background: i % 2 === 0 ? "#fafaf9" : "#fff" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#2a2925" }}>{title}</span>
                      {isPending
                        ? <PendingChip lang={lang} />
                        : <button
                            onClick={() => onSubmitModuleRequest && onSubmitModuleRequest(m.id, title)}
                            style={primaryBtnSm}
                          >
                            {lang === "es" ? "Solicitar" : "Request"}
                          </button>
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Available assessments — stations with enough hours but not yet passed */}
        {(() => {
          const stationExp = emp.stationExperience || [];
          const passed = emp.assessments || [];
          const pendingReqs = (emp.pendingRequests || []).filter(r => r.status === "pending");
          const available = [];
          stationExp.forEach(e => {
            if (e.hours < QUAL_HOURS) return;
            ["Practical", "Written"].forEach(type => {
              if (passed.some(a => a.station === e.station && a.type === type && a.result === "Pass")) return;
              const reqType = `${type} Assessment`;
              const isPending = pendingReqs.some(r => r.station === e.station && r.type === reqType);
              available.push({ station: e.station, type, reqType, isPending });
            });
          });
          if (available.length === 0) return null;
          return (
            <div style={{ marginBottom: "10px" }}>
              <div style={listKicker}>
                {lang === "es" ? "Evaluaciones Disponibles" : "Available"}
              </div>
              <div style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e8e6e1", overflow: "hidden" }}>
                {available.map((a, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: i < available.length - 1 ? "1px solid #f5f3ef" : "none", background: i % 2 === 0 ? "#fafaf9" : "#fff" }}>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#2a2925" }}>{a.station}</span>
                      <span style={{ fontSize: "12px", color: "#8a8780" }}> — {lang === "es" ? (a.type === "Practical" ? "Práctica" : "Escrita") : a.type}</span>
                    </div>
                    {a.isPending
                      ? <PendingChip lang={lang} />
                      : <button
                          onClick={() => onSubmitAssessmentRequest(a.station, a.reqType)}
                          style={primaryBtnSm}
                        >
                          {lang === "es" ? "Solicitar" : "Request"}
                        </button>
                    }
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Completed assessments */}
        {emp.assessments.length > 0 && (
          <div>
            <div style={listKicker}>
              {lang === "es" ? "Completadas" : "Completed"}
            </div>
            <div style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e8e6e1", overflow: "hidden" }}>
              {[...emp.assessments].reverse().map((a, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: i < emp.assessments.length - 1 ? "1px solid #f5f3ef" : "none" }}>
                  <div>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#2a2925" }}>{a.title || a.station}</span>
                      <span style={{ fontSize: "12px", color: "#8a8780" }}> — {a.type}</span>
                    </div>
                    <div style={{ fontSize: "10px", color: "#a8a5a0", marginTop: "2px" }}>{a.date}</div>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 600, color: "#2d6a4f" }}>✓ {a.result}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {emp.assessments.length === 0 && (() => {
          const hasAvailableStation = (emp.stationExperience || []).some(e => e.hours >= QUAL_HOURS);
          const hasUnpassedModule = CURRICULUM.filter(m => m.docType === "Module").some(m => !(emp.assessments || []).some(a => a.module === m.id && a.result === "Pass"));
          return (!hasAvailableStation && !hasUnpassedModule)
            ? <div style={{ padding: "14px", fontSize: "12px", color: "#a8a5a0", textAlign: "center", background: "#fff", borderRadius: "10px", border: "1px solid #e8e6e1" }}>{T.noAssessmentsYet}</div>
            : null;
        })()}
      </div>

      {/* Request Training */}
      <div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935", marginBottom: "10px" }}>{T.requestTraining}</div>
        <div style={{ padding: "16px", borderRadius: "12px", background: "#fff", border: "1px solid #e8e6e1", borderLeft: `4px solid ${ACCENT.green}` }}>
          {submitted ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "4px 0" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#2d6a4f", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>✓</span>
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#2a2925" }}>{T.requestSent}</div>
                <div style={{ fontSize: "11px", color: "#8a8780", marginTop: "2px" }}>{T.supervisorWillContact}</div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: "12px", color: "#5a5855", marginBottom: "12px", lineHeight: 1.5 }}>
                {T.wantToLearn}
              </div>
              {!showForm ? (
                <button onClick={() => setShowForm(true)} style={{ padding: "10px 20px", minHeight: "44px", fontSize: "12px", fontWeight: 600, background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", width: "100%" }}>
                  {T.requestCrossTraining}
                </button>
              ) : (
                <div>
                  <select value={reqStation} onChange={e => setReqStation(e.target.value)} style={{ width: "100%", padding: "10px 12px", fontSize: "16px", border: "1px solid #e8e6e1", borderRadius: "8px", background: "#fff", marginBottom: "8px", color: reqStation ? "#2a2925" : "#a8a5a0" }}>
                    <option value="" disabled>{T.selectStation}</option>
                    {STATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={handleSubmit} style={{ flex: 1, padding: "10px", minHeight: "44px", fontSize: "12px", fontWeight: 600, background: "#2d6a4f", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                      {T.submitRequest}
                    </button>
                    <button onClick={() => { setShowForm(false); setReqStation(""); }} style={{ padding: "10px 16px", minHeight: "44px", fontSize: "12px", fontWeight: 600, background: "#fff", color: "#8a8780", border: "1px solid #d5d2cb", borderRadius: "8px", cursor: "pointer" }}>
                      {T.cancel}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
}
