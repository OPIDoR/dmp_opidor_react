import React from "react";
import GuidanceModal from "../SectionsContent/GuidanceModal";
import CommentModal from "../../WritePlan/CommentModal";
import RunsModal from "../../WritePlan/RunsModal";
import useQuestionModals from "../../../hooks/useQuestionModals";



export function ModalsContainer({ question, readonly, scriptsData, fragmentId, displayedResearchOutput, answerId, planData, questionId, questionsWithGuidance }) {
  // --- STATE ---
  const {
    showGuidanceModal, setShowGuidanceModal,
    showCommentModal, setShowCommentModal,
    showRunsModal, setShowRunsModal
  } = useQuestionModals();

  const {
    setFillRunsIconColor,
    setFillCommentIconColor,
    setFillGuidanceIconColor,
  } = useQuestionIcons();
  
  // --- BEHAVIOURS ---
  
  // --- RENDER ---
  return (
    <>
      {!readonly && scriptsData.scripts.length > 0 && (
        <RunsModal
          show={showRunsModal}
          setshowModalRuns={setShowRunsModal}
          setFillColorIconRuns={setFillRunsIconColor}
          scriptsData={scriptsData}
          fragmentId={fragmentId} />
      )}
      {displayedResearchOutput && (
        <CommentModal
          show={showCommentModal}
          setshowModalComment={setShowCommentModal}
          setFillColorIconComment={setFillCommentIconColor}
          answerId={answerId}
          researchOutputId={displayedResearchOutput.id}
          planId={planData.id}
          questionId={question.id}
          readonly={readonly} />
      )}
      {questionsWithGuidance.includes(question.id) && (
        <GuidanceModal
          show={showGuidanceModal}
          setShowGuidanceModal={setShowGuidanceModal}
          setFillColorGuidanceIcon={setFillGuidanceIconColor}
          questionId={questionId}
          planId={planData.id} />
      )}
    </>
  );
}
