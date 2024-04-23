import React from 'react';
import { Toaster } from 'react-hot-toast';

import Global from '../context/Global.jsx';
import '../../i18n.js';

import { useTranslation } from 'react-i18next';
import TemplateMapping from './TemplateMapping.jsx';

const toastOptions = {
  duration: 5000,
};

function TemplateMappingLayout({
  locale = 'en_GB',
}) {
  const { t } = useTranslation();

  return (
    <Global>
      <TemplateMapping locale={locale}/>
      <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
    </Global>
  )
}

export default TemplateMappingLayout;
