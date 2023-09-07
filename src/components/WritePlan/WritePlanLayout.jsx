import React from 'react';
import { Toaster } from 'react-hot-toast';

import Global from '../context/Global.jsx';
import WritePlan from './WritePlan.jsx'
import '../../i18n.js';

const toastOptions = {
  duration: 5000,
}

function WritePlanLayout({
  planId,
  templateId,
  locale = 'en_GB',
  userId,
  readonly, 
}) {
  return(
    <Global>
      <WritePlan
        planId={planId}
        templateId={templateId}
        locale={locale}
        userId={userId}
        readonly={readonly}
      />
      <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
    </Global>
  )
}

export default WritePlanLayout
