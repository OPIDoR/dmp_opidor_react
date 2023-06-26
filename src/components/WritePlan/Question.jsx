import React, { useContext, useState } from "react";
import DOMPurify from "dompurify";
import { Panel, PanelGroup } from "react-bootstrap";
import { TfiAngleDown, TfiAngleRight } from "react-icons/tfi";

import { showPersonalData } from "../../utils/GeneratorUtils";
import { GlobalContext } from "../context/Global";
import styles from "../assets/css/write_plan.module.css";

function Question({question, sectionId, hasPersonalData}) {
  const { 
    isCollapsed, setIsCollapsed,
    displayedResearchOutput
  } = useContext(GlobalContext);
  const [questionId] = useState(question.id);

  console.log(questionId, sectionId, displayedResearchOutput, isCollapsed);

  /**
   * `handlePanelUpdate` is a function that takes an event, an element index, and a question index,
   * and then sets the state of `isCollapsed` to the
   * opposite of what it was before.
   */
  const handlePanelUpdate = (e, elIndex, qIndex) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedState = isCollapsed[displayedResearchOutput.id].map((plan, planIndex) => {
      if (planIndex === elIndex) {
        return {
          ...plan,
          [qIndex]: !plan[qIndex],
        };
      }
      return plan;
    });
    setIsCollapsed({ ...isCollapsed, [displayedResearchOutput.id]: updatedState });
  };

  return (
    <>
      {showPersonalData(hasPersonalData, question) && (
        <PanelGroup accordion id="accordion-example">
          <Panel eventKey={questionId} style={{ borderRadius: "10px", borderWidth: "2px", borderColor: "var(--primary)" }}>
            <Panel.Heading style={{ background: "white", borderRadius: "18px" }}>
              <Panel.Title toggle onClick={(e) => handlePanelUpdate(e, sectionId, questionId)}>
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

                  {<span className={styles.question_icons}>
                    {/* 0 */}
                    {/*<div
                      data-tooltip-id="scriptTip"
                      className={styles.panel_icon}
                      onClick={(e) => {
                        handleShowRunsClick(e, isCollapsed?.[displayedResearchOutput.id]?.[sectionId]?.[questionId], question);
                      }}
                    >
                      <BsGear
                        size={40}
                        style={{ marginTop: "6px", marginRight: "4px" }}
                        fill={
                          isCollapsed?.[displayedResearchOutput.id]?.[sectionId]?.[questionId] === false && questionId && questionId === question.id
                            ? fillRunsIconColor
                            : "var(--primary)"
                        }
                      />
                    </div>
                    <ReactTooltip id="scriptTip" place="bottom" effect="solid" variant="info" content={t("Script")} />
                    {isCollapsed?.[displayedResearchOutput.id]?.[sectionId]?.[questionId] === false && showRunsModal && questionId && questionId == question.id && (
                      <RunsModal
                        show={showRunsModal}
                        setshowModalRuns={setShowRunsModal}
                        setFillColorIconRuns={setFillRunsIconColor}
                      ></RunsModal>
                    )}*/}
                    {/* 1 */}
                    {/*<div
                      data-tooltip-id="commentTip"
                      className={styles.panel_icon}
                      onClick={(e) => {
                        handleShowCommentClick(e, isCollapsed?.[displayedResearchOutput.id]?.[sectionId]?.[questionId], question);
                      }}
                    >
                      <CommentSVG
                        fill={
                          isCollapsed?.[displayedResearchOutput.id]?.[sectionId]?.[questionId] === false && questionId && questionId === question.id
                            ? fillCommentIconColor
                            : "var(--primary)"
                        }
                      />
                    </div>
                    <ReactTooltip id="commentTip" place="bottom" effect="solid" variant="info" content={t("Comment")} />
                    {isCollapsed?.[displayedResearchOutput.id]?.[sectionId]?.[questionId] === false &&
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
                        ></CommentModal>
                      )}*/}
                    {/* 2 */}

                    {/*{questionGuidance && questionGuidance.includes(question.id) && (
                      <div
                        data-tooltip-id="guidanceTip"
                        className={styles.panel_icon}
                        onClick={(e) => {
                          handleShowRecommandationClick(e, isCollapsed?.[displayedResearchOutput.id]?.[sectionId]?.[questionId], question);
                        }}
                      >
                        <LightSVG
                          fill={
                            isCollapsed?.[displayedResearchOutput.id]?.[sectionId]?.[questionId] === false && questionId && questionId === question.id
                              ? fillGuidanceIconColor
                              : "var(--primary)"
                          }
                        />
                      </div>
                    )}

                    <ReactTooltip id="guidanceTip" place="bottom" effect="solid" variant="info" content={t("Recommandation")} />
                    {isCollapsed?.[displayedResearchOutput.id]?.[sectionId]?.[questionId] === false &&
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
                    {isCollapsed?.[displayedResearchOutput.id]?.[sectionId]?.[questionId] ? (
                      <TfiAngleRight
                        style={{ minWidth: "35px" }}
                        size={35}
                        className={styles.down_icon}
                        onClick={(e) => {
                          handlePanelUpdate(e, sectionId, questionId);
                        }}
                      />
                    ) : (
                      <TfiAngleDown
                        size={35}
                        style={{ minWidth: "35px" }}
                        className={styles.down_icon}
                        onClick={(e) => {
                          handlePanelUpdate(e, sectionId, questionId);
                        }}
                      />
                    )}
                  </span>}
                </div>
              </Panel.Title>
            </Panel.Heading>
            {isCollapsed?.[displayedResearchOutput.id]?.[sectionId]?.[questionId] === false && (
              <Panel.Body collapsible={isCollapsed && isCollapsed?.[displayedResearchOutput.id]?.[sectionId]?.[questionId]}>
                {/*<Form
                  schemaId={q.madmp_schema_id}
                  planData={initialData}
                  displayedResearchOutput.id={displayedResearchOutput.id}
                  questionId={q.id}
                  planId={planId}
            ></Form>*/}
                {/*<DynamicForm fragmentId={projectFragmentId} />*/}
              </Panel.Body>
            )}
          </Panel>
        </PanelGroup>
      )}
    </>
  );

}

export default Question;
