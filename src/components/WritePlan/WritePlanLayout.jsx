import React from 'react';
import { Toaster } from 'react-hot-toast';

import Global from '../context/Global';
import WritePlan from './WritePlan';
import '../../i18n';

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
  return (
    <Global>
      <WritePlan
        planId={planId}
        templateId={templateId}
        locale={locale}
        userId={userId}
        currentOrgId={currentOrgId}
        currentOrgName={currentOrgName}
        readonly={readonly}
      />
      <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
    </Global>
  );
}

export default WritePlanLayout;
