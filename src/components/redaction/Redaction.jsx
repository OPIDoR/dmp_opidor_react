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
import { AiOutlineDown } from "react-icons/ai";
import DOMPurify from "dompurify";

function Redaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleCollapseAll = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    //DataStorageStandard
    //ProjectStandard
    setLoading(true);
    getQuestion("a", "token")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <Header></Header>
      <Banner></Banner>
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
                      <span className="sous_title" onClick={handleCollapseAll}>
                        Tout développer{" "}
                      </span>
                      <span className="sous_title"> | </span>
                      <span className="sous_title" onClick={handleCollapseAll}>
                        Tout réduire{" "}
                      </span>
                    </div>
                  </div>

                  {el.questions.map((q, i) => (
                    <PanelGroup accordion id="accordion-example" key={i}>
                      <Panel eventKey={i}>
                        <Panel.Heading>
                          <Panel.Title toggle>
                            <div className="question_title">
                              <div className="question_text">
                                <div className="question_number">
                                  {el.number}.{q.number}
                                </div>
                                <div style={{ marginTop: "12px" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize([q.text]) }} />
                              </div>

                              <span className="question_icons">
                                <HiOutlineLightBulb size={45} className="light_icon" />
                                <AiOutlineBell size={40} className="bell_icon" />
                                <AiOutlineDown size={35} className="down_icon" />
                              </span>
                            </div>
                          </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body collapsible={isCollapsed}>
                          <MainForm SchemaId={q.madmp_schema_id}></MainForm>
                        </Panel.Body>
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
