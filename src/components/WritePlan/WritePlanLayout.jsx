import React from 'react';
import { Toaster } from 'react-hot-toast';

import Global from '../context/Global.jsx';
import WritePlan from './WritePlan.jsx'
import '../../i18n.js';

import Joyride from '../Shared/Joyride/index.jsx';
import { writePlanSteps } from '../Shared/Tours';
import { useTranslation } from 'react-i18next';
import { SectionsMappingProvider } from '../context/SectionsMappingContext.jsx';
import { TemplateProvider } from '../context/TemplateContext.jsx';

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
}) {
  const { t } = useTranslation();

  return (
    <Global>
      <TemplateProvider>
        <SectionsMappingProvider>
          <Joyride tourName="write_plan" steps={writePlanSteps(t)} locale={locale}>
            <WritePlan
              planId={planId}
              templateId={templateId}
              locale={locale}
              userId={userId}
              currentOrgId={currentOrgId}
              currentOrgName={currentOrgName}
              readonly={readonly}
              className="research-outputs-tabs"
            />
          </Joyride>
          <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
        </SectionsMappingProvider>
      </TemplateProvider>
    </Global>
  )
}

export default WritePlanLayout;
