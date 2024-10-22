import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { Panel, Label } from "react-bootstrap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { BsGear } from "react-icons/bs";
import { TbBulbFilled } from "react-icons/tb";
import { IoShuffleOutline } from "react-icons/io5";

import { GlobalContext } from "../context/Global";
import * as styles from "../assets/css/write_plan.module.css";
import DynamicForm from "../Forms/DynamicForm";
import GuidanceModal from "./GuidanceModal";
import CommentModal from "./CommentModal";
import RunsModal from "./RunsModal";
import { CommentSVG } from "../Styled/svg";

const closedModalState = {
  guidance: false,
  comment: false,
  runs: false,
  formSelector: false,
};
function Question({
  planId,
  question,
  questionIdx,
  sectionId,
  sectionNumber,
  readonly,
}) {
  const {
    openedQuestions,
    setOpenedQuestions,
    displayedResearchOutput,
    questionsWithGuidance,
  } = useContext(GlobalContext);
  const [questionId] = useState(question.id);
  const [answer, setAnswer] = useState(null);
  const [scriptsData, setScriptsData] = useState({ scripts: [] });
  const [showModals, setShowModals] = useState({
    guidance: false,
    comment: false,
    runs: false,
    formSelector: true,
  });

  const { formSelectors } = useContext(GlobalContext);

  const { t } = useTranslation();

  useEffect(() => {
    const ans = displayedResearchOutput?.answers?.find(
      (a) => question?.id === a?.question_id
    );
    setAnswer(ans);
  }, [displayedResearchOutput, question.id]);

  /**
   * Handles toggling the open/collapse state of a question.
   * This function is called when a question is collapsed or expanded.
   * It updates the state of opened questions based on the changes.
   */
  const handleQuestionCollapse = (expanded) => {
    const updatedState = { ...openedQuestions[displayedResearchOutput.id] };

    if (!updatedState[sectionId]) {
      updatedState[sectionId] = {
        [questionId]: false,
      };
    }

    updatedState[sectionId] = {
      ...updatedState[sectionId],
      [questionId]: expanded,
    };

    setOpenedQuestions({
      ...openedQuestions,
      [displayedResearchOutput.id]: updatedState,
    });
  };

  const getFillColor = (isOpened) => {
    return isOpened ? 'var(--rust)' : 'var(--dark-blue)'
  }

  /**
   * Handles a given modal state according to the modalType & the state 
   */
  const setModalOpened = (e, modalType, isOpened) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowModals({ ...closedModalState, [modalType]: isOpened });
  }


  /**
   * Checks if a specific question is opened based on its identifiers within the nested object structure.
   *
   * @returns {boolean} True if the question is opened, false otherwise.
   */
  const isQuestionOpened = () =>
    !!openedQuestions?.[displayedResearchOutput?.id]?.[sectionId]?.[questionId];

  return (
    <>
      {
        <Panel
          id="question-panel"
          expanded={isQuestionOpened()}
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
                          setModalOpened(e, "guidance", true);
                        }}
                        style={{ marginLeft: "5px" }}
                      >
                        {isQuestionOpened() && (
                          <TbBulbFilled
                            size={32}
                            fill={getFillColor(showModals.guidance)}
                            style={{ color: getFillColor(showModals.guidance) }}
                          />
                        )}
                      </div>
                    </div>
                  )}

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
                        setModalOpened(e, "comment", true);
                      }}
                      style={{ marginLeft: "5px" }}
                    >
                      {isQuestionOpened() && (
                        <CommentSVG
                          size={32}
                          fill={getFillColor(showModals.comment)}
                        />
                      )}
                    </div>
                  </div>

                  {isQuestionOpened() && !answer && formSelectors[question?.madmp_schema?.classname] && (
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
                          setModalOpened(e, "formSelector", true);
                        }}
                        style={{ marginLeft: "5px" }}
                      >
                        <IoShuffleOutline
                          data-tooltip-id="form-change-show-button"
                          size={32}
                          fill={getFillColor(showModals.formSelector)}
                          style={{ color: getFillColor(showModals.formSelector) }}
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
                          setModalOpened(e, "runs", true);
                        }}
                        style={{ marginLeft: "5px" }}
                      >
                        {isQuestionOpened() && (
                          <BsGear
                            size={32}
                            style={{ marginTop: "6px" }}
                            fill={getFillColor(showModals.runs)}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {isQuestionOpened() ? (
                    <TfiAngleUp
                      style={{ marginLeft: "5px" }}
                      size={32}
                    />
                  ) : (
                    <TfiAngleDown
                      style={{ marginLeft: "5px" }}
                      size={32}
                    />
                  )}
                </div>
              </div>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body id={`panel-body-${question.id}`} style={{ position: 'relative' }} collapsible={true}>
            {isQuestionOpened() && (
              <div>
                {answer && (
                  <>
                    {!readonly && scriptsData.scripts.length > 0 && (
                      <RunsModal
                        shown={showModals.runs === true}
                        hide={(e) => setModalOpened(e, 'runs', false)}
                        scriptsData={scriptsData}
                        fragmentId={answer?.fragment_id}
                      />
                    )}
                  </>
                )}
                <CommentModal
                  shown={showModals.comment === true}
                  hide={(e) => setModalOpened(e, 'comment', false)}
                  answerId={answer?.id}
                  setAnswer={setAnswer}
                  researchOutputId={displayedResearchOutput.id}
                  planId={planId}
                  questionId={question.id}
                  readonly={readonly}
                />
                {questionsWithGuidance.length > 0 && questionsWithGuidance.includes(question.id) && (<GuidanceModal
                  shown={showModals.guidance === true}
                  hide={(e) => setModalOpened(e, 'guidance', false)}
                  questionId={questionId}
                  planId={planId}
                />)}
              </div>
            )}
            {isQuestionOpened() ? (
              <>
                {readonly && !answer?.id ? (<Label bsStyle="primary">{t('Question not answered.')}</Label>) :
                  (<DynamicForm
                    fragmentId={answer?.fragment_id}
                    className={question?.madmp_schema?.classname}
                    setScriptsData={setScriptsData}
                    questionId={question.id}
                    madmpSchemaId={question.madmp_schema?.id}
                    setAnswer={setAnswer}
                    readonly={readonly}
                    formSelector={{
                      shown: showModals.formSelector === true,
                      hide: (e) => setModalOpened(e, 'formSelector', false)
                    }}
                  />)
                }
              </>
            ) : (
              <></>
            )}
          </Panel.Body>
        </Panel>
      }
    </>
  );
}

export default Question;
