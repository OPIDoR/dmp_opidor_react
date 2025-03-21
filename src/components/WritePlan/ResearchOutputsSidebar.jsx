import React, { useContext, useState } from "react";
import styled from "styled-components";
import { MdAddCircleOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";
import chunk from "lodash.chunk";

import Accordion from "react-bootstrap/Accordion";

import { GlobalContext } from "../context/Global";
import ResearchOutputModal from "../ResearchOutput/ResearchOutputModal";
import ResearchOutputsTabs from "./ResearchOutputsTabs";
import { RESEARCH_OUTPUTS_PER_PAGE } from "../../config";
import * as styles from "../assets/css/sidebar.module.css";

const ResearchOutputsNavBar = styled.div`
  background-color: white;
  width: 220px;
  height: 100%;
  float: left;
  z-index: 0;
  margin-bottom: 0px;
  border-radius: 0px 0px 0px 0px;
  float: left;
  position: sticky;
  top: 100px;

  /* ###################NAVS#################### */
  .nav {
    margin: 4px 4px 0 0;
    display: flex;
    flex-direction: column;
    background-color: white;
    float: right;
  }

  .nav > .nav-item {
    flex: 1 1 15%;
    text-align: center;
    border: none;
    margin: 0;
  }

  /*adds border top to first nav box */

  .nav > .nav-item .nav-link {
    height: 65px;
    box-sizing: border-box;
    padding: 20px;
    font-weight: bold;
    background-color: var(--blue);
  }

  .nav > .nav-item:first-child > .nav-link {
    border-radius: 20px 0 0 0;
  }

  /*adds border to bottom nav boxes*/
  .nav > .nav-item {
    border-bottom: 3px var(--white) solid;
  }

  /* ******************* active ******************************* */
  .nav > .nav-item:first-child > .nav-link.active {
    background-color: #1c5170 !important;
  }

  .nav > .nav-item:not(:first-child):not(:last-child) > .nav-link.active {
    background-color: #1c5170 !important;
  }

  .nav > .nav-item:not(:first-child) > .nav-link.active {
    background-color: #1c5170 !important;
  }
  /* ************************************************** */

  /* *********************** hover *************************** */

  .nav > .nav-item:hover > .nav-link {
    background-color: #1c5170;
  }
  /* ************************************************** */
  .nav > .nav-item > .nav-link.active:hover {
    background-color: #1c5170 !important;
  }
  .nav > .nav-item > .nav-link {
    color: white;
  }

  /* ###################ACCORDIONS#################### */
  
  .accordion .accordion-body > .nav {
    float: none;
  }
  .accordion  .accordion-body > .nav > .nav-item > .nav-link {
    border-radius: 0;
  }

  .accordion .accordion-header {
    background-color: white;
  }

  .accordion .accordion-item {
    border: none;
  }

  .accordion .accordion-item:not(:last-child) {
    padding-bottom: 3px;
  }

  .accordion .accordion-item .accordion-header .accordion-button {
    background-color: var(--dark-blue);
    display: block;
    text-align: center;
    font-weight: bold;
    border-radius: 0;
  }

  .accordion .accordion-item:first-child .accordion-header .accordion-button {
    border-top-left-radius: 20px;
  }

  .accordion .accordion-item:last-child .accordion-header .accordion-button.collapsed {
    border-bottom-left-radius: 20px;
  }

  .accordion .accordion-item .accordion-header .accordion-button::after {
    display: none;
  }

  .accordion .accordion-body {
    padding: 5px 0 5px 5px;
  }
  
  /*give sidebar 100% width;*/
  li {
    width: 100%;
  }

  @media (min-width: 1330px) {
    /*Show all nav*/
    float: left;
  }
`;


function ResearchOutputsSidebar({ planId, readonly }) {
  const { t } = useTranslation();
  const {
    researchOutputs,
    openedQuestions,
  } = useContext(GlobalContext);
  const [show, setShow] = useState(false);
  const researchOutputsChunks = chunk(researchOutputs, RESEARCH_OUTPUTS_PER_PAGE);


  /**
   * The function handleClose sets the state of setShow to false.
   */
  const handleClose = () => setShow(false);

  /**
   * The function sets the state of "show" to true.
   */
  const handleShow = () => setShow(true);

  return (
    <>
      {researchOutputs && (
        <ResearchOutputsNavBar id="ro-nav-bar">
          {researchOutputs.length > RESEARCH_OUTPUTS_PER_PAGE && openedQuestions ? (
            <Accordion defaultActiveKey="chunk-1-5">
              {researchOutputsChunks.map((roChunk, i) => {
                const start = i * RESEARCH_OUTPUTS_PER_PAGE + 1;
                const end = i * RESEARCH_OUTPUTS_PER_PAGE + RESEARCH_OUTPUTS_PER_PAGE;
                return (
                  <Accordion.Item key={`chunk-${start}-${end}`} eventKey={`chunk-${start}-${end}`}>
                    <Accordion.Header>{start} - {end}</Accordion.Header>
                    <Accordion.Body>
                      <ResearchOutputsTabs researchOutputs={roChunk} readonly={readonly} />
                    </Accordion.Body>
                  </Accordion.Item>
                )
              })
              }
              {!readonly && (
                <button
                  className={styles.add_research_output_button}
                  onClick={(e) => {
                    e.preventDefault();
                    handleShow();
                  }}
                  style={{
                    padding: '10px 0',
                    boxSizing: 'border-box',
                    borderRadius: '20px 0 0 20px',
                    marginTop: '20px',
                  }}
                >
                  <div className={styles.nav_title}>
                    <MdAddCircleOutline size={18} style={{ marginRight: '5px' }} /> {t("Create")}
                  </div>
                </button>
              )}
            </Accordion>
          ) : (
            <ResearchOutputsTabs researchOutputs={researchOutputs} readonly={readonly}>
              <button
                className={styles.add_research_output_button}
                onClick={(e) => {
                  e.preventDefault();
                  handleShow();
                }}
                style={{
                  padding: '10px 0',
                  boxSizing: 'border-box',
                  borderRadius: '0 0 0 20px',
                }}
              >
                <div className={styles.nav_title}>
                  <MdAddCircleOutline size={18} style={{ marginRight: '5px' }} /> {t("Create")}
                </div>
              </button>
            </ResearchOutputsTabs>
          )}
        </ResearchOutputsNavBar>
      )}
      {show && <ResearchOutputModal planId={planId} handleClose={handleClose} show={show} edit={false} />}
    </>
  );
}

export default ResearchOutputsSidebar;
