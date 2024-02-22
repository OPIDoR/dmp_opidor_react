import React from 'react';

import Global from '../context/Global;
import ContributorsTab from './ContributorsTab;
import '../../i18n;
import { Toaster } from 'react-hot-toast';

const toastOptions = {
  duration: 5000,
};

function ContributorsTabLayout({ planId, locale, readonly }) {
  return (
    <Global>
      <ContributorsTab planId={planId} locale={locale} readonly={readonly} />
      <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
    </Global>
  );
}

export default ContributorsTabLayout;
