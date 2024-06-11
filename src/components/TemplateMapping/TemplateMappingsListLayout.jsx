import React from 'react';
import { Toaster } from 'react-hot-toast';
import '../../i18n.js';

import TemplateMappingsList from './TemplateMappingsList.jsx';
import { SectionsMappingProvider } from '../context/SectionsMappingContext.jsx';
import { TemplateProvider } from '../context/TemplateContext.jsx';

const toastOptions = {
  duration: 5000,
};

function TemplateMappingsListLayout({
  locale = 'en_GB',
  mappingId,
}) {
  return (
    <SectionsMappingProvider>
      <TemplateProvider>
        <TemplateMappingsList
          locale={locale}
          mappingId={mappingId}
          readonly
        />
      </TemplateProvider>
      <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
    </SectionsMappingProvider>
  )
}

export default TemplateMappingsListLayout;
