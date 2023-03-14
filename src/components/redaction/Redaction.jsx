import React, { useEffect, useState } from "react";
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

import DOMPurify from "dompurify";
import Navbar from "../Shared/Navbar";

function Redaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(null);
  const [initialCollapse, setinitialCollapse] = useState(null);

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
    getQuestion("a", "token")
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
          <div style={{ margin: "15px" }}>
            <div className="row"></div>
            <div className="redaction_bloc">
              {data.map((el, idx) => (
                <React.Fragment key={idx}>
                  <p className="title">
                    {el.number}. {el.title}
                  </p>
                  <div className="column">
                    <div className="collapse_title">
                      <span className="sous_title" onClick={() => handleCollapseAll(idx)}>
                        Tout développer{" "}
                      </span>
                      <span className="sous_title"> | </span>
                      <span className="sous_title" onClick={() => setIsCollapsed(initialCollapse)}>
                        Tout réduire{" "}
                      </span>
                    </div>
                  </div>

                  {el.questions.map((q, i) => (
                    <PanelGroup accordion id="accordion-example" key={i}>
                      <Panel eventKey={i}>
                        <Panel.Heading>
                          <Panel.Title toggle onClick={() => handlePanelToggle(idx, i)}>
                            <div className="question_title">
                              <div className="question_text">
                                <div className="question_number">
                                  {el.number}.{q.number}
                                </div>
                                <div
                                  style={{ marginTop: "12px" }}
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize([q.text]),
                                  }}
                                />
                              </div>

                              <span className="question_icons">
                                {/* 1 */}
                                <HiOutlineLightBulb
                                  size={45}
                                  className="light_icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                  }}
                                />
                                {/* 2 */}
                                <AiOutlineBell
                                  size={40}
                                  className="bell_icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                  }}
                                />
                                {/* 3 */}
                                {isCollapsed[idx][i] ? (
                                  <TfiAngleDown
                                    size={35}
                                    className="down_icon"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handlePanelToggle(idx, i);
                                    }}
                                  />
                                ) : (
                                  <TfiAngleUp
                                    size={35}
                                    className="down_icon"
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
                            <MainForm SchemaId={q.madmp_schema_id}></MainForm>
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
