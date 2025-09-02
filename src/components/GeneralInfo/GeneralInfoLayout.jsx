import React, { StrictMode } from 'react';

import Global from '../context/Global.jsx';
import GeneralInfo from './GeneralInfo.jsx';
import GuidanceChoice from '../WritePlan/GuidanceChoice.jsx';
import '../../i18n.js';
import { Toaster } from 'react-hot-toast';

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
  return(
    <StrictMode>
      <Global>
        {isClassic && !readonly && <GuidanceChoice planId={planId} context={'plan'} currentOrgId={currentOrgId} currentOrgName={currentOrgName} />}
        <GeneralInfo
          locale={locale}
          planId={planId}
          dmpId={dmpId}
          projectFragmentId={projectFragmentId}
          metaFragmentId={metaFragmentId}
          researchContext={researchContext}
          isTest={isTest}
          readonly={readonly}
          isClassic={isClassic}
        />
        <Toaster position="bottom-right" toastOptions={toastOptions} reverseOrder={false} />
      </Global>
    </StrictMode>
  )
}

export default GeneralInfoLayout;
