import React, { useEffect, useState, useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Panel } from 'react-bootstrap';

import SectionsContent from "../Shared/SectionsContent/SectionsContent";
import CustomSpinner from "../Shared/CustomSpinner";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import GuidanceChoice from "./GuidanceChoice";
import ResearchOutputsTabs from "./ResearchOutputsTabs";
import * as styles from "../assets/css/sidebar.module.css";
import ResearchOutput from "../ResearchOutput/ResearchOutput";
import AddResearchOutput from "../ResearchOutput/AddResearchOutput";
import { TemplateProvider } from "../context/TemplateContext";
import useTemplate from "../../hooks/useTemplate";
import PlanInformations from "./PlanInformations";
import { useTour } from "../Shared/Joyride/JoyrideContext";

function WritePlan({
  locale = 'en_GB',
  planId,
  templateId,
  userId,
  readonly,
  currentOrgId,
  currentOrgName,
}) {
  // --- STATE ---
  const { t, i18n } = useTranslation();
  const {
    setFormData,
    setDmpId,
    setCurrentOrg,
    setUserId,
    setLocale,
    displayedResearchOutput, setDisplayedResearchOutput,
    setLoadedSectionsData,
    researchOutputs, setResearchOutputs,
    setQuestionsWithGuidance,
    planInformations,
    setOpenedQuestions,
    setPlanInformations,
  } = useContext(GlobalContext);

  const { getPlanData } = useTemplate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setIsOpen } = useTour();

  const updatePlanAfterFetchTreatment = (res, openedQuestions, displayedResearchOutput) => {
    setPlanInformations({
      locale: res?.data?.locale.split('-')?.at(0) || 'fr',
      title: res?.data?.title,
      version: res?.data?.version,
      org: res?.data?.org,
      publishedDate: res?.data?.publishedDate,
    });
  
    if (openedQuestions && openedQuestions[displayedResearchOutput.id]) return;
  
    const updatedCollapseState = {
      ...openedQuestions,
      [displayedResearchOutput.id]: {},
    };
    setOpenedQuestions(updatedCollapseState);
    return res;
  }

  // --- BEHAVIOURS ---
  const handleWebsocketData = useCallback((data) => {
    if(data.target === 'research_output_infobox' && displayedResearchOutput.id === data.research_output_id) {
      setDisplayedResearchOutput({ ...displayedResearchOutput, ...data.payload })
    }
    if(data.target === 'dynamic_form') {
      setFormData({ [data.fragment_id]: data.payload })
    }
  }, [displayedResearchOutput, setDisplayedResearchOutput, setFormData])

  useEffect(() => {
    i18n.changeLanguage(locale.substring(0, 2));
  }, [locale])

  /* A hook that is called when the component is mounted. It is used to fetch data from the API. */
  //TODO update this , it can make error
  useEffect(() => {
    fetchPlanData();
  }, [planId]);

  async function fetchPlanData() {
    setLoading(true);

    const queryParameters = new URLSearchParams(window.location.search);
    const researchOutputId = queryParameters.get('research_output');

    setCurrentOrg({ id: currentOrgId, name: currentOrgName });
    setUserId(userId);
    setLocale(locale);

    getPlanData(planId)
      .then((res) => {
        setDmpId(res.data.dmp_id);

    const { research_outputs, questions_with_guidance } = res.data;

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
          // setLoadedSectionsData({ [currentResearchOutput.template.id]: currentResearchOutput.template })
          researchOutputs.length === 0 && setResearchOutputs(research_outputs);
        }
        setQuestionsWithGuidance(questions_with_guidance || []);
        setFormData(null);
      })
      .catch((error) => {
        setError(error)
        console.error(error)
      })
      .finally(() => setLoading(false));

    window.addEventListener("scroll", (e) => handleScroll(e));
  };

  const handleScroll = () => {
    const roNavBar = document.querySelector('#ro-nav-bar');
    const { bottom: bottomRoNavBar, top: topRoNavBar } = roNavBar?.getBoundingClientRect() || 0;

    const sectionContent = document.querySelector('#sections-content');
    const { bottom: bottomSectionContent, top: topSectionContent } = sectionContent?.getBoundingClientRect() || 0;
    if (!sectionContent) return;

    sectionContent.style.borderBottomLeftRadius = 
      bottomRoNavBar >= bottomSectionContent ? '0' : '8px';

    sectionContent.style.borderTopLeftRadius = 
      topRoNavBar <= topSectionContent ? '0' : '8px';
  }

  // --- RENDER ---
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
                <TemplateProvider>
                  <SectionsContent templateId={templateId} readonly={readonly} afterFetchTreatment={updatePlanAfterFetchTreatment}>
                    <ResearchOutput planId={planId} readonly={readonly} researchOutputs={researchOutputs}/>
                  </SectionsContent>
                </TemplateProvider>
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
                <AddResearchOutput planId={planId} handleClose={() => { }} close={false} show={true} edit={false} />
              </div>
            </Panel.Body>
          </Panel>
        </div>
      )}
    </div>
  );
}

export default WritePlan;
