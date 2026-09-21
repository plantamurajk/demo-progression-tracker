// ═══════════════════════════════════════════════
//  I18N — UI strings (EN/ES) + bilingual helpers
// ═══════════════════════════════════════════════

export const TRANS = {
  en: {
    tabHome: "Home", tabLadder: "Ladder", tabSchedule: "Schedule", tabMyPath: "My Path", tabLibrary: "Resources",
    daysInRole: "days in role",
    stationsQualified: "qualified", of: "of", stns: "stns",
    skills: "skills", endorsed: "endorsed",
    assessments: "assessments", passed: "passed",
    stationLevel: "Station Level", currentStage: "Current Stage",
    allQualified: "All stations qualified",
    moreToNext: (n) => `${n} more station${n > 1 ? "s" : ""} to next level`,
    promotionReqsMet: (met, total, role) => `${met}/${total} ${role} reqs met`,
    assessmentReady: "Assessment Ready", inProgress: "In Progress",
    nextStepTag: "Next Step", interviewReady: "Interview Ready",
    trainingRequired: "Training Required", shiftsNeeded: "Shifts Needed",
    eligible: "Eligible",
    nextStep: "Next Step",
    stationProgress: "Station Progress", stationExperience: "Station Experience",
    stationExpertise: "Station Expertise",
    certifications: "Certifications",
    endorsedSkills: "Endorsed Skills", suggestedForYou: "Suggested for You",
    yourRequests: "Your Requests", pending: "Pending",
    leadershipActivity: "Leadership Activity",
    peopleTrained: "People Trained",
    docCrossTraining: "Documented cross-training sessions",
    shiftsLed: "Shifts Led", docShiftLead: "Documented as primary shift lead",
    correctiveActions: "Corrective Actions", docCA: "Documented corrective actions",
    moreNeededFor: (n, role) => `${n} more needed for ${role} promotion`,
    srFarmerReadiness: "Sr. Farmer Readiness",
    supervisorReadiness: "Supervisor Readiness",
    agmReadiness: "AGM Readiness",
    requiredFor: "Required for", expiresLabel: "Expires",
    notStarted: "Not Started", active: "Active",
    qualLine: (h) => `${h}h + Practical + Written = qualified`,
    qualLineExpert: "All 7 stations qualified — L4",
    skillsAndEndorsements: "Skills & Endorsements",
    requestTraining: "Request Training",
    requestCrossTraining: "Request Cross-Training",
    selectStation: "Select a station...",
    submitRequest: "Submit Request", cancel: "Cancel",
    requestSent: "Request sent",
    supervisorWillContact: "Your supervisor will be in touch.",
    wantToLearn: "Want to learn a new station or develop a specific skill? Send a request to your supervisor.",
    cleanRecord: "Clean Record",
    daysSinceViolation: (n) => `${n} days clean`,
    noViolations: "No violations on record",
    recentViolations: "Recent Violations",
    violationBlocked: "Blocked — 2+ violations of the same type in 30 days",
    expiredLabel: "Expired",
    certExpiredWarning: "One or more certifications have expired",
    positions: "Positions",
    notStartedStations: "Not started",
    // RankCard
    stationLevels: "Station Levels",
    toAdvanceTo: (name) => `To advance to ${name}`,
    requirementsToAdvance: "Requirements to advance",
    minTimeAtLevel: "Minimum time at this level:",
    currentBadge: "Current",
    // TrainingMaterials
    trainingMaterials: "Training Materials",
    trainingMaterialsSub: "SOPs, SSOPs, and setup guides for each station",
    linkPending: "(link pending)",
    // StageProgressBar / CurrentFocusBanner
    progress: "Progress",
    currentFocusLabel: "Current Focus",
    // FarmhandHomeContent
    yourJourney: "Your Journey",
    // FarmerWhatNext dynamic
    assessmentsBoth: "both assessments",
    assessmentPractical: "the practical assessment",
    assessmentWritten: "the written assessment",
    farmerScheduleTitle: (station, what) => `${station}: schedule ${what}`,
    farmerScheduleBody: (hours, q, n) => `You've logged ${hours}h — past the ${q}h threshold. Passing the assessment qualifies your ${n} station.`,
    farmerBuildTitle: (station, h, q) => `Build hours at ${station} (${h}/${q}h)`,
    farmerBuildBody: (rem) => `${rem}h more to reach the assessment threshold and unlock your next qualification.`,
    farmerStartTitle: "Start cross-training at a new station",
    farmerStartBody: "Ask your supervisor to schedule time at a station you haven't trained at yet.",
    // SrFarmerWhatNext dynamic
    srDocMoreTitle: (n) => `Document ${n} more training session${n > 1 ? "s" : ""}`,
    srDocMoreBody: (t, target) => `You've trained ${t} of ${target} required people. Ask your supervisor to log your next cross-training session.`,
    srLeadMoreTitle: (n) => `Lead ${n} more shift${n > 1 ? "s" : ""}`,
    srLeadMoreBody: (s, target) => `${s} of ${target} required shifts documented. Step up as lead when the opportunity comes.`,
    srInterviewTitle: "Request your interview panel",
    srInterviewBody: (met, total) => `${met}/${total} requirements met. You're ready to schedule your Supervisor promotion interview.`,
    srEligibleTitle: "All requirements met — you're eligible for Supervisor",
    srEligibleBody: "Talk to your manager about scheduling your promotion.",
    // SupervisorWhatNext dynamic
    supQualifyTitle: (n) => `Qualify at ${n} more station${n > 1 ? "s" : ""} to reach Supervisor L4`,
    supQualifyBody: (q) => `AGM promotion requires L4 — all 7 stations qualified. You're currently at L${q >= 5 ? 3 : q >= 3 ? 2 : 1} (${q}/7).`,
    supLeadMore: (n) => `${n} more shift${n > 1 ? "s" : ""} to lead`,
    supCaMore: (n) => `${n} more corrective action${n > 1 ? "s" : ""} to document`,
    supMetricsBody: (s, c) => `AGM requires 10 shifts led and 10 CAs documented. You're at ${s}/10 shifts, ${c}/10 CAs.`,
    supCertTitle: (name) => `Earn the ${name} certification`,
    supCertBody: (name) => `All station and leadership requirements met. Complete ${name} to clear your AGM checklist.`,
    supInterviewTitle: "Request your AGM interview panel",
    supInterviewBody: (met, total) => `${met}/${total} requirements met. You're ready to schedule your promotion interview.`,
    supEligibleTitle: "All requirements met — you're eligible for AGM",
    supEligibleBody: "Talk to your GM about scheduling your promotion review.",
    // DevSuggestions
    from: "from",
    // CleanRecordBadge
    recentIncident1: "1 recent incident — tap to view",
    recentIncidentN: (n) => `${n} recent incidents — tap to view`,
    // ScheduleTab
    scheduleSubtitle: "Your station assignments for the week",
    scheduleIntegration: "Schedule Integration",
    scheduleModuleDesc: "This module connects to the farm ops scheduling system to display your daily station and position assignments.",
    expectedData: "Expected data",
    scheduleItems: ["Day + date", "Position by time block", "Supervisor by time block"],
    // MyPathTab
    myPathSubtitle: "Your skills, assessments, and training opportunities",
    assessmentsHeader: "Assessments",
    noAssessmentsYet: "No assessments yet",
    noSkillsYet: "No endorsed skills yet.",
    stationSuffix: "station",
    // DesktopSidebar stats
    qualifiedStat: "qualified",
    skillsStat: "skills",
    passedStat: "passed",
    moreTo: "more to",
    agmReqsMet: "AGM reqs met",
    supervisorReqsMet: "supervisor reqs met",
    stnsOf: (n) => `/ ${n} stns`,
    // LadderTab
    ladderTitle: "Ladder",
    ladderDesc: "Explore each role — what it involves, how you advance, and how it affects your pay",
    keyResponsibilities: "Key Responsibilities",
    howStationLevels: "How Station Levels Work",
    howStationLevelsDesc: (q) => `Starting at Farmer, you earn station levels by qualifying at more stations. Each station requires ${q} hours plus a practical and written assessment. Higher levels mean higher pay.`,
    // Skill level labels (override SL_LABELS from data)
    skillLevelLabels: { learning: "Learning", competent: "Competent", proficient: "Proficient", certified: "Certified" },
    // Skill category labels (override SKILL_CATS)
    skillCatLabels: { certification: "Certification", machine: "Machine", technique: "Technique", safety: "Safety", leadership: "Leadership" },
    // Request types
    requestTypes: { "Practical Assessment": "Practical Assessment", "Written Assessment": "Written Assessment", "Cross-Training Request": "Cross-Training Request" },
    // Misc inline strings
    noExpiration: "No expiration",
    certEarned: "Earned",
    trainingAvailable: "Training available",
    viewCourse: "View course →",
    certDocument: "Certificate document",
    viewPDF: "View PDF →",
  },
  es: {
    tabHome: "Inicio", tabLadder: "Escala", tabSchedule: "Horario", tabMyPath: "Mi Avance", tabLibrary: "Recursos",
    daysInRole: "días en el puesto",
    stationsQualified: "calificadas", of: "de", stns: "est.",
    skills: "habilidades", endorsed: "avaladas",
    assessments: "evaluaciones", passed: "aprobadas",
    stationLevel: "Nivel de Estación", currentStage: "Etapa Actual",
    allQualified: "Todas calificadas",
    moreToNext: (n) => `${n} estación${n > 1 ? "es" : ""} más al siguiente nivel`,
    promotionReqsMet: (met, total, role) => `${met}/${total} reqs. de ${role} cumplidos`,
    assessmentReady: "Listo para Evaluación", inProgress: "En Progreso",
    nextStepTag: "Próximo Paso", interviewReady: "Listo para Entrevista",
    trainingRequired: "Capacitación Requerida", shiftsNeeded: "Turnos Faltantes",
    eligible: "Elegible",
    nextStep: "Próximo Paso",
    stationProgress: "Progreso de Estaciones", stationExperience: "Experiencia en Estaciones",
    stationExpertise: "Dominio de Estaciones",
    certifications: "Certificaciones",
    endorsedSkills: "Habilidades Avaladas", suggestedForYou: "Sugerido para Ti",
    yourRequests: "Tus Solicitudes", pending: "Pendiente",
    leadershipActivity: "Actividad de Liderazgo",
    peopleTrained: "Personas Capacitadas",
    docCrossTraining: "Sesiones de capacitación documentadas",
    shiftsLed: "Turnos Dirigidos", docShiftLead: "Turnos dirigidos documentados",
    correctiveActions: "Acciones Correctivas", docCA: "Acciones correctivas documentadas",
    moreNeededFor: (n, role) => `${n} más para la promoción a ${role}`,
    srFarmerReadiness: "Prep. para Sr. Farmer",
    supervisorReadiness: "Prep. para Supervisor",
    agmReadiness: "Prep. para AGM",
    requiredFor: "Requerida para", expiresLabel: "Vence",
    notStarted: "No Iniciada", active: "Activa",
    qualLine: (h) => `${h}h + Práctica + Escrita = calificada`,
    qualLineExpert: "Las 7 estaciones calificadas — N4",
    skillsAndEndorsements: "Habilidades y Avales",
    requestTraining: "Solicitudes de Capacitación",
    requestCrossTraining: "Solicitar Capacitación Cruzada",
    selectStation: "Selecciona una estación...",
    submitRequest: "Enviar Solicitud", cancel: "Cancelar",
    requestSent: "Solicitud enviada",
    supervisorWillContact: "Tu supervisor te contactará pronto.",
    wantToLearn: "¿Quieres aprender una nueva estación? Envía una solicitud a tu supervisor.",
    cleanRecord: "Récord Limpio",
    daysSinceViolation: (n) => `${n} días sin incidentes`,
    noViolations: "Sin infracciones registradas",
    recentViolations: "Incidentes Recientes",
    violationBlocked: "Bloqueado — 2+ infracciones del mismo tipo en 30 días",
    expiredLabel: "Vencida",
    certExpiredWarning: "Una o más certificaciones han vencido",
    positions: "Posiciones",
    notStartedStations: "Sin iniciar",
    // RankCard
    stationLevels: "Niveles de Estación",
    toAdvanceTo: (name) => `Para avanzar a ${name}`,
    requirementsToAdvance: "Requisitos para avanzar",
    minTimeAtLevel: "Tiempo mínimo en este nivel:",
    currentBadge: "Actual",
    // TrainingMaterials
    trainingMaterials: "Materiales de Capacitación",
    trainingMaterialsSub: "SOPs, SSOPs y guías de configuración para cada estación",
    linkPending: "(enlace pendiente)",
    // StageProgressBar / CurrentFocusBanner
    progress: "Progreso",
    currentFocusLabel: "Enfoque Actual",
    // FarmhandHomeContent
    yourJourney: "Tu Trayectoria",
    // FarmerWhatNext dynamic
    assessmentsBoth: "ambas evaluaciones",
    assessmentPractical: "la evaluación práctica",
    assessmentWritten: "la evaluación escrita",
    farmerScheduleTitle: (station, what) => `${station}: programar ${what}`,
    farmerScheduleBody: (hours, q, n) => `Has registrado ${hours}h — superaste el umbral de ${q}h. Pasar la evaluación califica tu ${n}a estación.`,
    farmerBuildTitle: (station, h, q) => `Acumula horas en ${station} (${h}/${q}h)`,
    farmerBuildBody: (rem) => `${rem}h más para alcanzar el umbral de evaluación y desbloquear tu siguiente calificación.`,
    farmerStartTitle: "Empieza capacitación cruzada en una estación nueva",
    farmerStartBody: "Pide a tu supervisor que programe tiempo en una estación donde aún no hayas entrenado.",
    // SrFarmerWhatNext dynamic
    srDocMoreTitle: (n) => `Documenta ${n} sesión${n > 1 ? "es" : ""} más de capacitación`,
    srDocMoreBody: (t, target) => `Has capacitado a ${t} de ${target} personas requeridas. Pide a tu supervisor que registre tu próxima sesión de capacitación cruzada.`,
    srLeadMoreTitle: (n) => `Dirige ${n} turno${n > 1 ? "s" : ""} más`,
    srLeadMoreBody: (s, target) => `${s} de ${target} turnos requeridos documentados. Toma la iniciativa de ser líder cuando surja la oportunidad.`,
    srInterviewTitle: "Solicita tu panel de entrevista",
    srInterviewBody: (met, total) => `${met}/${total} requisitos cumplidos. Estás listo para programar tu entrevista de promoción a Supervisor.`,
    srEligibleTitle: "Todos los requisitos cumplidos — eres elegible para Supervisor",
    srEligibleBody: "Habla con tu gerente sobre programar tu promoción.",
    // SupervisorWhatNext dynamic
    supQualifyTitle: (n) => `Califica en ${n} estación${n > 1 ? "es" : ""} más para alcanzar Supervisor N4`,
    supQualifyBody: (q) => `La promoción a AGM requiere N4 — las 7 estaciones calificadas. Actualmente estás en N${q >= 5 ? 3 : q >= 3 ? 2 : 1} (${q}/7).`,
    supLeadMore: (n) => `${n} turno${n > 1 ? "s" : ""} más por dirigir`,
    supCaMore: (n) => `${n} acción${n > 1 ? "es" : ""} correctiva${n > 1 ? "s" : ""} más por documentar`,
    supMetricsBody: (s, c) => `AGM requiere 10 turnos dirigidos y 10 AC documentadas. Vas ${s}/10 turnos, ${c}/10 AC.`,
    supCertTitle: (name) => `Obtén la certificación ${name}`,
    supCertBody: (name) => `Todos los requisitos de estación y liderazgo cumplidos. Completa ${name} para terminar tu lista de AGM.`,
    supInterviewTitle: "Solicita tu panel de entrevista para AGM",
    supInterviewBody: (met, total) => `${met}/${total} requisitos cumplidos. Estás listo para programar tu entrevista de promoción.`,
    supEligibleTitle: "Todos los requisitos cumplidos — eres elegible para AGM",
    supEligibleBody: "Habla con tu GM sobre programar tu revisión de promoción.",
    // DevSuggestions
    from: "de",
    // CleanRecordBadge
    recentIncident1: "1 incidente reciente — toca para ver",
    recentIncidentN: (n) => `${n} incidentes recientes — toca para ver`,
    // ScheduleTab
    scheduleSubtitle: "Tus asignaciones de estación para la semana",
    scheduleIntegration: "Integración de Horario",
    scheduleModuleDesc: "Este módulo se conecta al sistema de programación de operaciones para mostrar tus asignaciones diarias de estación y posición.",
    expectedData: "Datos esperados",
    scheduleItems: ["Día y fecha", "Asignación de estación", "Posición / rol", "Designaciones flex", "Notas de capacitación cruzada"],
    // MyPathTab
    myPathSubtitle: "Tus habilidades, evaluaciones y oportunidades de capacitación",
    assessmentsHeader: "Evaluaciones",
    noAssessmentsYet: "Sin evaluaciones aún",
    noSkillsYet: "Sin habilidades avaladas aún.",
    stationSuffix: "estación",
    // DesktopSidebar stats
    qualifiedStat: "calificadas",
    skillsStat: "habilidades",
    passedStat: "aprobadas",
    moreTo: "más para",
    agmReqsMet: "reqs. de AGM cumplidos",
    supervisorReqsMet: "reqs. de Supervisor cumplidos",
    stnsOf: (n) => `/ ${n} est.`,
    // LadderTab
    ladderTitle: "Trayectoria Profesional",
    ladderDesc: "Explora cada nivel — qué implica, cómo avanzar y cómo afecta tu pago",
    keyResponsibilities: "Responsabilidades clave",
    howStationLevels: "Cómo funcionan los niveles de estación",
    howStationLevelsDesc: (q) => `A partir de Farmer, ganas niveles de estación al calificarte en más estaciones. Cada estación requiere ${q} horas más una evaluación práctica y escrita. Niveles más altos significan mejor pago.`,
    // Skill level labels (override SL_LABELS from data)
    skillLevelLabels: { learning: "Aprendiendo", competent: "Competente", proficient: "Proficiente", certified: "Certificada" },
    // Skill category labels (override SKILL_CATS)
    skillCatLabels: { certification: "Certificación", machine: "Máquina", technique: "Técnica", safety: "Seguridad", leadership: "Liderazgo" },
    // Request types
    requestTypes: { "Practical Assessment": "Evaluación Práctica", "Written Assessment": "Evaluación Escrita", "Cross-Training Request": "Solicitud de Capacitación Cruzada" },
    // Misc inline strings
    noExpiration: "No vence",
    certEarned: "Obtenida",
    trainingAvailable: "Capacitación disponible",
    viewCourse: "Ver curso →",
    certDocument: "Documento del certificado",
    viewPDF: "Ver PDF →",
  },
};

// Translations for data-driven content from roles.json
export const STAGE_TRANS = {
  es: {
    onboarding:    { name: "Orientación",           desc: "Conceptos básicos de RRHH, seguridad, emergencias y tour de estaciones",
      items: [
        { id: "hr_complete",           label: "Orientación de RRHH completa" },
        { id: "safety_training",       label: "Capacitación de seguridad (EPP, lavado de manos, guantes)" },
        { id: "station_tour",          label: "Tour de estaciones con compañero" },
        { id: "emergency_procedures",  label: "Revisión de procedimientos de emergencia" },
        { id: "station_shadow",        label: "Sombra en estación principal" },
      ] },
    foundations:   { name: "Fundamentos",            desc: "Construyendo independencia en tu estación principal",
      items: [
        { id: "independent_tasks",      label: "Tareas básicas de forma independiente" },
        { id: "safety_quiz",            label: "Examen de seguridad aprobado" },
        { id: "clean_safety_record",    label: "Récord de seguridad limpio" },
        { id: "attendance_satisfactory",label: "Asistencia satisfactoria" },
        { id: "working_at_pace",        label: "Trabajando al ritmo esperado" },
      ] },
    proficiency:   { name: "Desarrollando Habilidades", desc: "Capacitación cruzada y ampliando tus capacidades",
      items: [
        { id: "multi_station",       label: "Familiarizado con 2+ estaciones" },
        { id: "production_schedule", label: "Comprende el programa de producción" },
        { id: "good_attendance",     label: "Buen récord de asistencia" },
        { id: "cross_training",      label: "Capacitación cruzada iniciada" },
      ] },
    "farmer-ready":{ name: "Listo para Farmer",     desc: "Completa las evaluaciones y la certificación de montacargas para obtener tu ascenso.",
      items: [
        { id: "knowledge_reqs",            label: "Requisitos de conocimiento cumplidos" },
        { id: "performance_reqs",          label: "Requisitos de rendimiento cumplidos" },
        { id: "supervisor_recommendation", label: "Recomendación del supervisor" },
        { id: "forklift_cert",             label: "Certificación de montacargas" },
      ] },
  },
};

export const RANK_TRANS = {
  es: {
    "Farmhand":      { desc: "Aprende lo básico. Construye tu base.",
      reqsForNext: [{ label: "Tiempo en el puesto", detail: "3 meses" }, { label: "Récord limpio", detail: "3 meses" }, { label: "Todas las etapas completadas", detail: "Orientación hasta Listo para Farmer" }, { label: "Certificación de montacargas", detail: "Requerida" }, { label: "Recomendación del supervisor", detail: "Requerida" }] },
    "Farmer":        { desc: "Maneja una estación. Desarrolla experiencia cruzada.",
      reqsForNext: [{ label: "Tiempo en el puesto", detail: "6 meses" }, { label: "Récord limpio", detail: "6 meses" }, { label: "Farmer N3", detail: "5 estaciones calificadas" }, { label: "Panel de entrevista", detail: "Requerido" }, { label: "Certificación Haz-Chem", detail: "Requerida" }, { label: "Certificación FSMA", detail: "Requerida" }],
      levels: [{ bonus: "Tarifa base", desc: "Calificado en 1 estación" }, { bonus: "+$0.50/hr", desc: "Calificado en 3 estaciones" }, { bonus: "+$0.50/hr", desc: "Calificado en 5 estaciones" }, { bonus: "+$2.00/hr", desc: "Calificado en las 7 estaciones" }] },
    "Senior Farmer": { desc: "Capacita a otros. Lidera con el ejemplo.",
      reqsForNext: [{ label: "Tiempo en el puesto", detail: "6 meses" }, { label: "Récord limpio", detail: "12 meses" }, { label: "Sr. Farmer N4", detail: "Todas las estaciones calificadas" }, { label: "Panel de entrevista", detail: "Requerido" }, { label: "Certificación HACCP", detail: "Requerida" }, { label: "Certificación CPR/DEA", detail: "Requerida" }, { label: "5+ personas capacitadas", detail: "Documentado" }, { label: "5+ turnos dirigidos", detail: "Documentado" }],
      levels: [{ bonus: "Tarifa base", desc: "1 estación" }, { bonus: "+$0.50/hr", desc: "3 estaciones" }, { bonus: "+$0.50/hr", desc: "5 estaciones" }, { bonus: "+$2.00/hr", desc: "Todas las estaciones" }] },
    "Supervisor":    { desc: "Dueño del turno. Aplica los estándares. Construye el equipo.",
      reqsForNext: [{ label: "Tiempo en el puesto", detail: "6 meses" }, { label: "Récord limpio", detail: "12 meses" }, { label: "Supervisor N4", detail: "Las 7 estaciones calificadas" }, { label: "Panel de entrevista", detail: "Requerido" }, { label: "Practicante SQF", detail: "Requerido" }, { label: "OSHA 10 horas", detail: "Requerido" }],
      levels: [{ bonus: "Tarifa base", desc: "1 estación" }, { bonus: "+$1.00/hr", desc: "3 estaciones" }, { bonus: "+$1.00/hr", desc: "5 estaciones" }, { bonus: "+$3.00/hr", desc: "Todas las estaciones" }] },
    "AGM":           { desc: "Dirige las operaciones diarias. Gestiona incidentes. Desarrolla el programa.",
      highlights: ["Responsable de las operaciones diarias — estándares del piso, programación, respuesta a incidentes", "Lidera proyectos de mejora Lean/5S; instruye y realiza auditorías", "Revisión mensual de operaciones con el GM", "Competencia informática de nivel intermedio a avanzado; informes estadísticos escritos", "10+ turnos dirigidos y 10+ acciones correctivas revisadas y documentadas", "Lidera simulacros de respuesta a incidentes (3+ en rol de liderazgo)"],
      reqsForNext: [{ label: "Tiempo en el puesto", detail: "6 meses" }, { label: "Récord limpio", detail: "12 meses" }, { label: "AGM N4", detail: "Todas las estaciones dotadas" }, { label: "Panel de entrevista", detail: "Requerido" }] },
    "GM":            { desc: "Autoridad total sobre P&L. Supervisión del programa. Construye el equipo.",
      highlights: ["Autoridad total sobre P&L y decisiones de personal", "Supervisión del programa de capacitación — garantizar competencia en todas las estaciones en todo el equipo", "Diseño, revisión y mejora del programa de simulacros", "Entrenamiento mensual con AGMs; informes a nivel ejecutivo", "Competencia informática nativa en IA y programa de desarrollo ejecutivo", "Supervisión del programa de AC; aprueba el programa de producción semanal"] },
  },
};

export function tStage(stageId, lang) {
  return (lang === "es" && STAGE_TRANS.es[stageId]) ? STAGE_TRANS.es[stageId] : null;
}

export function tRank(rankId, lang) {
  return (lang === "es" && RANK_TRANS.es[rankId]) ? RANK_TRANS.es[rankId] : null;
}
// ─── User-content bilingual helpers ───────────────────────────────────────────
// Resolves a { en, es } user-content field. Returns { text, sourceLang }.
// sourceLang is non-null only when falling back to another language.
export function tContent(field, lang) {
  if (!field || typeof field !== "object") return { text: field ?? "", sourceLang: null };
  const preferred = field[lang];
  if (preferred) return { text: preferred, sourceLang: null };
  const fallback = field.en || field.es || "";
  const sourceLang = field.en ? "en" : field.es ? "es" : null;
  return { text: fallback, sourceLang };
}

// Renders a bilingual user-content field with an optional language badge
// when the text is a fallback from the other language.
export function BilingualText({ field, lang, style }) {
  const { text, sourceLang } = tContent(field, lang);
  if (!text) return null;
  return (
    <span style={style}>
      {text}
      {sourceLang && (
        <span style={{
          fontSize: "8px", fontWeight: 700, color: "#a8a5a0",
          textTransform: "uppercase", marginLeft: "5px",
          background: "#f5f3ef", border: "1px solid #e8e6e1",
          borderRadius: "3px", padding: "0 3px", verticalAlign: "middle",
          letterSpacing: "0.04em",
        }}>{sourceLang}</span>
      )}
    </span>
  );
}
