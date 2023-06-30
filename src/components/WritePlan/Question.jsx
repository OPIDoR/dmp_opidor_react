import React, { useContext, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Panel, PanelGroup } from "react-bootstrap";
import { TfiAngleDown, TfiAngleRight } from "react-icons/tfi";

import { showPersonalData } from "../../utils/GeneratorUtils";
import { GlobalContext } from "../context/Global";
import styles from "../assets/css/write_plan.module.css";
import DynamicForm from "../Builder/DynamicForm";

function Question({ question, sectionId, hasPersonalData, readonly }) {
  const {
    planData,
    openedQuestions, setOpenedQuestions,
    displayedResearchOutput,
    questionsWithGuidance
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


  useEffect(() => {
    const answer = displayedResearchOutput.answers.find(answer => question.id === answer.question_id)
    if (answer) {
      setAnswerId(answer.id);
      setFragmentId(answer.fragment_id);
    }
  }, [displayedResearchOutput]);
  /**
   * `handlePanelUpdate` is a function that takes an event, an element index, and a question index,
   * and then sets the state of `openedQuestions` to the
   * opposite of what it was before.
   */
  const handleQuestionCollapse = () => {
    console.log(sectionId, questionId);
    const updatedState = { ...openedQuestions[displayedResearchOutput.id] };
    if (updatedState[sectionId]) {
      updatedState[sectionId][questionId] = !updatedState[sectionId][questionId];
    } else {
      updatedState[sectionId] = { [questionId]: true }
    }
    setOpenedQuestions({ ...openedQuestions, [displayedResearchOutput.id]: updatedState });
  };

  /**
   * The function handles the click event for showing comments and sets the state of various modal and icon colors.
   */
  const handleShowCommentClick = (e, collapse, q) => {
    e.stopPropagation();
    e.preventDefault();
    // setQuestionId(q.id);
    if (collapse === false) {
      setShowGuidanceModal(false);
      setShowRunsModal(false);
      setShowCommentModal(!showCommentModal);
      setFillCommentIconColor((prev) => (prev === "var(--primary)" ? "var(--orange)" : "var(--primary)"));
      setFillGuidanceIconColor((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
      setFillRunsIconColor((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
    }
  };

  /**
   * This function handles the click event for showing a recommendation modal and toggles the visibility of other modals.
   */
  const handleShowRecommandationClick = (e, collapse, q) => {
    e.stopPropagation();
    e.preventDefault();
    // setQuestionId(q.id);
    if (collapse === false) {
      setShowCommentModal(false);
      setShowRunsModal(false);
      setShowGuidanceModal(!showGuidanceModal);
      setFillGuidanceIconColor((prev) => (prev === "var(--primary)" ? "var(--orange)" : "var(--primary)"));
      setFillCommentIconColor((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
      setFillRunsIconColor((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
    }
  };

  /**
   * The function handles a click event to show or hide a modal for runs and updates the state of other modals accordingly.
   */
  const handleShowRunsClick = (e, collapse, q) => {
    e.stopPropagation();
    e.preventDefault();
    // setQuestionId(q.id);
    if (collapse === false) {
      setShowCommentModal(false);
      setShowGuidanceModal(false);
      setShowRunsModal(!showRunsModal);
      setFillGuidanceIconColor((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
      setFillCommentIconColor((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
      setFillRunsIconColor((prev) => (prev === "var(--primary)" ? "var(--orange)" : "var(--primary)"));
    }
  };

  const isQuestionOpened = () => {
    if (openedQuestions?.[displayedResearchOutput.id]?.[sectionId]?.[questionId]) {
      return true;
    }
    return false
  }

  return (
    <>
      {showPersonalData(hasPersonalData, question) && (
        <Panel
          expanded={isQuestionOpened()}
          className={styles.panel}
          style={{ borderRadius: "10px", borderWidth: "2px", borderColor: "var(--primary)" }}
          onToggle={() => handleQuestionCollapse()}
        >
          <Panel.Heading style={{ background: "white", borderRadius: "18px" }}>
            <Panel.Title toggle>
              <div className={styles.question_title}>
                <div className={styles.question_text}>
                  <div className={styles.question_number}>
                    {question.number}
                  </div>
                  <div
                    className={styles.panel_title}
                    style={{ margin: "0px !important", fontSize: "18px", fontWeight: "bold", marginRight: "10px" }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize([question.text]),
                    }}
                  />
                </div>

                <span className={styles.question_icons}>

                    {/* 0 */}
                    {/*{!readonly && (
                                      <>
                                      <div
                      data-tooltip-id="scriptTip"
                      className={styles.panel_icon}
                      onClick={(e) => {
                        handleShowRunsClick(e, openedQuestions?.[displayedResearchOutput.id]?.[sectionId]?.[questionId], question);
                      }}
                    >
                      <BsGear
                        size={40}
                        style={{ marginTop: "6px", marginRight: "4px" }}
                        fill={
                          openedQuestions?.[displayedResearchOutput.id]?.[sectionId]?.[questionId] === false && questionId && questionId === question.id
                            ? fillRunsIconColor
                            : "var(--primary)"
                        }
                      />
                    </div>
                    <ReactTooltip id="scriptTip" place="bottom" effect="solid" variant="info" content={t("Script")} />
                    {openedQuestions?.[displayedResearchOutput.id]?.[sectionId]?.[questionId] === false && showRunsModal && questionId && questionId == question.id && (
                      <RunsModal
                        show={showRunsModal}
                        setshowModalRuns={setShowRunsModal}
                        setFillColorIconRuns={setFillRunsIconColor}
                      ></RunsModal>
                    )}
                                      </>
                                    )}*/}
                    {/* 1 */}
                    {/*<div
                      data-tooltip-id="commentTip"
                      className={styles.panel_icon}
                      onClick={(e) => {
                        handleShowCommentClick(e, openedQuestions?.[displayedResearchOutput.id]?.[sectionId]?.[questionId], question);
                      }}
                    >
                      <CommentSVG
                        fill={
                          openedQuestions?.[displayedResearchOutput.id]?.[sectionId]?.[questionId] === false && questionId && questionId === question.id
                            ? fillCommentIconColor
                            : "var(--primary)"
                        }
                      />
                    </div>
                    <ReactTooltip id="commentTip" place="bottom" effect="solid" variant="info" content={t("Comment")} />
                    {openedQuestions?.[displayedResearchOutput.id]?.[sectionId]?.[questionId] === false &&
                      showCommentModal &&
                      questionId &&
                      questionId == question.id && (
                        <CommentModal
                          show={showCommentModal}
                          setshowModalComment={setShowCommentModal}
                          setFillColorIconComment={setFillCommentIconColor}
                          answerId={""}
                          displayedResearchOutput.id={displayedResearchOutput.id}
                          planId={planId}
                          userId={""}
                          questionId={question.id}
                          readonly={readonly}
                        ></CommentModal>
                      )}*/}
                    {/* 2 */}

                    {/*{questionsWithGuidance && questionsWithGuidance.includes(question.id) && (
                      <div
                        data-tooltip-id="guidanceTip"
                        className={styles.panel_icon}
                        onClick={(e) => {
                          handleShowRecommandationClick(e, openedQuestions?.[displayedResearchOutput.id]?.[sectionId]?.[questionId], question);
                        }}
                      >
                        <LightSVG
                          fill={
                            openedQuestions?.[displayedResearchOutput.id]?.[sectionId]?.[questionId] === false && questionId && questionId === question.id
                              ? fillGuidanceIconColor
                              : "var(--primary)"
                          }
                        />
                      </div>
                    )}

                    <ReactTooltip id="guidanceTip" place="bottom" effect="solid" variant="info" content={t("Recommandation")} />
                    {openedQuestions?.[displayedResearchOutput.id]?.[sectionId]?.[questionId] === false &&
                      showGuidanceModal &&
                      questionId &&
                      questionId == question.id && (
                        <GuidanceModal
                          show={showGuidanceModal}
                          setshowModalRecommandation={setShowGuidanceModal}
                          setFillColorIconRecommandation={setFillGuidanceIconColor}
                          questionId={questionId}
                        ></GuidanceModal>
                      )}*/}
                    {/* 3 */}
                  {isQuestionOpened() ? (
                    <TfiAngleDown style={{ minWidth: "35px" }} size={35} className={styles.down_icon} />
                  ) : (
                    <TfiAngleRight style={{ minWidth: "35px" }} size={35} className={styles.down_icon} />
                  )}
                </span>
              </div>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body className={styles.panel_body} collapsible={true}>
            {isQuestionOpened() ?
              <>
              {
                fragmentId ? (
                  <DynamicForm fragmentId={fragmentId} readonly={readonly} />
                ) : (
                  <DynamicForm
                    fragmentId={null}
                    planId={planData.id}
                    questionId={question.id}
                    madmpSchemaId={question.madmp_schema_id}
                    setFragmentId={setFragmentId}
                    setAnswerId={setAnswerId}
                    readonly={readonly}
                  />
                )
              }
              </> : <></>
            }
          </Panel.Body>
        </Panel>
      )}
    </>
  );

}

export default Question;
