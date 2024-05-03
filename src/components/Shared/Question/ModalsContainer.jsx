import React from "react";
import GuidanceModal from "../SectionsContent/GuidanceModal";
import CommentModal from "../../WritePlan/CommentModal";
import RunsModal from "../../WritePlan/RunsModal";
import useQuestionModals from "../../../hooks/useQuestionModals";
import useQuestionIcons from "../../../hooks/useQuestionIcons";
import useQuestionState from "../../../hooks/useQuestionState";



export function ModalsContainer({ question, readonly, displayedResearchOutput, planData, questionId, questionsWithGuidance }) {
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

  const {
    fragmentId,
    answerId,
    scriptsData,
  } = useQuestionState();
  
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
