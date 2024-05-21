import React, { useContext, useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { Panel } from "react-bootstrap";

import { GlobalContext } from "../../context/Global";
import * as styles from "../../assets/css/write_plan.module.css";
import { IconsBar } from "./IconsBar";
import { ModalsContainer } from "./ModalsContainer";
import { DynamicFormContainer } from "./DynamicFormContainer";
import useQuestionModals from "../../../hooks/useQuestionModals";
import useQuestionIcons from "../../../hooks/useQuestionIcons";
import useQuestionState from "../../../hooks/useQuestionState";
import useSectionsMapping from "../../../hooks/useSectionsMapping";
import { useForm } from "react-hook-form";
import MappingEditor from "../../FormComponents/MappingEditor";

function Question({
  question,
  questionIdx,
  sectionId,
  sectionNumber,
  readonly,
  id,
}) {
  // --- STATE ---
  const {
    planData,
    openedQuestions,
    setOpenedQuestions,
    displayedResearchOutput,
    questionsWithGuidance,
    setUrlParams,
    formSelectors,
    formData,
  } = useContext(GlobalContext);

  const {
    showGuidanceModal, setShowGuidanceModal,
    showCommentModal, setShowCommentModal,
    showRunsModal, setShowRunsModal,
    showFormSelectorModal, setShowFormSelectorModal,
    closeAllModals
  } = useQuestionModals();

  const {
    setFillRunsIconColor,
    setFillCommentIconColor,
    setFillGuidanceIconColor,
    setFillFormSelectorIconColor,
    resetIconColors
  } = useQuestionIcons();

  const {
    setFragmentId,
    setAnswerId
  } = useQuestionState();

  const {
    forms,
    setEditorRef,
    USAGE_TARGET,
    DEFAULT_REF
  } = useSectionsMapping();

  const currentEditorRef = useRef(null);
  const methods = useForm({ defaultValues: formData });

  const [questionId] = useState(question.id); // ??? questionId et question.id both used in different ways ???

  const DRO_ID = displayedResearchOutput?.id || id || 0;

  // --- BEHAVIOURS ---  
  useEffect(() => {
    if (displayedResearchOutput) {
      const answer = displayedResearchOutput.answers?.find(
        (answer) => question?.id === answer?.question_id
      );
      setAnswerId(answer?.answer_id);
      setFragmentId(answer?.fragment_id);
    }

    const queryParameters = new URLSearchParams(window.location.search);
    setUrlParams({ research_output: queryParameters.get('research_output') });

    handleIconClick(null, 'formSelector');
  }, [displayedResearchOutput, question.id]);

  /**
   * Handles toggling the open/collapse state of a question.
   * This function is called when a question is collapsed or expanded.
   * It updates the state of opened questions based on the changes.
   * @param {boolean} expanded  - The new state of the question (collapsed or expanded).
   */
  const handleQuestionCollapse = (expanded) => {
    closeAllModals();

    let updatedState = { ...openedQuestions };

    if (!updatedState[DRO_ID])
      updatedState[DRO_ID] = {};

    if (forms[id]?.usage === USAGE_TARGET)
      updatedState = collapseOtherQuestions(updatedState, sectionId, questionId);

    updatedState[DRO_ID][sectionId] = { ...updatedState[DRO_ID][sectionId], [questionId]: expanded };
    setOpenedQuestions(updatedState);

    const queryParameters = new URLSearchParams(window.location.search);
    setUrlParams({ research_output: queryParameters.get('research_output') });
    handleIconClick(null, 'formSelector');

    if (forms[id]?.usage === USAGE_TARGET)
      setEditorRef(expanded ? currentEditorRef : DEFAULT_REF);
  };

  /**
   * Fold all questions
   * @param {Object} updatedState - New question state
   * @param {*} currentSectionId
   * @param {*} currentQuestionId 
   * @returns {Object} - Updated questions state
   */
  const collapseOtherQuestions = (updatedState, currentSectionId, currentQuestionId) => {
    // Fold all other questions
    Object.entries(updatedState[DRO_ID]).forEach(([sectionId, questions]) => {
      if (sectionId !== currentSectionId) {
        Object.keys(questions).forEach(questionId => {
          updatedState[DRO_ID][sectionId][questionId] = false;
        });
      }
      else {
        Object.keys(questions).forEach(questionId => {
          if (questionId !== currentQuestionId) {
            updatedState[DRO_ID][sectionId][questionId] = false;
          }
        });
      }
    });

    return updatedState;
  };


  /**
   * Handles the click event for showing modals and updating icon colors based on the modal type.
   *
   * @param {Event} e - The click event object.handleIconClick
   * @param {string} modalType - The type of modal to show ('comment', 'guidance', or 'runs').
   */
  const handleIconClick = (e, modalType) => {
    e?.stopPropagation();
    e?.preventDefault();

    // Check if the current modal type is the same as the one that is about to be opened
    const modalStateMap = {
      comment: showCommentModal,
      guidance: showGuidanceModal,
      runs: showRunsModal,
      formSelector: showFormSelectorModal
    };
    const isModalOpen = modalStateMap[modalType];

    // If the current modal is the same as the one about to be opened, close it
    if (isModalOpen) {
      resetIconColors();
      return closeAllModals();
    }

    // Open the specified modal and update icon colors
    const setModalFunction = {
      comment: setShowCommentModal,
      guidance: setShowGuidanceModal,
      runs: setShowRunsModal,
      formSelector: setShowFormSelectorModal
    };

    const setIconColorFunction = {
      comment: setFillCommentIconColor,
      guidance: setFillGuidanceIconColor,
      runs: setFillRunsIconColor,
      formSelector: setFillFormSelectorIconColor
    };

    Object.keys(modalStateMap).forEach(key => {
      setModalFunction[key](modalType === key);
      setIconColorFunction[key](modalType === key ? 'var(--rust)' : 'var(--dark-blue)');
    });
  };


  /**
   * Checks if a specific question is opened based on its identifiers within the nested object structure.
   *
   * @returns {boolean} True if the question is opened, false otherwise.
   */
  const isQuestionOpened = () => {
    return !!openedQuestions?.[DRO_ID]?.[sectionId]?.[questionId];
  };


  // --- RENDER ---
  return (
    <Panel
      id="question-panel"
      expanded={isQuestionOpened()}
      className={styles.panel}
      style={{
        borderRadius: "10px",
        borderWidth: "2px",
        borderColor: "var(--dark-blue)",
      }}
      onToggle={(expanded) => handleQuestionCollapse(expanded)}
    >
      <Panel.Heading style={{ background: "white", borderRadius: "18px" }}>
        <Panel.Title toggle>
          <div className={styles.question_title}>
            <div className={styles.question_text}>
              <div className={styles.question_number}>
                {sectionNumber}.{questionIdx}
              </div>
              <div
                className={styles.panel_title}
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  whiteSpace: 'break-spaces',
                  textAlign: 'justify',
                  hyphens: 'auto',
                  paddingRight: '20px',
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(question.text),
                }}
              />
            </div>
            <div
              id="icons-container"
              className={styles.question_icons}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                maxWidth: '200px',
              }}
            >
              <IconsBar
                isQuestionOpened={isQuestionOpened}
                questionsWithGuidance={questionsWithGuidance}
                questionId={questionId}
                formSelectors={formSelectors}
                handleIconClick={handleIconClick}
                handleQuestionCollapse={handleQuestionCollapse}
              />
            </div>
          </div>
        </Panel.Title>
      </Panel.Heading>
      <Panel.Body id={`panel-body-${question.id}`} style={{ position: 'relative' }} collapsible={true}>
        {isQuestionOpened() &&
          <ModalsContainer
            readonly={readonly}
            displayedResearchOutput={displayedResearchOutput}
            planData={planData}
            questionId={questionId}
            questionsWithGuidance={questionsWithGuidance}
            question={question}
          />
        }{/* LEFT : surely DynamicForm */}
        {/* RIGHT : surely NOT DynamicForm */}
        {isQuestionOpened() && question.madmp_schema ? (
          <DynamicFormContainer
            question={question}
            readonly={readonly}
            id={id}
          />
        ) : (
          <MappingEditor
            ref={currentEditorRef}
            label="Edit Export Template"
            defaultValue=""
          />
        )
        }
      </Panel.Body>
    </Panel>
  );
}

export default Question;