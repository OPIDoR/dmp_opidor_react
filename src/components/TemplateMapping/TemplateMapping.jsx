import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SectionsContent from "../Shared/SectionsContent/SectionsContent";
import { GlobalContext } from "../context/Global";
import useSectionsMode, { MODE_MAPPING } from "../../hooks/useSectionsMode";


function TemplateMapping({locale, templateId}) {
  // --- STATE ---
  const { i18n } = useTranslation();
  const { setLocale } = useContext(GlobalContext);
  const { setMode } = useSectionsMode();

  // --- BEHAVIOURS ---
  useEffect(() => {
    setMode(MODE_MAPPING);
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));
  }, [locale])

  // --- RENDER ---
  return (
    <div style={{ position: 'relative' }}>
      <SectionsContent templateId={templateId} readonly={true}/>
    </div>
  );
}

export default TemplateMapping;