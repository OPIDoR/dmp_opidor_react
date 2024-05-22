import React from 'react';
import { Toaster } from 'react-hot-toast';

import Global from '../context/Global.jsx';
import '../../i18n.js';

import TemplateMapping from './TemplateMapping.jsx';
import { SectionsMappingProvider } from '../context/SectionsMappingContext.jsx';

const toastOptions = {
  duration: 5000,
};

function TemplateMappingLayout({
  locale = 'en_GB',
  templateId,
}) {
  // --- STATE ---
  console.log("TML", templateId);

  // --- RENDER ---
  return (
    <Global>
      <SectionsMappingProvider>
        <TemplateMapping 
          locale={locale}
          readonly
        />
        <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
      </SectionsMappingProvider>
    </Global>
  )
}

export default TemplateMappingLayout;
