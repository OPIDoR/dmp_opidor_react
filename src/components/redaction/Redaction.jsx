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
import BellSVG from "../Styled/svg/BellSVG";
import LightSVG from "../Styled/svg/LightSVG";
import Form from "../Forms/Form";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";

function Redaction({ researchId, planId }) {
  const { isCollapsed, setIsCollapsed } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [initialCollapse, setinitialCollapse] = useState(null);
  const [showModalRecommandation, setshowModalRecommandation] = useState(false);
  const [showModalComment, setshowModalComment] = useState(false);
  const [showModalRuns, setshowModalRuns] = useState(false);
  const [fillColorIconRuns, setFillColorIconRuns] = useState("var(--primary)");
  const [fillColorIconComment, setFillColorIconComment] = useState("var(--primary)");
  const [fillColorIconRecommandation, setFillColorIconRecommandation] = useState("var(--primary)");
  const [questionId, setquestionId] = useState(null);

  /* A useEffect hook that is called when the component is mounted. It is calling the getQuestion function, which is an async function that returns a
promise. When the promise is resolved, it sets the data state to the result of the promise. It then sets the initialCollapse state to the result of
the promise. It then sets the isCollapsed state to the result of the promise. If the promise is rejected, it sets the error state to the error.
Finally, it sets the loading state to false. */
  useEffect(() => {
    setLoading(true);
    getQuestion("token")
      .then((res) => {
        setInitialData(res.data);
        const result = res.data.sections;
        setData(result);
        if (!isCollapsed || !isCollapsed[planId]) {
          const allCollapses = result.map((plan) => plan.questions.reduce((acc, _, idx) => ({ ...acc, [idx]: true }), {}));
          const updatedCollapseState = { ...isCollapsed, [planId]: allCollapses };
          setinitialCollapse(updatedCollapseState);
          setIsCollapsed(updatedCollapseState);
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [planId]);

  /**
   * If the idx passed in is the same as the elIndex, then set the value to false, otherwise set it to true.
   */
  const handleCollapseByIndex = (idx) => {
    const updatedState = isCollapsed[planId].map((plan, planIndex) => {
      return Object.fromEntries(Object.entries(plan).map(([qIndex, value]) => [qIndex, planIndex === idx ? false : true]));
    });
    setIsCollapsed({ ...isCollapsed, [planId]: updatedState });
  };

  /**
   * `handlePanelUpdate` is a function that takes an event, an element index, and a question index,
   * and then sets the state of `isCollapsed` to the
   * opposite of what it was before.
   */
  const handlePanelUpdate = (e, elIndex, qIndex) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedState = isCollapsed[planId].map((plan, planIndex) => {
      if (planIndex === elIndex) {
        return {
          ...plan,
          [qIndex]: !plan[qIndex],
        };
      }
      return plan;
    });
    setIsCollapsed({ ...isCollapsed, [planId]: updatedState });
  };

  /**
   * The function handles the click event for showing comments and sets the state of various modal and icon colors.
   */
  const handleShowCommentClick = (e, collapse, q) => {
    e.stopPropagation();
    e.preventDefault();
    setquestionId(q.id);
    if (collapse === false) {
      setshowModalRecommandation(false);
      setshowModalRuns(false);
      setshowModalComment(!showModalComment);
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
    setquestionId(q.id);
    if (collapse === false) {
      setshowModalComment(false);
      setshowModalRuns(false);
      setshowModalRecommandation(!showModalRecommandation);
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
    setquestionId(q.id);
    if (collapse === false) {
      setshowModalComment(false);
      setshowModalRecommandation(false);
      setshowModalRuns(!showModalRuns);
      setFillColorIconRecommandation((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
      setFillColorIconComment((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
      setFillColorIconRuns((prev) => (prev === "var(--primary)" ? "var(--orange)" : "var(--primary)"));
    }
  };

  return (
    <>
      <div>
        {loading && <CustomSpinner></CustomSpinner>}
        {!loading && error && <CustomError></CustomError>}
        {!loading && !error && data && (
          <div>
            <div className="row"></div>
            <div className={styles.redaction_bloc}>
              {data.map((el, idx) => (
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
                        Tout développer
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
                        Tout réduire
                      </a>
                    </div>
                  </div>

                  {el.questions.map((q, i) => (
                    <PanelGroup accordion id="accordion-example" key={i}>
                      <Panel eventKey={i} style={{ borderRadius: "10px", borderWidth: "2px", borderColor: "var(--primary)" }}>
                        <Panel.Heading style={{ background: "white", borderRadius: "18px" }}>
                          <Panel.Title toggle onClick={(e) => handlePanelUpdate(e, idx, i)}>
                            <div className={styles.question_title}>
                              <div className={styles.question_text}>
                                <div className={styles.question_number}>
                                  {el.number}.{q.number}
                                </div>
                                <div
                                  style={{ marginTop: "12px", fontSize: "18px", fontWeight: "bold" }}
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize([q.text]),
                                  }}
                                />
                              </div>

                              <span className={styles.question_icons}>
                                {/* 0 */}
                                <div
                                  className={styles.light_icon}
                                  onClick={(e) => {
                                    handleShowRunsClick(e, isCollapsed[planId][idx][i], q);
                                  }}
                                >
                                  <BsGear
                                    size={40}
                                    style={{ marginTop: "6px", marginRight: "4px" }}
                                    fill={
                                      isCollapsed[planId][idx][i] === false && questionId && questionId === q.id
                                        ? fillColorIconRuns
                                        : "var(--primary)"
                                    }
                                  />
                                </div>
                                {isCollapsed[planId][idx][i] === false && showModalRuns && questionId && questionId == q.id && (
                                  <RunsModal
                                    show={showModalRuns}
                                    setshowModalRuns={setshowModalRuns}
                                    setFillColorIconRuns={setFillColorIconRuns}
                                  ></RunsModal>
                                )}
                                {/* 1 */}
                                <div
                                  className={styles.light_icon}
                                  onClick={(e) => {
                                    handleShowCommentClick(e, isCollapsed[planId][idx][i], q);
                                  }}
                                >
                                  <LightSVG
                                    fill={
                                      isCollapsed[planId][idx][i] === false && questionId && questionId === q.id
                                        ? fillColorIconComment
                                        : "var(--primary)"
                                    }
                                  />
                                </div>
                                {isCollapsed[planId][idx][i] === false && showModalComment && questionId && questionId == q.id && (
                                  <CommentModal
                                    show={showModalComment}
                                    setshowModalComment={setshowModalComment}
                                    setFillColorIconComment={setFillColorIconComment}
                                    answerId={""}
                                    researchOutputId={researchId}
                                    planId={planId}
                                    userId={""}
                                    questionId={q.id}
                                  ></CommentModal>
                                )}
                                {/* 2 */}
                                <div
                                  className={styles.bell_icon}
                                  onClick={(e) => {
                                    handleShowRecommandationClick(e, isCollapsed[planId][idx][i], q);
                                  }}
                                >
                                  <BellSVG
                                    fill={
                                      isCollapsed[planId][idx][i] === false && questionId && questionId === q.id
                                        ? fillColorIconRecommandation
                                        : "var(--primary)"
                                    }
                                  />
                                </div>
                                {isCollapsed[planId][idx][i] === false && showModalRecommandation && questionId && questionId == q.id && (
                                  <GuidanceModal
                                    show={showModalRecommandation}
                                    setshowModalRecommandation={setshowModalRecommandation}
                                    setFillColorIconRecommandation={setFillColorIconRecommandation}
                                  ></GuidanceModal>
                                )}

                                {/* 3 */}
                                {isCollapsed[planId][idx][i] ? (
                                  <TfiAngleDown
                                    size={35}
                                    className={styles.down_icon}
                                    onClick={(e) => {
                                      handlePanelUpdate(e, idx, i);
                                    }}
                                  />
                                ) : (
                                  <TfiAngleUp
                                    size={35}
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
                        {isCollapsed[planId][idx][i] === false && (
                          <Panel.Body collapsible={isCollapsed && isCollapsed[planId][idx][i]}>
                            <Form
                              schemaId={q.madmp_schema_id}
                              searchProductPlan={initialData}
                              researchId={researchId}
                              questionId={q.id}
                              planId={planId}
                            ></Form>
                          </Panel.Body>
                        )}
                      </Panel>
                    </PanelGroup>
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

export default Redaction;
