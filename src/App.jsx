import { useState, useEffect } from "react";
import { api } from "./api.js";
import { HomeTab } from "./tabs/HomeTab.jsx";
import { LadderTab } from "./tabs/LadderTab.jsx";
import { ScheduleTab } from "./tabs/ScheduleTab.jsx";
import { MyPathTab } from "./tabs/MyPathTab.jsx";
import { LibraryTab } from "./tabs/LibraryTab.jsx";
import { DesktopSidebar, BottomTabBar, LoadingScreen, LoginScreen } from "./components/chrome.jsx";

// ═══════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════

export default function App() {
  const [authState, setAuthState]   = useState("loading"); // loading | in | out
  const [me, setMe]                 = useState(null);       // logged-in employee summary
  const [team, setTeam]             = useState([]);         // list for supervisor switcher
  const [viewedId, setViewedId]     = useState(null);       // employee currently shown
  const [emp, setEmp]               = useState(null);       // full adapted profile of viewedId
  const [tab, setTab]               = useState("home");
  const [lang, setLang]             = useState("en");
  const [supervisorMode, setSupervisorMode] = useState(false);
  const [isMobile, setIsMobile]     = useState(() => window.innerWidth < 640);
  const [authError, setAuthError]   = useState(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Surface auth result query param (?auth=success|failed|unauthorized|error)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("auth");
    if (p && p !== "success") setAuthError(p);
    if (p) window.history.replaceState({}, "", window.location.pathname);
  }, []);

  // Initial auth check + bootstrap
  useEffect(() => {
    (async () => {
      try {
        const user = await api.getMe();
        setMe(user);
        setViewedId(user.id);
        setAuthState("in");
        const [profile, teamList] = await Promise.all([
          api.getEmployee(user.id),
          api.getTeam().catch(() => []),
        ]);
        setEmp(profile);
        setTeam(teamList);
      } catch (err) {
        if (err.status === 401) setAuthState("out");
        else { console.error(err); setAuthState("out"); setAuthError("error"); }
      }
    })();
  }, []);

  async function reload(id = viewedId) {
    if (!id) return;
    const profile = await api.getEmployee(id);
    setEmp(profile);
  }

  async function switchEmployee(id) {
    setViewedId(id);
    setTab("home");
    setEmp(await api.getEmployee(id));
  }

  async function logout() {
    try { await api.logout(); } catch { /* noop */ }
    window.location.reload();
  }

  // ─── Request handlers (call backend then refetch) ───
  async function submitRequest(station) {
    await api.submitRequest(viewedId, { type: "Cross-Training Request", stationId: station });
    await reload();
  }

  async function submitAssessmentRequest(station, type) {
    await api.submitRequest(viewedId, { type, stationId: station });
    await reload();
  }

  async function submitModuleAssessmentRequest(moduleId /* , title */) {
    await api.submitRequest(viewedId, { type: "Module Assessment", moduleId });
    await reload();
  }

  async function submitForkliftRequest() {
    await api.submitRequest(viewedId, { type: "Forklift Training" });
    await reload();
  }

  // ─── Skill handlers ───
  async function addSkill(skill) {
    await api.addSkill(viewedId, skill);
    await reload();
  }

  async function updateSkill(skillIdx, updates) {
    const target = emp?.skills?.[skillIdx];
    if (!target) return;
    await api.updateSkill(target.id, updates);
    await reload();
  }

  async function removeSkill(skillIdx) {
    const target = emp?.skills?.[skillIdx];
    if (!target) return;
    await api.removeSkill(target.id);
    await reload();
  }

  // ─── Dev suggestion handlers ───
  async function addDevSuggestion(suggestion) {
    await api.addDevSuggestion(viewedId, suggestion);
    await reload();
  }

  async function removeDevSuggestion(idx) {
    const target = emp?.devSuggestions?.[idx];
    if (!target) return;
    await api.removeDevSuggestion(target.id);
    await reload();
  }

  if (authState === "loading") return <LoadingScreen />;
  if (authState === "out")     return <LoginScreen authError={authError} />;
  if (!emp)                    return <LoadingScreen />;

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif", maxWidth: isMobile ? "420px" : "1100px", margin: "0 auto", background: "#faf9f7", minHeight: "100vh", display: "flex", flexDirection: "column", color: "#2a2925" }}>

      {/* App bar */}
      <div style={{ height: "48px", background: "#1e3f61", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 0 #19355a" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <img src="/logo.png" alt="Beanstalk" style={{ height: "22px", width: "auto", flexShrink: 0 }} />
          <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: "17px", color: "#f8c327", letterSpacing: "0.01em", lineHeight: 1 }}>Beanstalk</span>
        </span>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Language toggle */}
          <button
            onClick={() => setLang(l => l === "en" ? "es" : "en")}
            style={{ fontSize: "11px", fontWeight: 700, background: "#1a3d6a", color: "#fff", border: "1px solid #244d7a", borderRadius: "7px", padding: "4px 10px", cursor: "pointer", letterSpacing: "0.04em" }}
          >
            {lang === "en" ? "ES" : "EN"}
          </button>
          {/* Supervisor mode toggle */}
          <button
            onClick={() => setSupervisorMode(m => !m)}
            style={{ fontSize: "11px", fontWeight: 700, background: supervisorMode ? "#cce86622" : "#1a3d6a", color: supervisorMode ? "#cce866" : "#ffffff88", border: supervisorMode ? "1px solid #cce86644" : "1px solid #244d7a", borderRadius: "7px", padding: "4px 10px", cursor: "pointer", letterSpacing: "0.04em" }}
          >
            {supervisorMode ? "SUP ✓" : "SUP"}
          </button>
          {/* Employee switcher — only meaningful in supervisor mode */}
          {supervisorMode && team.length > 0 && (
            <select
              value={viewedId || ""}
              onChange={e => switchEmployee(e.target.value)}
              style={{ fontSize: "11px", fontWeight: 600, background: "#1a3d6a", color: "#fff", border: "1px solid #244d7a", borderRadius: "7px", padding: "4px 8px", cursor: "pointer", outline: "none", maxWidth: "160px" }}
            >
              {team.map(t => (
                <option key={t.id} value={t.id} style={{ background: "#1e3f61" }}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
          {/* Logout */}
          <button
            onClick={logout}
            title={me ? me.name : ""}
            style={{ fontSize: "11px", fontWeight: 700, background: "#1a3d6a", color: "#fff", border: "1px solid #244d7a", borderRadius: "7px", padding: "4px 10px", cursor: "pointer", letterSpacing: "0.04em" }}
          >
            {lang === "es" ? "Salir" : "Sign out"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {!isMobile && <DesktopSidebar emp={emp} tab={tab} onTabChange={setTab} lang={lang} />}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: isMobile ? "calc(90px + env(safe-area-inset-bottom, 0px))" : "32px", minWidth: 0 }}>
          {tab === "home"     && <HomeTab     emp={emp} isMobile={isMobile} lang={lang} supervisorMode={supervisorMode} onAddSkill={addSkill} onUpdateSkill={updateSkill} onRemoveSkill={removeSkill} onAddDevSuggestion={addDevSuggestion} onRemoveDevSuggestion={removeDevSuggestion} onSubmitAssessmentRequest={submitAssessmentRequest} onSubmitModuleRequest={submitModuleAssessmentRequest} onSubmitForkliftRequest={submitForkliftRequest} />}
          {tab === "ladder"   && <LadderTab     emp={emp} isMobile={isMobile} lang={lang} />}
          {tab === "schedule" && <ScheduleTab lang={lang} />}
          {tab === "myPath" && <MyPathTab emp={emp} onSubmitRequest={submitRequest} onSubmitAssessmentRequest={submitAssessmentRequest} onSubmitModuleRequest={submitModuleAssessmentRequest} onSubmitForkliftRequest={submitForkliftRequest} isMobile={isMobile} lang={lang} supervisorMode={supervisorMode} onAddSkill={addSkill} onUpdateSkill={updateSkill} onRemoveSkill={removeSkill} onAddDevSuggestion={addDevSuggestion} onRemoveDevSuggestion={removeDevSuggestion} onTabChange={setTab} />}
          {tab === "library"  && <LibraryTab  isMobile={isMobile} lang={lang} />}
        </div>
      </div>

      {isMobile && <BottomTabBar tab={tab} onTabChange={setTab} emp={emp} lang={lang} />}
    </div>
  );
}
