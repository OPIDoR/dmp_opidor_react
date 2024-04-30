import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { Panel, Label } from "react-bootstrap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { BsGear } from "react-icons/bs";
import { TbBulbFilled } from "react-icons/tb";
import { IoShuffleOutline } from "react-icons/io5";

import { GlobalContext } from "../../context/Global";
import * as styles from "../../assets/css/write_plan.module.css";
import DynamicForm from "../../Forms/DynamicForm";
import GuidanceModal from "./GuidanceModal";
import CommentModal from "../../WritePlan/CommentModal";
import RunsModal from "../../WritePlan/RunsModal";
import { CommentSVG } from "../../Styled/svg";
import useSectionsMode from "../../../hooks/useSectionsMode";

function Question({
  question,
  questionIdx,
  sectionId,
  sectionNumber,
  readonly,
}) {
  // --- STATE ---
  const {
    planData,
    openedQuestions,
    setOpenedQuestions,
    displayedResearchOutput,
    questionsWithGuidance,
    setUrlParams,
  } = useContext(GlobalContext);
  const { mode } = useSectionsMode();

  const [questionId] = useState(question.id);
  const [fragmentId, setFragmentId] = useState(null);
  const [answerId, setAnswerId] = useState(null);
  const [scriptsData, setScriptsData] = useState({ scripts: [] }); // {classname: "class", id: 1}

  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showRunsModal, setShowRunsModal] = useState(false);
  const [showFormSelectorModal, setShowFormSelectorModal] = useState(false);

  const [fillRunsIconColor, setFillRunsIconColor] = useState("var(--dark-blue)");
  const [fillCommentIconColor, setFillCommentIconColor] = useState("var(--dark-blue)");
  const [fillGuidanceIconColor, setFillGuidanceIconColor] = useState("var(--dark-blue)");
  const [fillFormSelectorIconColor, setFillFormSelectorIconColor] = useState("var(--dark-blue)");

  const [currentResearchOutput, setCurrentResearchOutput] = useState(null);

  const { formSelectors } = useContext(GlobalContext);

  const { t } = useTranslation();

  const DRO_ID = displayedResearchOutput?.id || 0;

  /**
   * Checks if a specific question is opened based on its identifiers within the nested object structure.
   *
   * @returns {boolean} True if the question is opened, false otherwise.
   */
  const isQuestionOpened = () => {
    return !!openedQuestions?.[DRO_ID]?.[sectionId]?.[questionId];
  };
  
  // --- BEHAVIOURS ---
  useEffect(() => {
    if (displayedResearchOutput) {
      // console.log("DRO", displayedResearchOutput);
      const answer = displayedResearchOutput.answers?.find(
        (answer) => question?.id === answer?.question_id
      );
      setAnswerId(answer?.answer_id);
      setFragmentId(answer?.fragment_id);
    }

    const queryParameters = new URLSearchParams(window.location.search);
    setUrlParams({ research_output: queryParameters.get('research_output') });

    setCurrentResearchOutput(Number.parseInt(queryParameters.get('research_output'), 10));

    handleIconClick(null, 'formSelector');
  }, [displayedResearchOutput, question.id, currentResearchOutput]);

  /**
   * Handles toggling the open/collapse state of a question.
   * This function is called when a question is collapsed or expanded.
   * It updates the state of opened questions based on the changes.
   */
  const handleQuestionCollapse = (expanded) => {
    closeAllModals();

    const updatedState = { ...openedQuestions };
    if (!updatedState[DRO_ID]) {
      updatedState[DRO_ID] = {};
    }
    updatedState[DRO_ID][sectionId] = { ...updatedState[DRO_ID][sectionId], [questionId]: expanded };
    setOpenedQuestions(updatedState);

    const queryParameters = new URLSearchParams(window.location.search);
    setUrlParams({ research_output: queryParameters.get('research_output') });
    handleIconClick(null, 'formSelector');
  };

  const closeAllModals = () => {
    setShowCommentModal(false);
    setFillCommentIconColor('var(--dark-blue)');

    setShowGuidanceModal(false);
    setFillGuidanceIconColor('var(--dark-blue)');

    setShowFormSelectorModal(false);
    setFillFormSelectorIconColor('var(--dark-blue)');

    setShowRunsModal(false);
    setFillRunsIconColor('var(--dark-blue)');
  };

  /**
   * Handles the click event for showing modals and updating icon colors based on the modal type.
   *
   * @param {Event} e - The click event object.handleIconClick
   * @param {string} modalType - The type of modal to show ('comment', 'guidance', or 'runs').
   */
  const handleIconClick = (e, modalType) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // Check if the current modal type is the same as the one that is about to be opened
    const isModalOpen =
      (modalType === 'comment' && showCommentModal) ||
      (modalType === 'guidance' && showGuidanceModal) ||
      (modalType === 'runs' && showRunsModal) ||
      (modalType === 'formSelector' && showFormSelectorModal)

    // If the current modal is the same as the one about to be opened, close it
    if (isModalOpen) {
      return closeAllModals();
    }

    // Open the specified modal and update icon colors
    setShowCommentModal(modalType === 'comment');
    setFillCommentIconColor(
      modalType === 'comment' ? 'var(--rust)' : 'var(--dark-blue)',
    );

    setShowGuidanceModal(modalType === 'guidance');
    setFillGuidanceIconColor(
      modalType === 'guidance' ? 'var(--rust)' : 'var(--dark-blue)',
    );

    setShowRunsModal(modalType === 'runs');
    setFillRunsIconColor(
      modalType === 'runs' ? 'var(--rust)' : 'var(--dark-blue)',
    );

    setShowFormSelectorModal(modalType === 'formSelector');
    setFillFormSelectorIconColor(
      modalType === 'formSelector' ? 'var(--rust)' : 'var(--dark-blue)',
    );
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
                      __html: DOMPurify.sanitize([question.text]),
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
                  {questionsWithGuidance.length > 0 && questionsWithGuidance.includes(question.id) && (
                    <div>
                      <ReactTooltip
                        id="guidanceTip"
                        place="bottom"
                        effect="solid"
                        variant="info"
                        content={t("Guidance")}
                      />
                      <div
                        data-tooltip-id="guidanceTip"
                        className={styles.panel_icon}
                        onClick={(e) => {
                          handleIconClick(e, "guidance");
                        }}
                        style={{ marginLeft: "5px" }}
                      >
                        {isQuestionOpened() && (
                          <TbBulbFilled
                            size={32}
                            fill={
                              isQuestionOpened()
                                ? fillGuidanceIconColor
                                : "var(--dark-blue)"
                            }
                            style={{
                              color: isQuestionOpened()
                                ? fillGuidanceIconColor
                                : "var(--dark-blue)"
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {fragmentId && answerId && (
                    <div>
                      <ReactTooltip
                        id="commentTip"
                        place="bottom"
                        effect="solid"
                        variant="info"
                        content={t("Comments")}
                      />
                      <div
                        data-tooltip-id="commentTip"
                        className={styles.panel_icon}
                        onClick={(e) => {
                          handleQuestionCollapse(true);
                          handleIconClick(e, "comment");
                        }}
                        style={{ marginLeft: "5px" }}
                      >
                        {isQuestionOpened() && (
                          <CommentSVG
                            size={32}
                            fill={
                              isQuestionOpened()
                                ? fillCommentIconColor
                                : "var(--dark-blue)"
                            }
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {isQuestionOpened() && formSelectors[fragmentId] && (
                    <div>
                      <ReactTooltip
                        id="form-changer-show-button"
                        place="bottom"
                        effect="solid"
                        variant="info"
                        content={t('List of customized forms')}
                      />
                      <div
                        data-tooltip-id="form-changer-show-button"
                        className={styles.panel_icon}
                        onClick={(e) => {
                          handleIconClick(e, "formSelector");
                        }}
                        style={{ marginLeft: "5px" }}
                      >
                        <IoShuffleOutline
                          data-tooltip-id="form-change-show-button"
                          size={32}
                          fill={
                            isQuestionOpened()
                              ? fillFormSelectorIconColor
                              : "var(--dark-blue)"
                          }
                          style={{
                            color: isQuestionOpened()
                              ? fillFormSelectorIconColor
                              : "var(--dark-blue)"
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {scriptsData.scripts.length > 0 && (
                    <div>
                      <ReactTooltip
                        id="scriptTip"
                        place="bottom"
                        effect="solid"
                        variant="info"
                        content={t("Tools")}
                      />
                      <div
                        data-tooltip-id="scriptTip"
                        className={styles.panel_icon}
                        onClick={(e) => {
                          handleIconClick(e, "runs");
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
                                : "var(--dark-blue)"
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
                </div>
              </div>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body id={`panel-body-${question.id}`} style={{ position: 'relative' }} collapsible={true}>
            {isQuestionOpened() && (
              <div>
                {!readonly && scriptsData.scripts.length > 0 && (
                  <RunsModal
                    show={showRunsModal}
                    setshowModalRuns={setShowRunsModal}
                    setFillColorIconRuns={setFillRunsIconColor}
                    scriptsData={scriptsData}
                    fragmentId={fragmentId}
                  />
                )}
                { displayedResearchOutput && 
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
                }
                {questionsWithGuidance.length > 0 && questionsWithGuidance.includes(question.id) && (<GuidanceModal
                  show={showGuidanceModal}
                  setShowGuidanceModal={setShowGuidanceModal}
                  setFillColorGuidanceIcon={setFillGuidanceIconColor}
                  questionId={questionId}
                  planId={planData.id}
                />)}
              </div>
            )}
            {isQuestionOpened() ? (
              <>
                {fragmentId && answerId ? (
                  <DynamicForm
                    fragmentId={fragmentId}
                    className={question?.madmp_schema?.classname}
                    setScriptsData={setScriptsData}
                    readonly={readonly}
                    formSelector={{
                      show: showFormSelectorModal,
                      setShowFormSelectorModal,
                      setFillFormSelectorIconColor,
                    }}
                    fetchAnswersData={true}
                  />
                ) : (readonly && !mode) ?
                  (
                    <Label bsStyle="primary">{t('Question not answered.')}</Label>
                  ) :
                  (<DynamicForm
                    fragmentId={null}
                    className={question?.madmp_schema?.classname}
                    setScriptsData={setScriptsData}
                    questionId={question.id}
                    madmpSchemaId={question.madmp_schema?.id}
                    setFragmentId={setFragmentId}
                    setAnswerId={setAnswerId}
                    readonly={readonly}
                    formSelector={{
                      show: showFormSelectorModal,
                      setShowFormSelectorModal,
                      setFillFormSelectorIconColor,
                    }}
                    fetchAnswersData={true}
                  />)
                }
              </>
            ) : (
              <></>
            )}
          </Panel.Body>
    </Panel>
  );
}

export default Question;
