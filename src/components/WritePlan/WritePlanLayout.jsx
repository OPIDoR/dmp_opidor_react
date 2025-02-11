import React from 'react';
import { Toaster } from 'react-hot-toast';

import Global from '../context/Global.jsx';
import WritePlan from './WritePlan.jsx'
import '../../i18n.js';

import Joyride from '../Shared/Joyride/index.jsx';
import { writePlanSteps } from '../Shared/Tours';
import { useTranslation } from 'react-i18next';

const toastOptions = {
  duration: 5000,
};

function WritePlanLayout({
  planId,
  templateId,
  locale = 'en_GB',
  userId,
  currentOrgId,
  currentOrgName,
  readonly,
  configuration,
}) {
  const { t } = useTranslation();


  return (
    <Global>
      <Joyride tourName="write_plan" steps={writePlanSteps(t)} locale={locale}>
        <WritePlan
          planId={planId}
          templateId={templateId}
          locale={locale}
          userId={userId}
          currentOrgId={currentOrgId}
          currentOrgName={currentOrgName}
          readonly={readonly}
          configuration={configuration}
          className="research-outputs-tabs"
        />
      </Joyride>
      <Toaster position="bottom-right" toastOptions={toastOptions} reverseOrder={false} />
    </Global>
  )
}

export default WritePlanLayout;
