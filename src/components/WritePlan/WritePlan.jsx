import React, {
  useEffect, useState, useContext, useRef, useCallback,
} from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { format } from 'date-fns';
import { fr, enGB } from 'date-fns/locale';

import SectionsContent from './SectionsContent';
import { writePlan } from '../../services';
import CustomSpinner from '../Shared/CustomSpinner';
import { GlobalContext } from '../context/Global';
import CustomError from '../Shared/CustomError';
import GuidanceChoice from './GuidanceChoice';
import ResearchOutputsTabs from './ResearchOutputsTabs';
import styles from '../assets/css/sidebar.module.css';
import consumer from '../../cable';

const locales = { fr, en: enGB };

function WritePlan({
  locale = 'en_GB',
  planId,
  templateId,
  userId,
  readonly,
  currentOrgId,
  currentOrgName,
}) {
  const { i18n } = useTranslation();
  const {
    setFormData,
    setPlanData,
    setDmpId,
    setCurrentOrg,
    setUserId,
    setLocale,
    displayedResearchOutput, setDisplayedResearchOutput,
    researchOutputs, setResearchOutputs,
    setQuestionsWithGuidance,
    planInformations,
  } = useContext(GlobalContext);
  const subscriptionRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleWebsocketData = useCallback((data) => {
    if (data.target === 'research_output_infobox' && displayedResearchOutput.id === data.research_output_id) {
      setDisplayedResearchOutput({ ...displayedResearchOutput, ...data.payload });
    }
    if (data.target === 'dynamic_form') {
      setFormData({ [data.fragment_id]: data.payload });
    }
  }, [displayedResearchOutput, setDisplayedResearchOutput, setFormData]);

  useEffect(() => {
    i18n.changeLanguage(locale.substring(0, 2));
  }, [locale]);

  useEffect(() => {
    if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
    subscriptionRef.current = consumer.subscriptions.create(
      { channel: 'PlanChannel', id: planId },
      {
        connected: () => console.log('connected!'),
        disconnected: () => console.log('disconnected !'),
        received: (data) => handleWebsocketData(data),
      },
    );
    return () => {
      consumer.disconnect();
    };
  }, [planId, handleWebsocketData]);

  /* A hook that is called when the component is mounted. It is used to fetch data from the API. */
  // TODO update this , it can make error
  useEffect(() => {
    setLoading(true);

    const queryParameters = new URLSearchParams(window.location.search);
    const researchOutputId = queryParameters.get('research_output');

    setCurrentOrg({ id: currentOrgId, name: currentOrgName });
    setUserId(userId);
    setLocale(locale);

    writePlan.getPlanData(planId)
      .then((res) => {
        setPlanData(res.data);
        setDmpId(res.data.dmp_id);

        const { research_outputs, questions_with_guidance } = res.data;

        let currentResearchOutput = research_outputs?.[0];
        if (researchOutputId) {
          const researchOutput = research_outputs
            .find(({ id }) => id === Number.parseInt(researchOutputId, 10));
          if (researchOutput) {
            currentResearchOutput = researchOutput;
          }
        }

        setDisplayedResearchOutput(currentResearchOutput);
        !researchOutputs && setResearchOutputs(research_outputs);
        setQuestionsWithGuidance(questions_with_guidance || []);
        setFormData(null);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));

    window.addEventListener('scroll', (e) => handleScroll(e));
  }, [planId]);

  const handleScroll = () => {
    const roNavBar = document.querySelector('#ro-nav-bar');
    const { bottom: bottomRoNavBar, top: topRoNavBar } = roNavBar?.getBoundingClientRect() || 0;

    const sectionContent = document.querySelector('#sections-content');
    const {
      bottom: bottomSectionContent,
      top: topSectionContent,
    } = sectionContent?.getBoundingClientRect() || 0;

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
  };

  return (
    <div style={{ position: 'relative' }}>
      {loading && <CustomSpinner isOverlay />}
      {error && <CustomError error={error} />}
      {!error && researchOutputs && (
        <>
          <div style={{ margin: '10px 30px 10px 30px' }}>
            <GuidanceChoice planId={planId} />
          </div>
          {
            planInformations && (
              <div style={{
                textAlign: 'center',
                color: 'grey',
                fontSize: '16px',
                margin: '20px 0 20px 0',
              }}
              >
                <Trans
                  defaults="This plan is based on the &#8220;<bold>{{model}}</bold>&#8221; model provided by <bold>{{orgName}}</bold> (version: {{version}}, published on: {{publishedDate}})."
                  values={{
                    model: planInformations.title,
                    orgName: planInformations.org,
                    version: planInformations.version,
                    publishedDate: format(new Date(planInformations.publishedDate), 'dd LLLL yyyy', { locale: locales[planInformations.locale || i18n.resolvedLanguage] }),
                  }}
                  components={{ bold: <strong /> }}
                />
              </div>
            )
          }
          <div className={styles.section}>
            <ResearchOutputsTabs planId={planId} readonly={readonly} />
            <div className={styles.main}>
              {planId && displayedResearchOutput && (
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
    </div>
  );
}

export default WritePlan;
