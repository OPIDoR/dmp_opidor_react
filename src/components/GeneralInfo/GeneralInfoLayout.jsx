import React from 'react';

import Global from '../context/Global.jsx';
import GeneralInfo from './GeneralInfo.jsx';
import GuidanceChoice from '../WritePlan/GuidanceChoice.jsx';
import '../../i18n.js';
import { Toaster } from 'react-hot-toast';
import { SectionsMappingProvider } from '../context/SectionsMappingContext.jsx';
import { TemplateProvider } from '../context/TemplateContext.jsx';

const toastOptions = {
  duration: 5000,
}

function GeneralInfoLayout({
  planId,
  dmpId,
  projectFragmentId,
  metaFragmentId,
  locale = 'en_GB',
  researchContext = 'research_project',
  isTest = false,
  isClassic = false,
  currentOrgId,
  currentOrgName,
  readonly = false,
}) {
  return (
    <Global>
      <TemplateProvider>
        <SectionsMappingProvider>
          {isClassic && <GuidanceChoice planId={planId} isClassic={isClassic} currentOrgId={currentOrgId} currentOrgName={currentOrgName} />}
          <GeneralInfo
            locale={locale}
            planId={planId}
            dmpId={dmpId}
            projectFragmentId={projectFragmentId}
            metaFragmentId={metaFragmentId}
            researchContext={researchContext}
            isTest={isTest}
            readonly={readonly}
          />
          <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
        </SectionsMappingProvider>
      </TemplateProvider>
    </Global>
  )
}

export default GeneralInfoLayout;
