import React from 'react';

import Global from '../context/Global.jsx';
import GeneralInfo from './GeneralInfo.jsx';
import '../../i18n.js';
import { Toaster } from 'react-hot-toast';

const toastOptions = {
  duration: 5000,
  style: {
    maxWidth: 500,
  }
}

function GeneralInfoLayout({ planId, dmpId, projectFragmentId, metaFragmentId, locale = 'en_GB', isTest = false }) {
  return(
    <Global>
      <GeneralInfo
        locale={locale}
        planId={planId}
        dmpId={dmpId}
        projectFragmentId={projectFragmentId}
        metaFragmentId={metaFragmentId}
        isTest={isTest}
      />
      <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
    </Global>
  )
}

export default GeneralInfoLayout;
