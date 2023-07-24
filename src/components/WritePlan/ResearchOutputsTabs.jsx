import React, { useContext, useState } from "react";

import { GlobalContext } from "../context/Global";
import ResearchOutputsNavBar from "./styles/ResearchOutputsNavBar";
import { Panel, PanelGroup } from "react-bootstrap";
import styles from "../assets/css/sidebar.module.css";
import { MdAddCircleOutline } from "react-icons/md";
import { BsBell, BsCheckCircleFill } from "react-icons/bs";
import ResearchOutputModal from "../ResearchOutput/ResearchOutputModal";
import { useTranslation } from "react-i18next";
import { chunk } from "lodash";

function ResearchOutputsTabs({ planId, readonly }) {
  const { t } = useTranslation();
  const {
    displayedResearchOutput, setDisplayedResearchOutput,
    researchOutputs,
    openedQuestions,
    setFormData,
  } = useContext(GlobalContext);
  const itemsPerPage = 5;
  const [show, setShow] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);
  const researchOutputsChunks = chunk(researchOutputs, itemsPerPage);

  /**
   * The function handleClose sets the state of setShow to false.
   */
  const handleClose = () => setShow(false);
  /**
   * The function sets the state of "show" to true.
   */
  const handleShow = () => setShow(true);

  const handleSelect = (activeKey) => setActiveGroup(activeKey);

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
      {researchOutputs && (
        <ResearchOutputsNavBar className="navbar-inverse">
          <div className="collapse navbar-collapse">
            {researchOutputs.length > itemsPerPage && openedQuestions ? (
              <PanelGroup 
              activeKey={activeGroup}
              onSelect={handleSelect}
              accordion 
              id="accordion" className={styles.research_outputs_accordion}
              >
                {researchOutputsChunks.map((roChunk, i) => {
                  const start = i * itemsPerPage + 1;
                  const end = i * itemsPerPage + itemsPerPage;

                  return (
                    <Panel 
                      key={i}
                      eventKey={i}
                      style={{ borderColor: "white" }}
                    >
                      <Panel.Heading style={{ background: "var(--primary)" }}>
                        <Panel.Title
                          toggle
                          className={styles.nav_title}
                        >
                          {start} - {end}
                        </Panel.Title>
                      </Panel.Heading>

                      <Panel.Body
                        collapsible={true}
                        style={{ padding: "0px 0px 0px 0px" }}
                      >
                        <ul className={`nav navbar-nav ${styles.research_outputs_tabs}`}>
                          {roChunk.map((ro, idx) => (
                            <li
                              key={idx}
                              className={`${styles.research_outputs_tab} ${displayedResearchOutput.id === ro.id ? "active" : ""}`}
                              onClick={(e) => handleShowResearchOutputClick(e, ro, idx)}
                            >
                              <a href="#">
                                <div className={styles.nav_title}>{ro.abbreviation}</div>
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
            {!readonly && (
              <button className={styles.add_research_output_button}
                onClick={(e) => {
                  e.preventDefault();
                  handleShow();
                }}
              >
                <div className={styles.nav_title}>{t("Create")}</div>
                <div className={styles.nav_icon}>
                  <MdAddCircleOutline size={40}></MdAddCircleOutline>
                </div>
              </button>
            )}
          </div>
        </ResearchOutputsNavBar>
      )}
      {show && <ResearchOutputModal planId={planId} handleClose={handleClose} show={show}></ResearchOutputModal>}
    </>
  );
}

export default ResearchOutputsTabs;
