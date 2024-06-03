import React from 'react';
import { Toaster } from 'react-hot-toast';

import Global from '../context/Global.jsx';
import '../../i18n.js';

import TemplateMapping from './TemplateMapping.jsx';
import { SectionsMappingProvider } from '../context/SectionsMappingContext.jsx';
import { TemplateProvider } from '../context/TemplateContext.jsx';

const toastOptions = {
  duration: 5000,
};

function TemplateMappingLayout({
  locale = 'en_GB',
  mappingId,
}) {
  return (
    <Global>
      <TemplateProvider>
        <SectionsMappingProvider>
          <TemplateMapping
            locale={locale}
            mappingId={mappingId}
            readonly
          />
          <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
        </SectionsMappingProvider>
      </TemplateProvider>
    </Global>
  )
}

export default TemplateMappingLayout;
