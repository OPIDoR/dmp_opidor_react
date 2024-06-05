import React from 'react';
import { Toaster } from 'react-hot-toast';
import '../../i18n.js';

import TemplateMappingsList from './TemplateMappingsList.jsx';
import { SectionsMappingProvider } from '../context/SectionsMappingContext.jsx';

const toastOptions = {
  duration: 5000,
};

function TemplateMappingsListLayout({
  locale = 'en_GB',
  mappingId,
}) {
  return (
    <SectionsMappingProvider>
      <TemplateMappingsList
        locale={locale}
        mappingId={mappingId}
        readonly
      />
      <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
    </SectionsMappingProvider>
  )
}

export default TemplateMappingsListLayout;
