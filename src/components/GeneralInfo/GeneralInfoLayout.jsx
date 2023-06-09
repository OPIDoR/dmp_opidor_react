import React from 'react';

import Global from '../context/Global.jsx';
import GeneralInfo from './GeneralInfo.jsx';
import '../../i18n.js';


function GeneralInfoLayout({ planId, dmpId, projectFragmentId, metaFragmentId, locale = 'en_GB', isTestPlan = false }) {
  console.log("render");
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
    </Global>
  )
}

export default GeneralInfoLayout;
