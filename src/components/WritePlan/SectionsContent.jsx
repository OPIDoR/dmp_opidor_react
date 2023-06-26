import React, { useContext, useEffect, useState } from "react";
import { getQuestion } from "../../services/DmpRedactionApi";
import CustomSpinner from "../Shared/CustomSpinner";
import { Panel, PanelGroup } from "react-bootstrap";
import { TfiAngleDown } from "react-icons/tfi";
import { TfiAngleUp } from "react-icons/tfi";
import { BsGear } from "react-icons/bs";
import styles from "../assets/css/redactions.module.css";
import DOMPurify from "dompurify";
import GuidanceModal from "./GuidanceModal";
import CommentModal from "./CommentModal";
import RunsModal from "./RunsModal";
import LightSVG from "../Styled/svg/LightSVG";
import CommentSVG from "../Styled/svg/CommentSVG";
import Form from "../Forms/Form";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import Swal from "sweetalert2";
import { deleteResearchOutput } from "../../services/DmpResearchOutput";
import { showPersonnalData } from "../../utils/GeneratorUtils";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Tooltip as ReactTooltip } from "react-tooltip";

function SectionsContent({ researchOutputId, planId, hasPersonalData, readonly }) {
  const { t } = useTranslation();
  const { isCollapsed, setIsCollapsed, setResearchOutputsData, researchOutputsData } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [initialCollapse, setInitialCollapse] = useState(null);
  const [showModalRecommandation, setShowModalRecommandation] = useState(false);
  const [showModalComment, setShowModalComment] = useState(false);
  const [showModalRuns, setShowModalRuns] = useState(false);
  const [fillColorIconRuns, setFillColorIconRuns] = useState("var(--primary)");
  const [fillColorIconComment, setFillColorIconComment] = useState("var(--primary)");
  const [fillColorIconRecommandation, setFillColorIconRecommandation] = useState("var(--primary)");
  const [questionId, setQuestionId] = useState(null);
  const [sectionsData, setSectionsData] = useState(null);
  const [displayedResearchOutput, setDisplayedResearchOutput] = useState(null);
  const [showResearchOutputInfo, setShowResearchOutputInfo] = useState(false);
  const [questionGuidance, setQuestionGuidance] = useState([]);

  /* A useEffect hook that is called when the component is mounted. It is calling the getQuestion function, which is an async function that returns a
promise. When the promise is resolved, it sets the data state to the result of the promise. It then sets the initialCollapse state to the result of
the promise. It then sets the isCollapsed state to the result of the promise. If the promise is rejected, it sets the error state to the error.
Finally, it sets the loading state to false. */
  useEffect(() => {
    setLoading(true);
    getQuestion("token")
      .then((res) => {
        const researchOutputFilter = res.data.plan.research_outputs.filter((el) => {
          return el.id === researchOutputId;
        });
        setDisplayedResearchOutput(researchOutputFilter[0]);
        setQuestionGuidance(res?.data?.plan.questions_with_guidance || []);
        setPlanData(res.data);
        const result = res.data.sections;
        setSectionsData(result);
        if (!isCollapsed || !isCollapsed[researchOutputId]) {
          const allCollapses = res.data.sections.map((plan) => plan.questions.reduce((acc, _, idx) => ({ ...acc, [idx]: true }), {}));
          const updatedCollapseState = { ...isCollapsed, [researchOutputId]: allCollapses };
          setInitialCollapse(updatedCollapseState);
          setIsCollapsed(updatedCollapseState);
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [researchOutputId, researchOutputsData, isCollapsed]);

  /**
   * If the idx passed in is the same as the elIndex, then set the value to false, otherwise set it to true.
   */
  const handleCollapseByIndex = (idx) => {
    const updatedState = isCollapsed[researchOutputId].map((plan, planIndex) => {
      return Object.fromEntries(Object.entries(plan).map(([qIndex, value]) => [qIndex, planIndex === idx ? false : true]));
    });
    setIsCollapsed({ ...isCollapsed, [researchOutputId]: updatedState });
  };

  /**
   * `handlePanelUpdate` is a function that takes an event, an element index, and a question index,
   * and then sets the state of `isCollapsed` to the
   * opposite of what it was before.
   */
  const handlePanelUpdate = (e, elIndex, qIndex) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedState = isCollapsed[researchOutputId].map((plan, planIndex) => {
      if (planIndex === elIndex) {
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

  /**
   * The function handles the deletion of a product from a research output and displays a confirmation message using the SweetAlert library.
   */
  const handleDelete = (e) => {
    const index = planData.plan.research_outputs
      .map(function (img) {
        return img.id;
      })
      .indexOf(researchOutputId);
    e.preventDefault();
    e.stopPropagation();
    if (index == 0) {
      toast.error(t("You cannot delete the first element"));
    } else {
      Swal.fire({
        title: t("Do you confirm the deletion"),
        text: t("By deleting this search product, the associated answers will also be deleted"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: t("Close"),
        confirmButtonText: t("Yes, delete!"),
      }).then((result) => {
        if (result.isConfirmed) {
          //delete
          deleteResearchOutput(researchOutputId, planId).then((res) => {
            //const objectList = { ...researchOutputs };
            //delete objectList[researchOutputId];
            //setResearchOutputs(objectList);
            setResearchOutputsData(res.data.plan.research_outputs);
          });
          Swal.fire(t("Deleted!"), t("Operation completed successfully!."), "success");
        }
      });
    }
  };

  return (
    <>
      <div>
        {loading && <CustomSpinner></CustomSpinner>}
        {!loading && error && <CustomError></CustomError>}
        {!loading && !error && sectionsData && (
          <div>
            <div className="row"></div>

            <div className={styles.redaction_bloc}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  className="alert alert-info col-md-10"
                  style={{ display: "flex", justifyContent: "space-between" }}
                  onClick={() => setShowResearchOutputInfo(!showResearchOutputInfo)}
                >
                  <strong>{displayedResearchOutput?.abbreviation}</strong>
                  <span
                    style={{ marginRight: "10px" }}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={`${t("Contains personal data")} : ${displayedResearchOutput?.metadata?.hasPersonalData ? t("Yes") : t("No")} `}
                  >
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <i className="fas fa-info-circle" style={{ fontSize: "30px" }} />
                    </a>
                  </span>
                </div>

                {!readonly && (
                  <div>
                    <button className="btn btn-default" onClick={handleDelete} style={{ margin: " 15px 0px 0px 11px" }}>
                      {t("Delete")} <i className="fa fa-trash" style={{ marginLeft: "10px" }}></i>
                    </button>
                  </div>
                )}
              </div>
              {showResearchOutputInfo && (
                <div style={{ margin: "0px 10px 30px 10px" }}>
                  <div className={styles.sous_title}>
                    - {t("Search Product Name")} : <strong style={{ fontSize: "20px" }}>{displayedResearchOutput?.metadata?.abbreviation}</strong>
                  </div>
                  <div className={styles.sous_title}>
                    - {t("Contains personal data")} :
                    <strong style={{ fontSize: "20px" }}>{displayedResearchOutput?.metadata?.hasPersonalData ? t("Yes") : t("No")}</strong>
                  </div>
                </div>
              )}
              {sectionsData.map((el, idx) => (
                <React.Fragment key={idx}>
                  <p className={styles.title}>
                    {el.number}. {el.title}
                  </p>
                  <div className="column">
                    <div className={styles.collapse_title}>
                      <a
                        href="#"
                        className={styles.sous_title}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCollapseByIndex(idx);
                        }}
                      >
                        {t("Expand all")}
                      </a>
                      <span className={styles.sous_title}> | </span>
                      <a
                        href="#"
                        className={styles.sous_title}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsCollapsed(initialCollapse);
                        }}
                      >
                        {t("Collapse all")}
                      </a>
                    </div>
                  </div>
                  {el.questions.map((q, i) => (
                    <React.Fragment key={i}>
                      {showPersonnalData(hasPersonalData, q) && (
                        <PanelGroup accordion id="accordion-example">
                          <Panel eventKey={i} style={{ borderRadius: "10px", borderWidth: "2px", borderColor: "var(--primary)" }}>
                            <Panel.Heading style={{ background: "white", borderRadius: "18px" }}>
                              <Panel.Title toggle onClick={(e) => handlePanelUpdate(e, idx, i)}>
                                <div className={styles.question_title}>
                                  <div className={styles.question_text}>
                                    <div className={styles.question_number}>
                                      {el.number}.{q.number}
                                    </div>
                                    <div
                                      className={styles.panel_title}
                                      style={{ margin: "0px !important", fontSize: "18px", fontWeight: "bold", marginRight: "10px" }}
                                      dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize([q.text]),
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
                                            handleShowRunsClick(e, isCollapsed?.[researchOutputId]?.[idx]?.[i], q);
                                          }}
                                        >
                                          <BsGear
                                            size={40}
                                            style={{ marginTop: "6px", marginRight: "4px" }}
                                            fill={
                                              isCollapsed?.[researchOutputId]?.[idx]?.[i] === false && questionId && questionId === q.id
                                                ? fillColorIconRuns
                                                : "var(--primary)"
                                            }
                                          />
                                        </div>
                                        <ReactTooltip id="scriptTip" place="bottom" effect="solid" variant="info" content={t("Script")} />
                                        {isCollapsed?.[researchOutputId]?.[idx]?.[i] === false &&
                                          showModalRuns &&
                                          questionId &&
                                          questionId == q.id && (
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
                                        handleShowCommentClick(e, isCollapsed?.[researchOutputId]?.[idx]?.[i], q);
                                      }}
                                    >
                                      <CommentSVG
                                        fill={
                                          isCollapsed?.[researchOutputId]?.[idx]?.[i] === false && questionId && questionId === q.id
                                            ? fillColorIconComment
                                            : "var(--primary)"
                                        }
                                      />
                                    </div>
                                    <ReactTooltip id="commentTip" place="bottom" effect="solid" variant="info" content={t("Comment")} />
                                    {isCollapsed?.[researchOutputId]?.[idx]?.[i] === false &&
                                      showModalComment &&
                                      questionId &&
                                      questionId == q.id && (
                                        <CommentModal
                                          show={showModalComment}
                                          setshowModalComment={setShowModalComment}
                                          setFillColorIconComment={setFillColorIconComment}
                                          answerId={""}
                                          researchOutputId={researchOutputId}
                                          planId={planId}
                                          userId={""}
                                          questionId={q.id}
                                          readonly={readonly}
                                        ></CommentModal>
                                      )}
                                    {/* 2 */}

                                    {questionGuidance && questionGuidance.includes(q.id) && (
                                      <div
                                        data-tooltip-id="guidanceTip"
                                        className={styles.panel_icon}
                                        onClick={(e) => {
                                          handleShowRecommandationClick(e, isCollapsed?.[researchOutputId]?.[idx]?.[i], q);
                                        }}
                                      >
                                        <LightSVG
                                          fill={
                                            isCollapsed?.[researchOutputId]?.[idx]?.[i] === false && questionId && questionId === q.id
                                              ? fillColorIconRecommandation
                                              : "var(--primary)"
                                          }
                                        />
                                      </div>
                                    )}

                                    <ReactTooltip id="guidanceTip" place="bottom" effect="solid" variant="info" content={t("Recommandation")} />
                                    {isCollapsed?.[researchOutputId]?.[idx]?.[i] === false &&
                                      showModalRecommandation &&
                                      questionId &&
                                      questionId == q.id && (
                                        <GuidanceModal
                                          show={showModalRecommandation}
                                          setshowModalRecommandation={setShowModalRecommandation}
                                          setFillColorIconRecommandation={setFillColorIconRecommandation}
                                          questionId={questionId}
                                        ></GuidanceModal>
                                      )}
                                    {/* 3 */}
                                    {isCollapsed?.[researchOutputId]?.[idx]?.[i] ? (
                                      <TfiAngleDown
                                        style={{ minWidth: "35px" }}
                                        size={35}
                                        className={styles.down_icon}
                                        onClick={(e) => {
                                          handlePanelUpdate(e, idx, i);
                                        }}
                                      />
                                    ) : (
                                      <TfiAngleUp
                                        size={35}
                                        style={{ minWidth: "35px" }}
                                        className={styles.down_icon}
                                        onClick={(e) => {
                                          handlePanelUpdate(e, idx, i);
                                        }}
                                      />
                                    )}
                                  </span>
                                </div>
                              </Panel.Title>
                            </Panel.Heading>
                            {isCollapsed?.[researchOutputId]?.[idx]?.[i] === false && (
                              <Panel.Body collapsible={isCollapsed && isCollapsed?.[researchOutputId]?.[idx]?.[i]}>
                                <Form
                                  schemaId={q.madmp_schema_id}
                                  planData={planData}
                                  researchOutputId={researchOutputId}
                                  questionId={q.id}
                                  planId={planId}
                                  readonly={readonly}
                                ></Form>
                              </Panel.Body>
                            )}
                          </Panel>
                        </PanelGroup>
                      )}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SectionsContent;
