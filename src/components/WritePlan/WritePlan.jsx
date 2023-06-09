import React, { useEffect, useState, useContext } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { Panel, PanelGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import SectionsContent from "./SectionsContent";
import { BsBell } from "react-icons/bs";
import { getPlanData } from "../../services/DmpWritePlanApi";
import CustomSpinner from "../Shared/CustomSpinner";
import StyledNavBar from "./styles/StyledNavBar";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import ResearchOutputModal from "../ResearchOutput/ResearchOutputModal";
import { createDynamicObject, roundedUpDivision } from "../../utils/GeneratorUtils";
import Recommandation from "./Recommandation";
import styles from "../assets/css/sidebar.module.css";

function WritePlan({
  locale = 'en_GB',
  planId,
  templateId,
  readonly,
}) {
  const { t, i18n } = useTranslation();
  const {
    setLocale, 
    setFormData,
    setPlanData,
    setDmpId,
    researchOutputs,
    displayedResearchOutput,
    setDisplayedResearchOutput,
    researchOutputsData, setResearchOutputsData,
    openedQuestions, setOpenedQuestions,
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;
  const [renderKey, setRenderKey] = useState(0);
  const [show, setShow] = useState(false);
  const [hasPersonalData, setHasPersonalData] = useState(null);
  const [triggerRender, setTriggerRender] = useState(0);

  useEffect(() => {
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));
  }, [locale])

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
    setHasPersonalData(element?.metadata?.hasPersonalData);
  };

  /**
   * This function updates the displayed research output ID, product ID, and form based on the provided ID and whether or not it is null.
   */
  const handleIdsUpdate = (id, isNull) => {
    // exist and not empty
    if (researchOutputs && researchOutputs[id] && Object.keys(researchOutputs[id]).length > 0) {
      setFormData(researchOutputs[id]);
    } else {
      isNull && setFormData(null);
    }
  };

  /* A hook that is called when the component is mounted. It is used to fetch data from the API. */
  //TODO update this , it can make error
  useEffect(() => {
    setLoading(true);
    getPlanData(planId)
      .then((res) => {
        setPlanData(res.data);
        setDmpId(res.data.dmp_id);
        const researchOutputs = res.data.research_outputs;
        setDisplayedResearchOutput(researchOutputs[0]);
        // setHasPersonalData(researchOutputs[0].id;?.metadata?.hasPersonalData);
        !researchOutputsData && setResearchOutputsData(researchOutputs);
        handleIdsUpdate(researchOutputs[0].id, false);
        // if (result.length > itemsPerPage) {
        //   let resultDivision = roundedUpDivision(result.length, itemsPerPage);
        //   setOpenedQuestions(createDynamicObject(resultDivision));
        // }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [researchOutputsData]);

  /**
   * This function toggles the state of an element in an array based on its index.
   */
  const handleCollapseByIndex = (index) => {
    setOpenedQuestions((prevOpenedQuestions) => {
      const newOpenedQuestions = [...prevOpenedQuestions];
      newOpenedQuestions[index] = !newOpenedQuestions[index];
      return newOpenedQuestions;
    });
  };

  return (
    <>
          {/*
          {!readonly && (<div className="container">
            <Recommandation planId={planId} setTriggerRender={setTriggerRender} />
      </div>)}*/}
      <div className={styles.section}>
        {loading && <CustomSpinner></CustomSpinner>}
        {!loading && error && <CustomError error={error}></CustomError>}
        {!loading && !error && researchOutputsData && (
          <>
            {researchOutputsData && researchOutputsData.length > 1 && (
              <StyledNavBar className="navbar-inverse">
                <div className="">
                  <div className="collapse navbar-collapse" id="bs-sidebar-navbar-collapse-1">
                    <ul className="nav navbar-nav" style={{ width: "100%", margin: "0px" }}>
                        <>
                          {researchOutputsData.length > itemsPerPage && openedQuestions ? (
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
                                        collapsible={openedQuestions && openedQuestions?.[i]}
                                        style={{ background: "var(--secondary)", padding: "0px 0px 0px 0px" }}
                                      >
                                        <ul className="nav navbar-nav" style={{ width: "100%" }}>
                                          {pageItems.map((el, idx) => (
                                            <li
                                              key={idx}
                                              className={displayedResearchOutput.id === el.id ? "active" : ""}
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
                                  className={displayedResearchOutput.id == el.id ? "active" : ""}
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
                      {/*
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
                        )}*/}
                    </ul>
                  </div>
                </div>
              </StyledNavBar>
            )}
            {show && <ResearchOutputModal planId={planId} handleClose={handleClose} show={show}></ResearchOutputModal>}
            <div className={styles.main}>
              {planId && (
                <SectionsContent
                  key={renderKey + triggerRender}
                  planId={planId}
                  templateId={templateId}
                  hasPersonalData={hasPersonalData}
                  readonly={readonly}
                ></SectionsContent>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default WritePlan;
