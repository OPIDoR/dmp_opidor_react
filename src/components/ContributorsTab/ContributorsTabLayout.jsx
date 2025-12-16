import React, { StrictMode } from 'react';

import Global from '../context/Global.jsx';
import ContributorsTab from './ContributorsTab.jsx';
import '../../i18n.js';
import { Toaster } from 'react-hot-toast';

const toastOptions = {
  duration: 5000,
};

function ContributorsTabLayout({ planId, locale, writeable = false }) {
  return (
    <StrictMode>
      <Global>
        <ContributorsTab planId={planId} locale={locale} writeable={writeable} />
        <Toaster position="bottom-right" toastOptions={toastOptions} reverseOrder={false} />
      </Global>
    </StrictMode>
  );
}

export default ContributorsTabLayout;
