import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fr, enGB } from "date-fns/locale";
import SectionsContent from "../Shared/SectionsContent/SectionsContent";
import { GlobalContext } from "../context/Global";


const locales = { fr, en: enGB };

function TemplateMapping({locale, templateId}) {
  const { i18n } = useTranslation();
  const { setLocale } = useContext(GlobalContext);

  useEffect(() => {
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));
  }, [locale])

  return (
    <div style={{ position: 'relative' }}>
      <SectionsContent templateId={templateId} readonly={true} mode="mapping"/>
    </div>
  );
}

export default TemplateMapping;
