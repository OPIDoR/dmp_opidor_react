import React, { useEffect, useState } from "react";
import Banner from "../Shared/Banner";
import Footer from "../Shared/Footer";
import Header from "../Shared/Header";
import Navbar from "../Shared/Navbar";
import SectionsContent from "./SectionsContent";
import { BsBell } from "react-icons/bs";
import { BsBellFill } from "react-icons/bs";
import { BsCircle } from "react-icons/bs";
import { MdAddCircleOutline } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { getQuestion } from "../../services/DmpRedactionApi";
import CustomSpinner from "../Shared/CustomSpinner";
import styles from "../assets/css/sidebar.module.css";
import StyledNavBar from "./styles/StyledNavBar";
import { useContext } from "react";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import ResearchOutputModal from "../ResearchOutput/ResearchOutputModal";
import { Panel, PanelGroup } from "react-bootstrap";
import { createDynamicObject, roundedUpDivision } from "../../utils/GeneratorUtils";
import { useTranslation } from "react-i18next";
import Recommandation from "./Recommandation";

function WritePlan({ readonly }) {
  const { t } = useTranslation();
  const { setForm, researchOutputs, setDisplayedResearchOutputId, researchOutputsData, setResearchOutputsData } = useContext(GlobalContext);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [researchOutputId, setResearchOutputId] = useState(null);
  const [planId, setPlanId] = useState(null);
  const itemsPerPage = 6;
  const [renderKey, setRenderKey] = useState(0);
  const [show, setShow] = useState(false);
  const [hasPersonalData, setHasPersonalData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(null);
  const [triggerRender, setTriggerRender] = useState(0);

  /**
   * The function handleClose sets the state of setShow to false.
   */
  const handleClose = () => setShow(false);
  /**
   * The function sets the state of "show" to true.
   */
  const handleShow = () => setShow(true);

  /**
   * When the user clicks on a tab, the function sets the active index to the index of the tab that was clicked, and sets the research id to the id of the
   * tab that was clicked.
   */
  const handleShowResearchOutputClick = (e, element, index) => {
    e.preventDefault();
    setRenderKey((prevKey) => prevKey + 1);
    handleIdsUpdate(element.id, true);
    setActiveIndex(element.id);
    setHasPersonalData(element?.metadata?.hasPersonalData);
  };

  /**
   * This function updates the displayed research output ID, product ID, and form based on the provided ID and whether or not it is null.
   */
  const handleIdsUpdate = (id, isNull) => {
    // exist and not empty
    if (researchOutputs && researchOutputs[id] && Object.keys(researchOutputs[id]).length > 0) {
      setForm(researchOutputs[id]);
    } else {
      isNull && setForm(null);
    }
    setResearchOutputId(id);
    setDisplayedResearchOutputId(id);
  };

  /* A hook that is called when the component is mounted. It is used to fetch data from the API. */
  //TODO update this , it can make error
  useEffect(() => {
    setActiveIndex(0);
    setLoading(true);
    getQuestion("token")
      .then((res) => {
        const result = res.data.plan.research_outputs;
        const resultId = result[0].id;
        setActiveIndex(result[0].id);
        setPlanId(res.data.plan.id);
        setHasPersonalData(result[0]?.metadata?.hasPersonalData);
        !researchOutputsData && setResearchOutputsData(result);
        handleIdsUpdate(resultId, false);
        if (result.length > itemsPerPage) {
          let resultDivision = roundedUpDivision(result.length, itemsPerPage);
          setIsCollapsed(createDynamicObject(resultDivision));
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [researchOutputsData]);

  /**
   * This function toggles the state of an element in an array based on its index.
   */
  const handleCollapseByIndex = (index) => {
    setIsCollapsed((prevIsCollapsed) => {
      const newIsCollapsed = [...prevIsCollapsed];
      newIsCollapsed[index] = !newIsCollapsed[index];
      return newIsCollapsed;
    });
  };

  return (
    <>
      <Header></Header>
      <Banner></Banner>
      <Navbar></Navbar>
      {loading && <CustomSpinner></CustomSpinner>}
      {!loading && error && <CustomError></CustomError>}
      {!loading && !error && researchOutputsData && (
        <>
          <ResearchOutputModal planId={planId}></ResearchOutputModal>
          {!readonly && (
            <div className="container">
              <Recommandation planId={planId} setTriggerRender={setTriggerRender} />
            </div>
          )}

          <div className={styles.section}>
            <StyledNavBar className="navbar-inverse">
              <div className="">
                <div className="collapse navbar-collapse" id="bs-sidebar-navbar-collapse-1">
                  <ul className="nav navbar-nav" style={{ width: "100%", margin: "0px" }}>
                    {researchOutputsData && (
                      <>
                        {researchOutputsData.length > itemsPerPage && isCollapsed ? (
                          <>
                            {Array.from({ length: Math.ceil(researchOutputsData.length / itemsPerPage) }, (_, index) => index + 1).map((page, i) => {
                              const start = (page - 1) * itemsPerPage;
                              const end = start + itemsPerPage;
                              const pageItems = researchOutputsData.slice(start, end);

                              return (
                                <PanelGroup accordion id="accordion-example" key={i}>
                                  <Panel eventKey={i} style={{ borderWidth: "2px", borderColor: "var(--primary)" }}>
                                    <Panel.Heading style={{ background: "rgb(128, 177, 205)" }}>
                                      <Panel.Title
                                        toggle
                                        className={styles.nav_title}
                                        style={{ display: "flex", justifyContent: "center", color: "white" }}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleCollapseByIndex(i);
                                        }}
                                      >
                                        {start + 1} - {Math.min(end, researchOutputsData.length)}
                                      </Panel.Title>
                                    </Panel.Heading>

                                    <Panel.Body
                                      collapsible={isCollapsed && isCollapsed?.[i]}
                                      style={{ background: "var(--secondary)", padding: "0px 0px 0px 0px" }}
                                    >
                                      <ul className="nav navbar-nav" style={{ width: "100%" }}>
                                        {pageItems.map((el, idx) => (
                                          <li
                                            key={idx}
                                            className={activeIndex === el.id ? "active" : ""}
                                            onClick={(e) => handleShowResearchOutputClick(e, el, idx)}
                                          >
                                            <a href="#" className={styles.nav_header}>
                                              <div className={styles.nav_title}>{el.abbreviation}</div>
                                              <div className={styles.nav_icon}>
                                                <BsBell size={40} className={styles.space_right} style={{ color: "var(--orange)" }}></BsBell>
                                                <BsCheckCircleFill
                                                  size={40}
                                                  className={styles.space_right}
                                                  style={{ color: "var(--orange)" }}
                                                ></BsCheckCircleFill>
                                              </div>
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </Panel.Body>
                                  </Panel>
                                </PanelGroup>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            {researchOutputsData.map((el, idx) => (
                              <li
                                key={idx}
                                className={activeIndex == el.id ? "active" : ""}
                                onClick={(e) => handleShowResearchOutputClick(e, el, idx)}
                              >
                                <a href="#" className={styles.nav_header}>
                                  <div className={styles.nav_title}>{el.abbreviation}</div>
                                  <div className={styles.nav_icon}>
                                    <BsBell size={40} className={styles.space_right} style={{ color: "var(--orange)" }}></BsBell>
                                    <BsCheckCircleFill
                                      size={40}
                                      className={styles.space_right}
                                      style={{ color: "var(--orange)" }}
                                    ></BsCheckCircleFill>
                                  </div>
                                </a>
                              </li>
                            ))}
                          </>
                        )}
                      </>
                    )}
                    {!readonly && (
                      <li onClick={handleShow}>
                        <a
                          href="#"
                          className={styles.nav_header}
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <div className={styles.nav_title}>{t("Create")}</div>
                          <div className={styles.nav_icon}>
                            <MdAddCircleOutline size={40}></MdAddCircleOutline>
                          </div>
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </StyledNavBar>
            {show && <ResearchOutputModal planId={planId} handleClose={handleClose} show={show}></ResearchOutputModal>}
            <div className={styles.main}>
              {researchOutputId && planId && (
                <SectionsContent
                  readonly={readonly}
                  key={renderKey + triggerRender}
                  researchOutputId={researchOutputId}
                  planId={planId}
                  hasPersonalData={hasPersonalData}
                ></SectionsContent>
              )}
            </div>
          </div>
        </>
      )}
      <Footer></Footer>
    </>
  );
}

export default WritePlan;
