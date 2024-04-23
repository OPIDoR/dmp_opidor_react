import React from "react";
import { useTranslation } from "react-i18next";
import { fr, enGB } from "date-fns/locale";

import SectionsContent from "../ProductForm/SectionsContent";


const locales = { fr, en: enGB };

function TemplateMapping({locale}) {
  const planId = 1;
  const templateId = 1;
  const readonly = true;
  
  return (
    <div style={{ position: 'relative' }}>
      Coucou
      {/* <SectionsContent></SectionsContent> */}
      <SectionsContent
          planId={planId}
          templateId={templateId}
          readonly={readonly}
        />
    </div>
  );
}

export default TemplateMapping;
