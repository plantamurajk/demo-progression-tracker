import { CAREER_LADDER } from "../lib/domain.js";
import { TRANS } from "../lib/i18n.jsx";
import { MobileProfileHeader, StageProgressBar, CurrentFocusBanner, StationExperience, JourneyLadder, CleanRecordBadge } from "../components/profile.jsx";
import { DevSuggestions, PendingRequests } from "../components/skills.jsx";
import { AssessmentReadyPrompt, ModuleAssessmentPrompt, ForkliftCertPrompt } from "../components/prompts.jsx";
import { FarmerWhatNext, FarmerLevelLadder, FarmerStationGrid, FarmerCertifications, FarmerPromotionReadiness } from "../components/farmer.jsx";
import { SrFarmerWhatNext, SrFarmerTrainingRecord, SupervisorWhatNext, SupervisorTrainingRecord } from "../components/leadership.jsx";

// ═══════════════════════════════════════════════
//  TAB CONTENT COMPONENTS
// ═══════════════════════════════════════════════

export function FarmhandHomeContent({ emp, isMobile, lang = "en", supervisorMode, onAddSkill, onUpdateSkill, onRemoveSkill, onAddDevSuggestion, onRemoveDevSuggestion, onSubmitAssessmentRequest, onSubmitModuleRequest, onSubmitForkliftRequest }) {
  const T = TRANS[lang] || TRANS.en;
  const supProps = { supervisorMode, onAddSkill, onUpdateSkill, onRemoveSkill, onAddDevSuggestion, onRemoveDevSuggestion };
  const currentRankIdx = CAREER_LADDER.findIndex(r => r.id === emp.rank);
  const currentStages  = CAREER_LADDER[currentRankIdx]?.stages || [];
  return (
    <div>
      {isMobile && <MobileProfileHeader emp={emp} lang={lang} />}
      <div style={{ padding: "20px", maxWidth: isMobile ? "none" : "680px" }}>
        <ModuleAssessmentPrompt emp={emp} lang={lang} onSubmitModuleRequest={onSubmitModuleRequest} />
        <ForkliftCertPrompt emp={emp} lang={lang} onSubmitForkliftRequest={onSubmitForkliftRequest} />
        <CurrentFocusBanner stages={currentStages} currentStage={emp.currentStage} lang={lang} />
        <StageProgressBar stages={currentStages} completedStages={emp.completedStages}
          currentStage={emp.currentStage} currentStageProgress={emp.currentStageProgress} lang={lang} />
        <StationExperience stationExperience={emp.stationExperience} isMobile={isMobile} lang={lang} />
        <DevSuggestions suggestions={emp.devSuggestions} lang={lang} {...supProps} />
        <PendingRequests requests={emp.pendingRequests} lang={lang} />
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a3935", marginBottom: "10px" }}>{T.yourJourney}</div>
          <JourneyLadder stages={currentStages} completedStages={emp.completedStages}
            currentStage={emp.currentStage} currentProgress={emp.currentStageProgress} lang={lang} />
        </div>
        <CleanRecordBadge violations={emp.violations || []} lang={lang} />
      </div>
    </div>
  );
}

export function FarmerHomeContent({ emp, isMobile, lang = "en", supervisorMode, onAddSkill, onUpdateSkill, onRemoveSkill, onAddDevSuggestion, onRemoveDevSuggestion, onSubmitAssessmentRequest }) {
  const T = TRANS[lang] || TRANS.en;
  const supProps = { supervisorMode, onAddSkill, onUpdateSkill, onRemoveSkill, onAddDevSuggestion, onRemoveDevSuggestion };
  return (
    <div>
      {isMobile && <MobileProfileHeader emp={emp} lang={lang} />}
      <div style={{ padding: "20px", maxWidth: isMobile ? "none" : "680px" }}>
        <AssessmentReadyPrompt emp={emp} lang={lang} onSubmitRequest={onSubmitAssessmentRequest} />
        <FarmerWhatNext emp={emp} lang={lang} />
        <FarmerLevelLadder emp={emp} lang={lang} />
        <FarmerStationGrid emp={emp} isMobile={isMobile} lang={lang} />
        <FarmerCertifications emp={emp} lang={lang} />
        <FarmerPromotionReadiness promotionReqs={emp.promotionReqs} label={T.srFarmerReadiness} lang={lang} />
        <DevSuggestions suggestions={emp.devSuggestions} lang={lang} {...supProps} />
        <PendingRequests requests={emp.pendingRequests} lang={lang} />
        <CleanRecordBadge violations={emp.violations || []} lang={lang} />
      </div>
    </div>
  );
}

export function SrFarmerHomeContent({ emp, isMobile, lang = "en", supervisorMode, onAddSkill, onUpdateSkill, onRemoveSkill, onAddDevSuggestion, onRemoveDevSuggestion, onSubmitAssessmentRequest }) {
  const T = TRANS[lang] || TRANS.en;
  const supProps = { supervisorMode, onAddSkill, onUpdateSkill, onRemoveSkill, onAddDevSuggestion, onRemoveDevSuggestion };
  return (
    <div>
      {isMobile && <MobileProfileHeader emp={emp} lang={lang} />}
      <div style={{ padding: "20px", maxWidth: isMobile ? "none" : "680px" }}>
        <AssessmentReadyPrompt emp={emp} lang={lang} onSubmitRequest={onSubmitAssessmentRequest} />
        <SrFarmerWhatNext emp={emp} lang={lang} />
        <FarmerLevelLadder emp={emp} lang={lang} />
        <SrFarmerTrainingRecord training={emp.training} lang={lang} />
        <FarmerCertifications emp={emp} nextRankLabel="Supervisor" lang={lang} />
        <FarmerPromotionReadiness promotionReqs={emp.promotionReqs} label={T.supervisorReadiness} lang={lang} />
        <FarmerStationGrid emp={emp} isMobile={isMobile} lang={lang} title={T.stationExpertise} subtitle={T.qualLineExpert} />
        <DevSuggestions suggestions={emp.devSuggestions} lang={lang} {...supProps} />
        <PendingRequests requests={emp.pendingRequests} lang={lang} />
        <CleanRecordBadge violations={emp.violations || []} lang={lang} />
      </div>
    </div>
  );
}

export function SupervisorHomeContent({ emp, isMobile, lang = "en", supervisorMode, onAddSkill, onUpdateSkill, onRemoveSkill, onAddDevSuggestion, onRemoveDevSuggestion, onSubmitAssessmentRequest }) {
  const T = TRANS[lang] || TRANS.en;
  const supProps = { supervisorMode, onAddSkill, onUpdateSkill, onRemoveSkill, onAddDevSuggestion, onRemoveDevSuggestion };
  return (
    <div>
      {isMobile && <MobileProfileHeader emp={emp} lang={lang} />}
      <div style={{ padding: "20px", maxWidth: isMobile ? "none" : "680px" }}>
        <AssessmentReadyPrompt emp={emp} lang={lang} onSubmitRequest={onSubmitAssessmentRequest} />
        <SupervisorWhatNext emp={emp} lang={lang} />
        <FarmerLevelLadder emp={emp} lang={lang} />
        <SupervisorTrainingRecord training={emp.training} lang={lang} />
        <FarmerCertifications emp={emp} nextRankLabel="AGM" lang={lang} />
        <FarmerPromotionReadiness promotionReqs={emp.promotionReqs} label={T.agmReadiness} lang={lang} />
        <FarmerStationGrid emp={emp} isMobile={isMobile} lang={lang} title={T.stationExpertise} subtitle={T.qualLineExpert} />
        <DevSuggestions suggestions={emp.devSuggestions} lang={lang} {...supProps} />
        <PendingRequests requests={emp.pendingRequests} lang={lang} />
        <CleanRecordBadge violations={emp.violations || []} lang={lang} />
      </div>
    </div>
  );
}

export function HomeTab({ emp, isMobile, lang = "en", supervisorMode, onAddSkill, onUpdateSkill, onRemoveSkill, onAddDevSuggestion, onRemoveDevSuggestion, onSubmitAssessmentRequest, onSubmitModuleRequest, onSubmitForkliftRequest }) {
  const supProps = { supervisorMode, onAddSkill, onUpdateSkill, onRemoveSkill, onAddDevSuggestion, onRemoveDevSuggestion, onSubmitAssessmentRequest, onSubmitModuleRequest, onSubmitForkliftRequest };
  if (emp.rank === "Farmhand")      return <FarmhandHomeContent  emp={emp} isMobile={isMobile} lang={lang} {...supProps} />;
  if (emp.rank === "Senior Farmer") return <SrFarmerHomeContent  emp={emp} isMobile={isMobile} lang={lang} {...supProps} />;
  if (emp.rank === "Supervisor")    return <SupervisorHomeContent emp={emp} isMobile={isMobile} lang={lang} {...supProps} />;
  return <FarmerHomeContent emp={emp} isMobile={isMobile} lang={lang} {...supProps} />;
}
