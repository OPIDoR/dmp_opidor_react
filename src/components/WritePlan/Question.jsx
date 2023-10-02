import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { Panel } from "react-bootstrap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { BsGear } from "react-icons/bs";
import { PiLightbulbLight } from "react-icons/pi";

import { showQuestion } from "../../utils/GeneratorUtils";
import { GlobalContext } from "../context/Global";
import styles from "../assets/css/write_plan.module.css";
import DynamicForm from "../Forms/DynamicForm";
import GuidanceModal from "./GuidanceModal";
import CommentModal from "./CommentModal";
import RunsModal from "./RunsModal";
import { CommentSVG } from "../Styled/svg";

function Question({ question, sectionId, sectionNumber, readonly }) {
  const {
    planData,
    openedQuestions,
    setOpenedQuestions,
    displayedResearchOutput,
    questionsWithGuidance,
  } = useContext(GlobalContext);
  const [questionId] = useState(question.id);
  const [fragmentId, setFragmentId] = useState(null);
  const [answerId, setAnswerId] = useState(null);
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showRunsModal, setShowRunsModal] = useState(false);
  const [fillRunsIconColor, setFillRunsIconColor] = useState("var(--primary)");
  const [fillCommentIconColor, setFillCommentIconColor] = useState("var(--primary)");
  const [fillGuidanceIconColor, setFillGuidanceIconColor] = useState("var(--primary)");
  const { t } = useTranslation();

  useEffect(() => {
    const answer = displayedResearchOutput?.answers?.find(
      (answer) => question?.id === answer?.question_id
    );
    setAnswerId(answer?.answer_id);
    setFragmentId(answer?.fragment_id);
  }, [displayedResearchOutput, question.id]);

  /**
   * Handles toggling the open/collapse state of a question.
   * This function is called when a question is collapsed or expanded.
   * It updates the state of opened questions based on the changes.
   */
  const handleQuestionCollapse = () => {
    closeAllModals();

    const updatedState = { ...openedQuestions[displayedResearchOutput.id] };

    if (!updatedState[sectionId]) {
      updatedState[sectionId] = {
        [questionId]: false,
      };
    }

    updatedState[sectionId] = {
      ...updatedState[sectionId],
      [questionId]: !updatedState[sectionId]?.[questionId] ?? true,
    };

    setOpenedQuestions({
      ...openedQuestions,
      [displayedResearchOutput.id]: updatedState,
    });
  };

  const closeAllModals = () => {
    setShowCommentModal(false);
    setFillCommentIconColor("var(--primary)");

    setShowGuidanceModal(false);
    setFillGuidanceIconColor("var(--primary)");

    setShowRunsModal(false);
    setFillRunsIconColor("var(--primary)");
  };

  /**
   * Handles the click event for showing modals and updating icon colors based on the modal type.
   *
   * @param {Event} e - The click event object.
   * @param {boolean} collapse - A flag indicating whether the collapse condition is met.
   * @param {object} q - The question object associated with the click event.
   * @param {string} modalType - The type of modal to show ('comment', 'guidance', or 'runs').
   */
  const handleClick = (e, collapse, q, modalType) => {
    e.stopPropagation();
    e.preventDefault();

    // setQuestionId(q.id)

    // Check if the current modal type is the same as the one that is about to be opened
    const isModalOpen =
      (modalType === "comment" && showCommentModal) ||
      (modalType === "guidance" && showGuidanceModal) ||
      (modalType === "runs" && showRunsModal);

    // If the current modal is the same as the one about to be opened, close it
    if (isModalOpen) {
      return closeAllModals();
    }

    // Open the specified modal and update icon colors
    setShowCommentModal(modalType === "comment");
    setFillCommentIconColor(
      modalType === "comment" ? "var(--orange)" : "var(--primary)"
    );

    setShowGuidanceModal(modalType === "guidance");
    setFillGuidanceIconColor(
      modalType === "guidance" ? "var(--orange)" : "var(--primary)"
    );

    setShowRunsModal(modalType === "runs");
    setFillRunsIconColor(
      modalType === "runs" ? "var(--orange)" : "var(--primary)"
    );
  };

  /**
   * Checks if a specific question is opened based on its identifiers within the nested object structure.
   *
   * @returns {boolean} True if the question is opened, false otherwise.
   */
  const isQuestionOpened = () =>
    !!openedQuestions?.[displayedResearchOutput?.id]?.[sectionId]?.[questionId];

  return (
    <>
      {showQuestion(question, displayedResearchOutput.hasPersonalData) && (
        <Panel
          expanded={isQuestionOpened()}
          className={styles.panel}
          style={{
            borderRadius: "10px",
            borderWidth: "2px",
            borderColor: "var(--primary)",
          }}
          onToggle={() => handleQuestionCollapse()}
        >
          <Panel.Heading style={{ background: "white", borderRadius: "18px" }}>
            <Panel.Title toggle>
              <div className={styles.question_title}>
                <div className={styles.question_text}>
                  <div className={styles.question_number}>
                    {sectionNumber}.{question.number}
                  </div>
                  <div
                    className={styles.panel_title}
                    style={{
                      margin: "0px !important",
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginRight: "10px",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize([question.text]),
                    }}
                  />
                </div>

                <span
                  className={styles.question_icons}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {/*
                    // TODO: Display scripts button
                    {!readonly && ( 
                    <>
                      <ReactTooltip
                        id="scriptTip"
                        place="bottom"
                        effect="solid"
                        variant="info"
                        content={t("Script")}
                      />
                      <div
                        data-tooltip-id="scriptTip"
                        className={styles.panel_icon}
                        onClick={(e) => {
                          handleClick(e, isQuestionOpened(), question, "runs");
                        }}
                        style={{ marginLeft: "5px" }}
                      >
                        {isQuestionOpened() && (
                          <BsGear
                            size={32}
                            style={{ marginTop: "6px" }}
                            fill={
                              isQuestionOpened()
                                ? fillRunsIconColor
                                : "var(--primary)"
                            }
                          />
                        )}
                      </div>
                    </>
                  )} */}

                  <div>
                    <ReactTooltip
                      id="commentTip"
                      place="bottom"
                      effect="solid"
                      variant="info"
                      content={t("Comment")}
                    />
                    <div
                      data-tooltip-id="commentTip"
                      className={styles.panel_icon}
                      onClick={(e) => {
                        handleClick(e, isQuestionOpened(), question, "comment");
                      }}
                      style={{ marginLeft: "5px" }}
                    >
                      {isQuestionOpened() && (
                        <CommentSVG
                          size={32}
                          fill={
                            isQuestionOpened()
                              ? fillCommentIconColor
                              : "var(--primary)"
                          }
                        />
                      )}
                    </div>
                  </div>

                  {
                    questionsWithGuidance.length > 0 && questionsWithGuidance.includes(question.id) && (
                      <div>
                        <ReactTooltip
                          id="guidanceTip"
                          place="bottom"
                          effect="solid"
                          variant="info"
                          content={t("Guidances")}
                        />
                        <div
                        data-tooltip-id="guidanceTip"
                        className={styles.panel_icon}
                        onClick={(e) => {
                          handleClick(
                            e,
                            isQuestionOpened(),
                            question,
                            "guidance"
                          );
                        }}
                        style={{ marginLeft: "5px" }}
                      >
                        {isQuestionOpened() && (
                          <PiLightbulbLight
                            size={32}
                            style={{ marginTop: "6px" }}
                            fill={
                              isQuestionOpened()
                                ? fillGuidanceIconColor
                                : "var(--primary)"
                            }
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {isQuestionOpened() ? (
                    <TfiAngleUp
                      style={{ marginLeft: "5px" }}
                      size={32}
                      className={styles.down_icon}
                    />
                  ) : (
                    <TfiAngleDown
                      style={{ marginLeft: "5px" }}
                      size={32}
                      className={styles.down_icon}
                    />
                  )}
                </span>
              </div>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body id={`panel-body-${question.id}`} style={{ position: 'relative' }} collapsible={true}>
            {isQuestionOpened() && (
              <div>
                {/*
                  // TODO: Display scripts modal
                  <RunsModal
                  show={showRunsModal}
                  setshowModalRuns={setShowRunsModal}
                  setFillColorIconRuns={setFillRunsIconColor}
                /> */}
                <CommentModal
                  show={showCommentModal}
                  setshowModalComment={setShowCommentModal}
                  setFillColorIconComment={setFillCommentIconColor}
                  answerId={answerId}
                  researchOutputId={displayedResearchOutput.id}
                  planId={planData.id}
                  questionId={question.id}
                  readonly={readonly}
                />
                <GuidanceModal
                  show={showGuidanceModal}
                  setShowGuidanceModal={setShowGuidanceModal}
                  setFillColorGuidanceIcon={setFillGuidanceIconColor}
                  questionId={questionId}
                  planId={planData.id}
                />
              </div>
            )}
            {isQuestionOpened() ? (
              <>
                {fragmentId && answerId ? (
                  <DynamicForm fragmentId={fragmentId} readonly={readonly} />
                ) : (
                  <DynamicForm
                    fragmentId={null}
                    planId={planData.id}
                    questionId={question.id}
                    madmpSchemaId={question.madmp_schema.id}
                    setFragmentId={setFragmentId}
                    setAnswerId={setAnswerId}
                    readonly={readonly}
                  />
                )}
              </>
            ) : (
              <></>
            )}
          </Panel.Body>
        </Panel>
      )}
    </>
  );
}

export default Question;
