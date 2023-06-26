import React, { useContext, useState } from "react";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
import { TfiAngleDown } from "react-icons/tfi";
import { TfiAngleUp } from "react-icons/tfi";
import { BsGear } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { GlobalContext } from "../context/Global";
import { Panel, PanelGroup } from "react-bootstrap";
import { showPersonalData } from "../../utils/GeneratorUtils";
import GuidanceModal from "./GuidanceModal";
import CommentModal from "./CommentModal";
import RunsModal from "./RunsModal";
import LightSVG from "../Styled/svg/LightSVG";
import CommentSVG from "../Styled/svg/CommentSVG";

import styles from "../assets/css/redactions.module.css";
import Form from "../Forms/Form";


function Question({question, sectionId, researchOutputId, planId, hasPersonalData, readonly}) {
  const { t } = useTranslation();
  const { isCollapsed, setIsCollapsed, questionsWithGuidance, setQuestionsWithGuidance } = useContext(GlobalContext);

  const [showModalRecommandation, setShowModalRecommandation] = useState(false);
  const [showModalComment, setShowModalComment] = useState(false);
  const [showModalRuns, setShowModalRuns] = useState(false);
  const [fillColorIconRuns, setFillColorIconRuns] = useState("var(--primary)");
  const [fillColorIconComment, setFillColorIconComment] = useState("var(--primary)");
  const [fillColorIconRecommandation, setFillColorIconRecommandation] = useState("var(--primary)");
  const [questionId, setQuestionId] = useState(null);

  /**
   * `handlePanelUpdate` is a function that takes an event, an element index, and a question index,
   * and then sets the state of `isCollapsed` to the
   * opposite of what it was before.
   */
  const handlePanelUpdate = (e, sectionId, qIndex) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedState = isCollapsed[researchOutputId].map((plan, planIndex) => {
      if (planIndex === sectionId) {
        return {
          ...plan,
          [qIndex]: !plan[qIndex],
        };
      }
      return plan;
    });
    setIsCollapsed({ ...isCollapsed, [researchOutputId]: updatedState });
  };

  /**
   * The function handles the click event for showing comments and sets the state of various modal and icon colors.
   */
  const handleShowCommentClick = (e, collapse, q) => {
    e.stopPropagation();
    e.preventDefault();
    setQuestionId(q.id);
    if (collapse === false) {
      setShowModalRecommandation(false);
      setShowModalRuns(false);
      setShowModalComment(!showModalComment);
      setFillColorIconComment((prev) => (prev === "var(--primary)" ? "var(--orange)" : "var(--primary)"));
      setFillColorIconRecommandation((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
      setFillColorIconRuns((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
    }
  };

  /**
   * This function handles the click event for showing a recommendation modal and toggles the visibility of other modals.
   */
  const handleShowRecommandationClick = (e, collapse, q) => {
    e.stopPropagation();
    e.preventDefault();
    setQuestionId(q.id);
    if (collapse === false) {
      setShowModalComment(false);
      setShowModalRuns(false);
      setShowModalRecommandation(!showModalRecommandation);
      setFillColorIconRecommandation((prev) => (prev === "var(--primary)" ? "var(--orange)" : "var(--primary)"));
      setFillColorIconComment((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
      setFillColorIconRuns((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
    }
  };

  /**
   * The function handles a click event to show or hide a modal for runs and updates the state of other modals accordingly.
   */
  const handleShowRunsClick = (e, collapse, q) => {
    e.stopPropagation();
    e.preventDefault();
    setQuestionId(q.id);
    if (collapse === false) {
      setShowModalComment(false);
      setShowModalRecommandation(false);
      setShowModalRuns(!showModalRuns);
      setFillColorIconRecommandation((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
      setFillColorIconComment((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
      setFillColorIconRuns((prev) => (prev === "var(--primary)" ? "var(--orange)" : "var(--primary)"));
    }
  };

  return (
    <>
    {showPersonalData(hasPersonalData, question) && (
      <PanelGroup accordion id="accordion-example">
        <Panel eventKey={question.id} style={{ borderRadius: "10px", borderWidth: "2px", borderColor: "var(--primary)" }}>
          <Panel.Heading style={{ background: "white", borderRadius: "18px" }}>
            <Panel.Title toggle onClick={(e) => handlePanelUpdate(e, sectionId, question.id)}>
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
                  {!readonly && (
                    <>
                      <div
                        data-tooltip-id="scriptTip"
                        className={styles.panel_icon}
                        onClick={(e) => {
                          handleShowRunsClick(e, isCollapsed?.[researchOutputId]?.[sectionId]?.[question.id], question);
                        }}
                      >
                        <BsGear
                          size={40}
                          style={{ marginTop: "6px", marginRight: "4px" }}
                          fill={
                            isCollapsed?.[researchOutputId]?.[sectionId]?.[question.id] === false && questionId && questionId === question.id
                              ? fillColorIconRuns
                              : "var(--primary)"
                          }
                        />
                      </div>
                      <ReactTooltip id="scriptTip" place="bottom" effect="solid" variant="info" content={t("Script")} />
                      {isCollapsed?.[researchOutputId]?.[sectionId]?.[question.id] === false &&
                        showModalRuns &&
                        questionId &&
                        questionId == question.id && (
                          <RunsModal
                            show={showModalRuns}
                            setshowModalRuns={setShowModalRuns}
                            setFillColorIconRuns={setFillColorIconRuns}
                          ></RunsModal>
                        )}
                    </>
                  )}

                  {/* 1 */}
                  <div
                    data-tooltip-id="commentTip"
                    className={styles.panel_icon}
                    onClick={(e) => {
                      handleShowCommentClick(e, isCollapsed?.[researchOutputId]?.[sectionId]?.[question.id], question);
                    }}
                  >
                    <CommentSVG
                      fill={
                        isCollapsed?.[researchOutputId]?.[sectionId]?.[question.id] === false && questionId && questionId === question.id
                          ? fillColorIconComment
                          : "var(--primary)"
                      }
                    />
                  </div>
                  <ReactTooltip id="commentTip" place="bottom" effect="solid" variant="info" content={t("Comment")} />
                  {isCollapsed?.[researchOutputId]?.[sectionId]?.[question.id] === false &&
                    showModalComment &&
                    questionId &&
                    questionId == question.id && (
                      <CommentModal
                        show={showModalComment}
                        setshowModalComment={setShowModalComment}
                        setFillColorIconComment={setFillColorIconComment}
                        answerId={""}
                        researchOutputId={researchOutputId}
                        planId={planId}
                        userId={""}
                        questionId={question.id}
                        readonly={readonly}
                      ></CommentModal>
                    )}
                  {/* 2 */}

                  {questionsWithGuidance && questionsWithGuidance.includes(question.id) && (
                    <div
                      data-tooltip-id="guidanceTip"
                      className={styles.panel_icon}
                      onClick={(e) => {
                        handleShowRecommandationClick(e, isCollapsed?.[researchOutputId]?.[sectionId]?.[question.id], question);
                      }}
                    >
                      <LightSVG
                        fill={
                          isCollapsed?.[researchOutputId]?.[sectionId]?.[question.id] === false && questionId && questionId === question.id
                            ? fillColorIconRecommandation
                            : "var(--primary)"
                        }
                      />
                    </div>
                  )}

                  <ReactTooltip id="guidanceTip" place="bottom" effect="solid" variant="info" content={t("Recommandation")} />
                  {isCollapsed?.[researchOutputId]?.[sectionId]?.[question.id] === false &&
                    showModalRecommandation &&
                    questionId &&
                    questionId == question.id && (
                      <GuidanceModal
                        show={showModalRecommandation}
                        setshowModalRecommandation={setShowModalRecommandation}
                        setFillColorIconRecommandation={setFillColorIconRecommandation}
                        questionId={questionId}
                      ></GuidanceModal>
                    )}
                  {/* 3 */}
                  {isCollapsed?.[researchOutputId]?.[sectionId]?.[question.id] ? (
                    <TfiAngleDown
                      style={{ minWidth: "35px" }}
                      size={35}
                      className={styles.down_icon}
                      onClick={(e) => {
                        handlePanelUpdate(e, sectionId, question.id);
                      }}
                    />
                  ) : (
                    <TfiAngleUp
                      size={35}
                      style={{ minWidth: "35px" }}
                      className={styles.down_icon}
                      onClick={(e) => {
                        handlePanelUpdate(e, sectionId, question.id);
                      }}
                    />
                  )}
                </span>
              </div>
            </Panel.Title>
          </Panel.Heading>
          {isCollapsed?.[researchOutputId]?.[sectionId]?.[question.id] === false && (
            <Panel.Body collapsible={isCollapsed && isCollapsed?.[researchOutputId]?.[sectionId]?.[question.id]}>
              <Form
                schemaId={question.madmp_schema_id}
                researchOutputId={researchOutputId}
                questionId={question.id}
                planId={planId}
                readonly={readonly}
              ></Form>
            </Panel.Body>
          )}
        </Panel>
      </PanelGroup>
    )}
  </>
  )
}
export default Question;