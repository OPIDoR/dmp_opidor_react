import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Panel, Tabs, Tab } from 'react-bootstrap';

import SectionsContent from "./SectionsContent";
import { writePlan } from "../../services";
import CustomSpinner from "../Shared/CustomSpinner";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import GuidanceChoice from "./GuidanceChoice";
import ResearchOutputsTabs from "./ResearchOutputsTabs";
import * as styles from "../assets/css/sidebar.module.css";
import AddResearchOutput from "../ResearchOutput/AddResearchOutput";
import ImportResearchOutput from "../ResearchOutput/ImportResearchOutput";
import PlanInformations from "./PlanInformations";
import * as modalStyles from "../assets/css/modal.module.css";

function WritePlan({
  locale = 'en_GB',
  planId,
  templateId,
  userId,
  readonly,
  currentOrgId,
  currentOrgName,
  configuration,
}) {
  const { t, i18n } = useTranslation();
  const {
    setFormData,
    setDmpId,
    setCurrentOrg,
    setUserId,
    setLocale,
    setDisplayedResearchOutput,
    setLoadedSectionsData,
    researchOutputs, setResearchOutputs,
    setQuestionsWithGuidance,
    setConfiguration,
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    i18n.changeLanguage(locale.substring(0, 2));
  }, [locale])

  useEffect(() => {
    setConfiguration(configuration);
  }, [configuration])

  /* A hook that is called when the component is mounted. It is used to fetch data from the API. */
  //TODO update this , it can make error
  useEffect(() => {
    setLoading(true);

    const queryParameters = new URLSearchParams(window.location.search);
    const researchOutputId = queryParameters.get('research_output');

    setCurrentOrg({ id: currentOrgId, name: currentOrgName });
    setUserId(userId);
    setLocale(locale);

    writePlan.getPlanData(planId)
      .then((res) => {
        setDmpId(res.data.dmp_id);

        const { research_outputs } = res.data;

        if (research_outputs.length > 0) {
          let currentResearchOutput = research_outputs[0];
          if (researchOutputId) {
            const researchOutput = research_outputs
              .find(({ id }) => id === Number.parseInt(researchOutputId, 10));
            if (researchOutput) {
              currentResearchOutput = researchOutput;
            }
          }

          setDisplayedResearchOutput(currentResearchOutput);
          setLoadedSectionsData({ [currentResearchOutput.template.id]: currentResearchOutput.template });
          setQuestionsWithGuidance(currentResearchOutput.questions_with_guidance || []);
          researchOutputs.length === 0 && setResearchOutputs(research_outputs);
        }
        setFormData(null);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));

    window.addEventListener("scroll", (e) => handleScroll(e));
  }, [planId]);

  const handleScroll = () => {
    const roNavBar = document.querySelector('#ro-nav-bar');
    const { bottom: bottomRoNavBar, top: topRoNavBar } = roNavBar?.getBoundingClientRect() || 0;

    const sectionContent = document.querySelector('#sections-content');
    const { bottom: bottomSectionContent, top: topSectionContent } = sectionContent?.getBoundingClientRect() || 0;
    if (!sectionContent) return;

    if (bottomRoNavBar >= bottomSectionContent) {
      sectionContent.style.borderBottomLeftRadius = '0';
    } else {
      sectionContent.style.borderBottomLeftRadius = '8px';
    }

    if (topRoNavBar <= topSectionContent) {
      sectionContent.style.borderTopLeftRadius = '0';
    } else {
      sectionContent.style.borderTopLeftRadius = '8px';
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {loading && <CustomSpinner isOverlay={true}></CustomSpinner>}
      {error && <CustomError error={error}></CustomError>}
      {!error && researchOutputs.length > 0 && (
        <>
          <div style={{ margin: '10px 30px 10px 30px' }}>
            <GuidanceChoice planId={planId} style={{ flexGrow: 1 }} />
          </div>
          <PlanInformations />
          <div className={styles.section}>
            <ResearchOutputsTabs planId={planId} readonly={readonly} />
            <div className={styles.main}>
              {planId && (
                <SectionsContent
                  planId={planId}
                  templateId={templateId}
                  readonly={readonly}
                />
              )}
            </div>
          </div>
        </>
      )}
      {!loading && !error && researchOutputs.length === 0 && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Panel style={{ width: '700px' }}>
            <Panel.Body>
              <h2 style={{ textAlign: 'center' }}>{t('Your plan does not yet include any research output')}</h2>
              <div style={{ justifyContent: 'center', alignItems: 'center', left: 0 }}>
                <Tabs className={`mb-3 ${modalStyles.modal_tabs}`} defaultActiveKey={"create"} id="create-edit-research-output-tabs">
                  <Tab eventKey={"create"} title={t("Create")}>
                    <AddResearchOutput planId={planId} handleClose={() => {}} close={false} show={true} inEdition={false} />
                  </Tab>
                  {configuration.enableImportResearchOutput && (<Tab eventKey="import" title={t("Import")}>
                    <ImportResearchOutput planId={planId} handleClose={() => { }} close={false} show={true} />
                  </Tab>)}
                </Tabs>
              </div>
            </Panel.Body>
          </Panel>
        </div>
      )}
    </div>
  );
}

export default WritePlan;
