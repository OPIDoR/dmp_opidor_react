import React from 'react';
import { Toaster } from 'react-hot-toast';

import Global from '../context/Global.jsx';
import '../../i18n.js';

import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  console.log("TML", templateId);
  const TEMP_TEMPLATE_ID = 4;

  // --- RENDER ---
  return (
    <Global>
      <SectionsMappingProvider>
        <TemplateMapping 
          templateId={TEMP_TEMPLATE_ID}
          locale={locale}
          readonly={true}
        />
        <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
      </SectionsMappingProvider>
    </Global>
  )
}

export default TemplateMappingLayout;
