import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fr, enGB } from "date-fns/locale";
import SectionsContent from "../Shared/SectionsContent/SectionsContent";
import { GlobalContext } from "../context/Global";
import { ModeContext } from "../context/ModeContext";


const locales = { fr, en: enGB };

function TemplateMapping({locale, templateId}) {
  const { i18n } = useTranslation();
  const { setLocale } = useContext(GlobalContext);
  const { setMode } = useContext(ModeContext);

  useEffect(() => {
    setMode("mapping");
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));
  }, [locale])

  return (
    <div style={{ position: 'relative' }}>
      <SectionsContent templateId={templateId} readonly={true}/>
    </div>
  );
}

export default TemplateMapping;
