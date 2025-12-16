import React, { StrictMode } from 'react';

import Global from '../context/Global.jsx';
import GeneralInfo from './GeneralInfo.jsx';
import GuidanceSelector from '../GuidanceChoice/GuidanceSelector.jsx';
import '../../i18n.js';
import { Toaster } from 'react-hot-toast';

const toastOptions = {
  duration: 5000,
};

function GeneralInfoLayout({
  planId,
  dmpId,
  projectFragmentId,
  metaFragmentId,
  locale = 'en_GB',
  researchContext = 'research_project',
  isTest = false,
  isClassic = false,
  writeable = false,
}) {
  return (
    <StrictMode>
      <Global>
        {isClassic && writeable && <GuidanceSelector planId={planId} context={'plan'} />}
        <GeneralInfo
          locale={locale}
          planId={planId}
          dmpId={dmpId}
          projectFragmentId={projectFragmentId}
          metaFragmentId={metaFragmentId}
          researchContext={researchContext}
          isTest={isTest}
          writeable={writeable}
          isClassic={isClassic}
        />
        <Toaster position="bottom-right" toastOptions={toastOptions} reverseOrder={false} />
      </Global>
    </StrictMode>
  );
}

export default GeneralInfoLayout;
