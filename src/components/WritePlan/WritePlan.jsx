import React, { useEffect, useState, useContext } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Panel } from 'react-bootstrap';
import uniqueId from 'lodash.uniqueid';

import SectionsContent from "./SectionsContent";
import { writePlan } from "../../services";
import CustomSpinner from "../Shared/CustomSpinner";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import GuidanceChoice from "./GuidanceChoice";
import ResearchOutputsTabs from "./ResearchOutputsTabs";
import * as styles from "../assets/css/sidebar.module.css";
import PlanInformations from "./PlanInformations";
import ResearchOutputForm from "../ResearchOutput/ResearchOutputForm";
import TooltipInfoIcon from '../FormComponents/TooltipInfoIcon';

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
  const tooltipedLabelId = uniqueId('create_research_output_tooltip_id_');

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

    loadData(planId, researchOutputId);

    window.addEventListener("scroll", (e) => handleScroll(e));

    return () => {
      window.removeEventListener("scroll", (e) => handleScroll(e));
    };
  }, [planId, researchOutputs]);

  const loadData = (planId, researchOutputId) => {
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
  }

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
      {!readonly &&
        <div style={{ margin: '10px 30px 10px 30px' }}>
          <GuidanceChoice planId={planId} currentOrgId={currentOrgId} currentOrgName={currentOrgName} style={{ flexGrow: 1 }} />
        </div>
      }
      {!error && researchOutputs.length > 0 && (
        <>
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
          <Panel style={{ width: '1024px' }}>
            <Panel.Body>
              {readonly ?
                <h2 style={{ textAlign: 'center' }}>{t('Your plan does not yet include any research output')}</h2>
                : <h2 style={{ textAlign: 'center' }} data-tooltip-id={tooltipedLabelId}>
                  <Trans
                    t={t}
                    defaults="Add a <0>research output</0> to display plan questions."
                    components={[<strong>research output</strong>]}
                  />
                  <TooltipInfoIcon />
                  <ReactTooltip
                    id={tooltipedLabelId}
                    place="bottom"
                    effect="solid"
                    variant="info"
                    content={<Trans
                      t={t}
                      defaults="<0>Research output</0> covers any type of research data produced in the course of a scientific research project or activity: dataset, software and code, workflow, protocol, physical object..."
                      components={[<strong>Research output</strong>]}
                    />}
                  />
                </h2>
              }

              {!readonly &&
                <div style={{ justifyContent: 'center', alignItems: 'center', left: 0 }}>
                  <ResearchOutputForm planId={planId} handleClose={() => { }} edit={false} />
                </div>
              }
            </Panel.Body>
          </Panel>
        </div>
      )}
    </div>
  );
}

export default WritePlan;
