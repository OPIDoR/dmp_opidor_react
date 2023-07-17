import React, { useContext, useState } from "react";

import { GlobalContext } from "../context/Global";
import ResearchOutputsNavBar from "./styles/ResearchOutputsNavBar";
import { Panel, PanelGroup } from "react-bootstrap";
import styles from "../assets/css/sidebar.module.css";
import { BsBell, BsCheckCircleFill } from "react-icons/bs";
import ResearchOutputModal from "../ResearchOutput/ResearchOutputModal";

function ResearchOutputsTabs({ planId }) {
  const {
    displayedResearchOutput, setDisplayedResearchOutput,
    researchOutputs,
    openedQuestions, setOpenedQuestions,
    setFormData,
  } = useContext(GlobalContext);
  const itemsPerPage = 5;
  const [show, setShow] = useState(false);

  /**
   * The function handleClose sets the state of setShow to false.
   */
  const handleClose = () => setShow(false);
  /**
   * The function sets the state of "show" to true.
   */
  const handleShow = () => setShow(true);

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

  /**
   * When the user clicks on a tab, the function sets the active index to the index of the tab that was clicked, and sets the research id to the id of the
   * tab that was clicked.
   */
  const handleShowResearchOutputClick = (e, selectedResearchOutput, index) => {
    e.preventDefault();
    // handleIdsUpdate(selectedResearchOutput.id, true);
    setDisplayedResearchOutput(selectedResearchOutput);
    // setHasPersonalData(element?.metadata?.hasPersonalData);
  };

  return (
    <>
      {researchOutputs && researchOutputs.length > 1 && (
        <ResearchOutputsNavBar className="navbar-inverse">
          <div className="collapse navbar-collapse">
            {researchOutputs.length > itemsPerPage && openedQuestions ? (
              <PanelGroup accordion id="accordion" className={styles.research_outputs_accordion}>
                {Array.from({ length: Math.ceil(researchOutputs.length / itemsPerPage) }, (_, index) => index + 1).map((page, i) => {
                  const start = (page - 1) * itemsPerPage;
                  const end = start + itemsPerPage;
                  const pageItems = researchOutputs.slice(start, end);

                  return (
                    <Panel key={i} eventKey={i} style={{ borderColor: "white" }}>
                      <Panel.Heading style={{ background: "var(--primary)" }}>
                        <Panel.Title
                          toggle
                          className={styles.nav_title}
                        //onClick={(e) => {
                        //  e.preventDefault();
                        //  e.stopPropagation();
                        //  handleCollapseByIndex(i);
                        //}}
                        >
                          {start + 1} - {Math.min(end, researchOutputs.length)}
                        </Panel.Title>
                      </Panel.Heading>

                      <Panel.Body
                        collapsible={true}
                        style={{ padding: "0px 0px 0px 0px" }}
                      >
                        <ul className={`nav navbar-nav ${styles.research_outputs_tabs}`}>
                          {pageItems.map((el, idx) => (
                            <li
                              key={idx}
                              className={`${styles.research_outputs_tab} ${displayedResearchOutput.id === el.id ? "active" : ""}`}
                              onClick={(e) => handleShowResearchOutputClick(e, el, idx)}
                            >
                              <a href="#">
                                <div className={styles.nav_title}>{el.abbreviation}</div>
                                <div className={styles.nav_icon}>
                                  {/* <BsBell size={40} className={styles.space_right} style={{ color: "var(--orange)" }}></BsBell>
                                    <BsCheckCircleFill
                                      size={40}
                                      className={styles.space_right}
                                      style={{ color: "var(--orange)" }}
                                    ></BsCheckCircleFill> */}
                                </div>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </Panel.Body>
                    </Panel>
                  );
                })}
              </PanelGroup>
            ) : (
              <ul className={`nav navbar-nav ${styles.research_outputs_tabs}`}>
                {researchOutputs.map((el, idx) => (
                  <li
                    key={idx}
                    className={`${styles.research_outputs_tab} ${displayedResearchOutput.id === el.id ? "active" : ""}`}
                    onClick={(e) => handleShowResearchOutputClick(e, el, idx)}
                  >
                    <a href="#" className={styles.nav_header}>
                      <div className={styles.nav_title}>{el.abbreviation}</div>
                      <div className={styles.nav_icon}>
                        {/* <BsBell size={40} className={styles.space_right} style={{ color: "var(--orange)" }}></BsBell>
                        <BsCheckCircleFill
                          size={40}
                          className={styles.space_right}
                          style={{ color: "var(--orange)" }}
                        ></BsCheckCircleFill> */}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
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
          </div>
        </ResearchOutputsNavBar>
      )}
      {show && <ResearchOutputModal planId={planId} handleClose={handleClose} show={show}></ResearchOutputModal>}
    </>
  );
}

export default ResearchOutputsTabs;
