import React from "react";
import { useTranslation } from "react-i18next";
import { fr, enGB } from "date-fns/locale";
import SectionsContent from "../Shared/SectionsContent/SectionsContent";


const locales = { fr, en: enGB };

function TemplateMapping({locale, templateId}) {
  return (
    <div style={{ position: 'relative' }}>
      <SectionsContent templateId={templateId} readonly={true} mode="mapping"/>
    </div>
  );
}

export default TemplateMapping;
