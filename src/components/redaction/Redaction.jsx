import React, { useEffect, useRef, useState } from "react";
import { getQuestion } from "../../services/DmpRedactionApi";
import CustumSpinner from "../Shared/CustumSpinner";
import { Panel, PanelGroup } from "react-bootstrap";
import Banner from "../Shared/Banner";
import Footer from "../Shared/Footer";
import Header from "../Shared/Header";
import MainForm from "../Forms/MainForm";
import { HiOutlineLightBulb } from "react-icons/hi";
import { AiOutlineBell } from "react-icons/ai";
import { TfiAngleDown } from "react-icons/tfi";
import { TfiAngleUp } from "react-icons/tfi";
import styles from "../assets/css/redactions.module.css";

import DOMPurify from "dompurify";
import Navbar from "../Shared/Navbar";
import ModalRecommandation from "./ModalRecommandation";
import ModalComment from "./ModalComment";

function Redaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(null);
  const [initialCollapse, setinitialCollapse] = useState(null);
  const [showModalRecommandation, setshowModalRecommandation] = useState(false);
  const [showModalComment, setshowModalComment] = useState(false);

  const handleCollapseAll = (idx) => {
    setIsCollapsed((prevState) => {
      const newState = { ...prevState };
      Object.keys(newState).forEach((elIndex) => {
        newState[elIndex] = { ...newState[elIndex] };
        Object.keys(newState[elIndex]).forEach((qIndex) => {
          newState[elIndex][qIndex] = idx === parseInt(elIndex) ? false : true;
        });
      });
      console.log(newState);
      return newState;
    });
  };

  const handlePanelToggle = (elIndex, qIndex) => {
    setIsCollapsed((prevState) => {
      const newState = {
        ...prevState,
        [elIndex]: {
          ...prevState[elIndex],
          [qIndex]: !prevState?.[elIndex]?.[qIndex],
        },
      };
      console.log("newState:", newState);
      return newState;
    });
  };

  useEffect(() => {
    setLoading(true);
    getQuestion("token")
      .then((res) => {
        const result = res.data;
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

  return (
    <>
      <Header></Header>
      <Banner></Banner>
      <Navbar></Navbar>
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
                      <span className={styles.sous_title} onClick={() => handleCollapseAll(idx)}>
                        Tout développer{" "}
                      </span>
                      <span className={styles.sous_title}> | </span>
                      <span className={styles.sous_title} onClick={() => setIsCollapsed(initialCollapse)}>
                        Tout réduire{" "}
                      </span>
                    </div>
                  </div>

                  {el.questions.map((q, i) => (
                    <PanelGroup accordion id="accordion-example" key={i}>
                      <Panel eventKey={i}>
                        <Panel.Heading>
                          <Panel.Title toggle onClick={() => handlePanelToggle(idx, i)}>
                            <div className={styles.question_title}>
                              <div className={styles.question_text}>
                                <div className={styles.question_number}>
                                  {el.number}.{q.number}
                                </div>
                                <div
                                  style={{ marginTop: "12px" }}
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize([q.text]),
                                  }}
                                />
                              </div>

                              <span className={styles.question_icons}>
                                {/* 1 */}
                                <HiOutlineLightBulb
                                  size={45}
                                  className={styles.light_icon}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setshowModalRecommandation(false);
                                    setshowModalComment(!showModalComment);
                                  }}
                                />
                                {isCollapsed[idx][i] == false && showModalComment && (
                                  <ModalComment show={showModalComment} setshowModalComment={setshowModalComment}></ModalComment>
                                )}
                                {/* 2 */}
                                <AiOutlineBell
                                  size={40}
                                  className={styles.bell_icon}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setshowModalComment(false);
                                    setshowModalRecommandation(!showModalRecommandation);
                                  }}
                                />
                                {isCollapsed[idx][i] == false && showModalRecommandation && (
                                  <ModalRecommandation
                                    show={showModalRecommandation}
                                    setshowModalRecommandation={setshowModalRecommandation}
                                  ></ModalRecommandation>
                                )}
                                {/* <Modal show={showModalRecommandation}></Modal> */}
                                {/* 3 */}
                                {isCollapsed[idx][i] ? (
                                  <TfiAngleDown
                                    size={35}
                                    className={styles.down_icon}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handlePanelToggle(idx, i);
                                    }}
                                  />
                                ) : (
                                  <TfiAngleUp
                                    size={35}
                                    className={styles.down_icon}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handlePanelToggle(idx, i);
                                    }}
                                  />
                                )}
                              </span>
                            </div>
                          </Panel.Title>
                        </Panel.Heading>
                        {isCollapsed[idx][i] == false && (
                          <Panel.Body collapsible={isCollapsed && isCollapsed[idx][i]}>
                            <MainForm schemaId={q.madmp_schema_id}></MainForm>
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
      <Footer></Footer>
    </>
  );
}

export default Redaction;
