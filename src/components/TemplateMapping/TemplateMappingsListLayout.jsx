import React from 'react';
import { Toaster } from 'react-hot-toast';

import Global from '../context/Global.jsx';
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
    // <Global>
        <SectionsMappingProvider>
          <TemplateMappingsList
            locale={locale}
            mappingId={mappingId}
            readonly
          />
          <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
        </SectionsMappingProvider>
    // </Global>
  )
}

export default TemplateMappingsListLayout;
