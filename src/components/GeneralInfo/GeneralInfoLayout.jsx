import React from 'react';

import Global from '../context/Global.jsx';
import GeneralInfo from './GeneralInfo.jsx';
import '../../i18n.js';
import { Toaster } from 'react-hot-toast';


function GeneralInfoLayout({ planId, dmpId, projectFragmentId, metaFragmentId, locale = 'en_GB', isTestPlan = false }) {
  return(
    <Global>
      <GeneralInfo
        locale={locale}
        planId={planId}
        dmpId={dmpId}
        projectFragmentId={projectFragmentId}
        metaFragmentId={metaFragmentId}
        isTestPlan={isTestPlan}
      />
      <Toaster position="top-center" reverseOrder={false} />
    </Global>
  )
}

export default GeneralInfoLayout;
