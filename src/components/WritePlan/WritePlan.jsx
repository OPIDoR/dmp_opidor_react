import React, { useEffect, useState, useContext } from "react";
import { Trans, useTranslation } from "react-i18next";
import Card from 'react-bootstrap/Card';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';

import SectionsContent from "./SectionsContent";
import { writePlan } from "../../services";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import GuidanceChoice from "./GuidanceChoice";
import * as styles from "../assets/css/sidebar.module.css";
import PlanInformations from "./PlanInformations";
import ResearchOutputForm from "../ResearchOutput/ResearchOutputForm";
import TooltipInfoIcon from '../FormComponents/TooltipInfoIcon';
import ResearchOutputsSidebar from "./ResearchOutputsSidebar";
import WritePlanPlaceholder from "./Placeholders/WritePlanPlaceholder";
import { useLoading } from "../../hooks/useLoading";

function WritePlan({
  locale = 'en_GB',
  planId,
  templateId,
  userId,
  readonly,
  currentOrgId,
  currentOrgName,
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
  } = useContext(GlobalContext);
  const { loading, changeLoading } = useLoading();
  const [error, setError] = useState(null);
  const [template, setTemplate] = useState(null);
  const tooltipedLabelId = uniqueId('create_research_output_tooltip_id_');

  useEffect(() => {
    i18n.changeLanguage(locale.substring(0, 2));
  }, [locale])

  /* A hook that is called when the component is mounted. It is used to fetch data from the API. */
  //TODO update this , it can make error
  useEffect(() => {
    changeLoading(true);

    const queryParameters = new URLSearchParams(window.location.search);
    const researchOutputId = queryParameters.get('research_output');

    setCurrentOrg({ id: currentOrgId, name: currentOrgName });
    setUserId(userId);
    setLocale(locale);

    loadData(planId, researchOutputId);

    const handleRefresh = (e) => {
      loadData(e?.detail?.message?.planId || planId, e?.detail?.message?.roId || researchOutputId);
    };

    window.addEventListener('trigger-refresh-ro-data', handleRefresh);
    window.addEventListener("scroll", (e) => handleScroll(e));

    return () => {
      window.removeEventListener('trigger-refresh-ro-data', handleRefresh);
      window.removeEventListener("scroll", (e) => handleScroll(e));
    };
  }, [planId]);

  const loadData = (planId, researchOutputId) => {
    writePlan.getPlanData(planId)
      .then((res) => {
        setDmpId(res.data.dmp_id);
        setTemplate(res.data.template);

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
      .finally(() => changeLoading(false));
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
      {loading && <WritePlanPlaceholder />}
      {error && <CustomError error={error}></CustomError>}
      {!loading && !error &&
        <>
          {!readonly &&
            <div style={{ margin: '10px 30px 10px 30px' }}>
              <GuidanceChoice planId={planId} currentOrgId={currentOrgId} currentOrgName={currentOrgName} style={{ flexGrow: 1 }} />
            </div>
          }
          {researchOutputs.length > 0 && (
            <>
              <PlanInformations template={template} />
              <div className={styles.section}>
                <ResearchOutputsSidebar planId={planId} readonly={readonly} setLoading={changeLoading} />
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
          {researchOutputs.length === 0 && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Card style={{ width: '800px' }}>
                <Card.Body>
                  {readonly ?
                    <h2 style={{ textAlign: 'center' }}>{t('Your plan does not yet include any research output')}</h2>
                    : <h2 style={{ textAlign: 'center' }} data-tooltip-id={tooltipedLabelId}>
                      <Trans
                        t={t}
                        defaults="Add a research output"
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
                </Card.Body>
              </Card>
            </div>
          )
          }
        </>
      }
    </div>
  );
}

export default WritePlan;
