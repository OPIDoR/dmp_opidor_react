import React, { useEffect, useState } from "react";
import { getQuestion } from "../../services/DmpRedactionApi";
import CustumSpinner from "../Shared/CustumSpinner";
import { Panel, PanelGroup } from "react-bootstrap";
import { TfiAngleDown } from "react-icons/tfi";
import { TfiAngleUp } from "react-icons/tfi";
import { BsGear } from "react-icons/bs";
import styles from "../assets/css/redactions.module.css";
import DOMPurify from "dompurify";
import ModalRecommandation from "./ModalRecommandation";
import ModalComment from "./ModalComment";
import BellSVG from "../Styled/svg/BellSVG";
import LightSVG from "../Styled/svg/LightSVG";
import ModalRuns from "./MadalRuns";
import Form from "../Forms/Form";

function Redaction({ researchId, planId }) {
  // console.log(researchId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(null);
  const [initialCollapse, setinitialCollapse] = useState(null);
  const [showModalRecommandation, setshowModalRecommandation] = useState(false);
  const [showModalComment, setshowModalComment] = useState(false);
  const [showModalRuns, setshowModalRuns] = useState(false);
  const [fillColorGear, setFillColorGear] = useState("var(--primary)");
  const [fillColorLight, setFillColorLight] = useState("var(--primary)");
  const [fillColorBell, setFillColorBell] = useState("var(--primary)");

  /**
   * If the idx passed in is the same as the elIndex, then set the value to false, otherwise set it to true.
   */
  const handleCollapseAll = (idx) => {
    setIsCollapsed((prevState) => {
      const newState = { ...prevState };
      Object.keys(newState).forEach((elIndex) => {
        newState[elIndex] = { ...newState[elIndex] };
        Object.keys(newState[elIndex]).forEach((qIndex) => {
          newState[elIndex][qIndex] = idx === parseInt(elIndex) ? false : true;
        });
      });
      return newState;
    });
  };

  /**
   * `handlePanelToggle` is a function that takes an event, an element index, and a question index,
   * and then sets the state of `isCollapsed` to the
   * opposite of what it was before.
   */
  const handlePanelToggle = (e, elIndex, qIndex) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCollapsed((prevState) => {
      const newState = {
        ...prevState,
        [elIndex]: {
          ...prevState[elIndex],
          [qIndex]: !prevState?.[elIndex]?.[qIndex],
        },
      };
      return newState;
    });
  };

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
        const allColl = result.reduce((acc, el, idx) => {
          acc[idx] = {};
          el.questions.forEach((q, i) => {
            acc[idx][i] = true;
          });
          return acc;
        }, {});
        setinitialCollapse(allColl);
        setIsCollapsed(allColl);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  /**
   * If the collapse is false, then set showModalRecommandation to false, set showModalComment to the opposite
   *  of what it is, set FillColorLight to the
   * opposite of what it is, and set FillColorBell to the opposite of what it is.
   */
  const handleLightClick = (e, collapse) => {
    e.stopPropagation();
    e.preventDefault();
    if (collapse === false) {
      setshowModalRecommandation(false);
      setshowModalRuns(false);
      setshowModalComment(!showModalComment);
      setFillColorLight((prev) => (prev === "var(--primary)" ? "var(--orange)" : "var(--primary)"));
      setFillColorBell((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
      setFillColorGear((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
    }
  };
  /**
   * If the collapse is false, then set showModalComment to false, set showModalRecommandation to the opposite
   * of what it is, set FillColorBell to the
   * opposite of what it is, and set FillColorLight to the opposite of what it is.
   */
  const handleBellClick = (e, collapse) => {
    e.stopPropagation();
    e.preventDefault();
    if (collapse === false) {
      setshowModalComment(false);
      setshowModalRuns(false);
      setshowModalRecommandation(!showModalRecommandation);
      setFillColorBell((prev) => (prev === "var(--primary)" ? "var(--orange)" : "var(--primary)"));
      setFillColorLight((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
      setFillColorGear((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
    }
  };

  const handleGearClick = (e, collapse) => {
    e.stopPropagation();
    e.preventDefault();
    if (collapse === false) {
      setshowModalComment(false);
      setshowModalRecommandation(false);
      setshowModalRuns(!showModalRuns);
      setFillColorBell((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
      setFillColorLight((prev) => (prev === "var(--orange)" ? "var(--primary)" : "var(--primary)"));
      setFillColorGear((prev) => (prev === "var(--primary)" ? "var(--orange)" : "var(--primary)"));
    }
  };

  return (
    <>
      <div>
        {loading && <CustumSpinner></CustumSpinner>}
        {!loading && error && <p>error</p>}
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
                          handleCollapseAll(idx);
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
                          <Panel.Title toggle onClick={(e) => handlePanelToggle(e, idx, i)}>
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
                                    handleGearClick(e, isCollapsed[idx][i]);
                                  }}
                                >
                                  <BsGear
                                    size={40}
                                    style={{ marginTop: "6px", marginRight: "4px" }}
                                    fill={isCollapsed[idx][i] === false ? fillColorGear : "var(--primary)"}
                                  />
                                </div>
                                {isCollapsed[idx][i] === false && showModalRuns && (
                                  <ModalRuns show={showModalRuns} setshowModalRuns={setshowModalRuns} setFillColorGear={setFillColorGear}></ModalRuns>
                                )}
                                {/* 1 */}
                                <div
                                  className={styles.light_icon}
                                  onClick={(e) => {
                                    handleLightClick(e, isCollapsed[idx][i]);
                                  }}
                                >
                                  <LightSVG fill={isCollapsed[idx][i] === false ? fillColorLight : "var(--primary)"} />
                                </div>
                                {isCollapsed[idx][i] === false && showModalRecommandation && (
                                  <ModalRecommandation
                                    show={showModalRecommandation}
                                    setshowModalRecommandation={setshowModalRecommandation}
                                    setFillColorBell={setFillColorBell}
                                  ></ModalRecommandation>
                                )}
                                {/* 2 */}
                                <div
                                  className={styles.bell_icon}
                                  onClick={(e) => {
                                    handleBellClick(e, isCollapsed[idx][i]);
                                  }}
                                >
                                  <BellSVG fill={isCollapsed[idx][i] === false ? fillColorBell : "var(--primary)"} />
                                </div>

                                {isCollapsed[idx][i] === false && showModalComment && (
                                  <ModalComment
                                    show={showModalComment}
                                    setshowModalComment={setshowModalComment}
                                    setFillColorLight={setFillColorLight}
                                    answerId={""}
                                    researchOutputId={researchId}
                                    planId={planId}
                                    userId={""}
                                    questionId={q.id}
                                  ></ModalComment>
                                )}
                                {/* <Modal show={showModalRecommandation}></Modal> */}
                                {/* 3 */}
                                {isCollapsed[idx][i] ? (
                                  <TfiAngleDown
                                    size={35}
                                    className={styles.down_icon}
                                    onClick={(e) => {
                                      handlePanelToggle(e, idx, i);
                                    }}
                                  />
                                ) : (
                                  <TfiAngleUp
                                    size={35}
                                    className={styles.down_icon}
                                    onClick={(e) => {
                                      handlePanelToggle(e, idx, i);
                                    }}
                                  />
                                )}
                              </span>
                            </div>
                          </Panel.Title>
                        </Panel.Heading>
                        {isCollapsed[idx][i] === false && (
                          <Panel.Body collapsible={isCollapsed && isCollapsed[idx][i]}>
                            <Form
                              schemaId={q.madmp_schema_id}
                              sections={initialData}
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
