import React, { useContext } from "react";
import { useTranslation, Trans } from "react-i18next";
import { fr, enGB } from "date-fns/locale";
import { format } from "date-fns";
import { FaRegCompass } from "react-icons/fa6";
import { Tooltip as ReactTooltip } from 'react-tooltip';

import { useTour } from "../Shared/Joyride/JoyrideContext";
import { GlobalContext } from "../context/Global";

const locales = { fr, en: enGB };

function PlanInformations() {
  const { t } = useTranslation();
  const {
    displayedResearchOutput,
    planInformations
  } = useContext(GlobalContext);

  const { setIsOpen } = useTour();

  const planInformationsMessage = displayedResearchOutput?.configuration.moduleId ?
    'This research output uses the <0>"{{model}}"</0> model (version: {{version}}, published on: {{publishedDate}}).' :
    'This plan is based on the <0>"{{model}}"</0> model provided by <1>{{orgName}}</1> (version: {{version}}, published on: {{publishedDate}}).';


  return (planInformations && (
    <div style={{
      textAlign: 'center',
      color: 'grey',
      fontSize: '16px',
      margin: '20px 0 20px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div id="guided-tour-compass">
        <ReactTooltip
          id="guided-tour"
          place="bottom"
          effect="solid"
          variant="info"
          content={t('Run guided tour')}
        />
        <FaRegCompass
          data-tooltip-id="guided-tour"
          size="32"
          onClick={() => setIsOpen(true)}
          style={{
            cursor: 'pointer',
            marginRight: '10px',
            color: 'var(--dark-blue)',
          }}
        />
      </div>
      <div style={{
        marginTop: '5px',
      }}>
        <Trans
          t={t}
          defaults={planInformationsMessage}
          values={{
            model: planInformations.title,
            orgName: planInformations.org,
            version: planInformations.version,
            publishedDate: format(new Date(planInformations.publishedDate), 'dd LLLL yyyy', { locale: locales[planInformations.locale || i18n.resolvedLanguage] }),
          }}
          components={[<strong>{planInformations.title}</strong>, <strong>{planInformations.org}</strong>]}
        />
      </div>
    </div>
  )
  );
}

export default PlanInformations;
