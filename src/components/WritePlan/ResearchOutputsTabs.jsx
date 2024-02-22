import React, { useContext, useState } from 'react';

import { Panel, PanelGroup } from 'react-bootstrap';
import { MdAddCircleOutline } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import chunk from 'lodash.chunk';
import ResearchOutputModal from '../ResearchOutput/ResearchOutputModal';
import ResearchOutputsNavBar from './styles/ResearchOutputsNavBar';
import { GlobalContext } from '../context/Global';
import styles from '../assets/css/sidebar.module.css';
import { RESEARCH_OUTPUTS_PER_PAGE } from '../../config';

function ResearchOutputsTabs({ planId, readonly }) {
  const { t } = useTranslation();
  const {
    displayedResearchOutput, setDisplayedResearchOutput,
    researchOutputs,
    openedQuestions,
    setFormData,
    setUrlParams,
  } = useContext(GlobalContext);
  const [show, setShow] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);
  const researchOutputsChunks = chunk(researchOutputs, RESEARCH_OUTPUTS_PER_PAGE);

  /**
   * The function handleClose sets the state of setShow to false.
   */
  const handleClose = () => setShow(false);

  /**
   * The function sets the state of "show" to true.
   */
  const handleShow = () => setShow(true);

  const handleSelect = (activeKey) => setActiveGroup(activeKey);

  // const handleIdsUpdate = (id, isNull) => {
  //   if (researchOutputs && researchOutputs[id] && Object.keys(researchOutputs[id]).length > 0) {
  //     setFormData(researchOutputs[id]);
  //   } else if (isNull) {
  //     setFormData(null);
  //   }
  // };

  const handleShowResearchOutputClick = (e, selectedResearchOutput) => {
    e.preventDefault();
    setDisplayedResearchOutput(selectedResearchOutput);
    setUrlParams({ research_output: selectedResearchOutput.id });
    // setHasPersonalData(element?.metadata?.hasPersonalData);
  };

  return (
    <>
      {researchOutputs && (
        <ResearchOutputsNavBar className="navbar-inverse" id="ro-nav-bar">
          <div className="collapse navbar-collapse">
            {researchOutputs.length > RESEARCH_OUTPUTS_PER_PAGE && openedQuestions ? (
              <PanelGroup
                activeKey={activeGroup}
                onSelect={handleSelect}
                accordion
                id="accordion"
                className={styles.research_outputs_accordion}
              >
                {researchOutputsChunks.map((roChunk, i) => {
                  const start = i * RESEARCH_OUTPUTS_PER_PAGE + 1;
                  const end = i * RESEARCH_OUTPUTS_PER_PAGE + RESEARCH_OUTPUTS_PER_PAGE;

                  return (
                    <Panel
                      key={i}
                      eventKey={i}
                      style={{ borderColor: 'white' }}
                    >
                      <Panel.Heading style={{ background: 'var(--dark-blue)' }}>
                        <Panel.Title
                          toggle
                          className={styles.nav_title}
                        >
                          {start}
                          {' '}
                          -
                          {end}
                        </Panel.Title>
                      </Panel.Heading>

                      <Panel.Body
                        collapsible
                        style={{ padding: '0px 0px 0px 0px' }}
                      >
                        <ul className={`nav navbar-nav ${styles.research_outputs_tabs}`}>
                          {roChunk.map((ro, idx) => (
                            <li
                              key={idx}
                              className={`${styles.research_outputs_tab} ${displayedResearchOutput.id === ro.id ? 'active' : ''}`}
                              onClick={(e) => handleShowResearchOutputClick(e, ro, idx)}
                            >
                              <a href="#">
                                <div className={styles.nav_title}>{ro.abbreviation}</div>
                                <div className={styles.nav_icon}>
                                  {/* <BsBell size={40} className={styles.space_right} style={{ color: "var(--rust)" }}></BsBell>
                                    <BsCheckCircleFill
                                      size={40}
                                      className={styles.space_right}
                                      style={{ color: "var(--rust)" }}
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
                    className={`${styles.research_outputs_tab} ${displayedResearchOutput.id === el.id ? 'active' : ''}`}
                    onClick={(e) => handleShowResearchOutputClick(e, el, idx)}
                  >
                    <a href="#" className={styles.nav_header}>
                      <div className={styles.nav_title}>{el.abbreviation}</div>
                      <div className={styles.nav_icon}>
                        {/* <BsBell size={40} className={styles.space_right} style={{ color: "var(--rust)" }}></BsBell>
                        <BsCheckCircleFill
                          size={40}
                          className={styles.space_right}
                          style={{ color: "var(--rust)" }}
                        ></BsCheckCircleFill> */}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {!readonly && (
              <button
                type="button"
                className={styles.add_research_output_button}
                onClick={(e) => {
                  e.preventDefault();
                  handleShow();
                }}
                style={{
                  padding: '10px 0 10px 0',
                  boxSizing: 'border-box',
                  borderRadius: researchOutputsChunks.length > 1 ? '20px 0 0 20px' : '0 0 0 20px',
                  marginRight: researchOutputsChunks.length > 1 ? '1px' : undefined,
                  width: researchOutputsChunks.length <= 1 ? '182.87px' : '100%',
                }}
              >
                <div
                  className={styles.nav_title}
                  style={{
                    textAlign: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-arround',
                  }}
                >
                  <MdAddCircleOutline size={18} style={{ marginRight: '5px' }} />
                  {' '}
                  {t('Create')}
                </div>
              </button>
            )}
          </div>
        </ResearchOutputsNavBar>
      )}
      {show && (
        <ResearchOutputModal
          planId={planId}
          handleClose={handleClose}
          show={show}
          edit={false}
        />
      )}
    </>
  );
}

export default ResearchOutputsTabs;
