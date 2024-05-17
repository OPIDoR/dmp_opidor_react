import React, { useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import SectionsContent from "../Shared/SectionsContent/SectionsContent";
import { GlobalContext } from "../context/Global";
import useSectionsMapping from "../../hooks/useSectionsMapping";


function TemplateMapping({locale, initialTemplateId, targetTemplateId}) {
  // --- STATE ---
  const { i18n } = useTranslation();
  const { setLocale } = useContext(GlobalContext);
  const { enableMapping, USAGE_INITIAL, USAGE_TARGET } = useSectionsMapping();

  // --- BEHAVIOURS ---
  useEffect(() => {
    enableMapping();
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));
  }, [locale])

  // --- RENDER ---
  return (
    <div className="row">
      <div className="col-md-6">
        <SectionsContent templateId={initialTemplateId} readonly id='left' mappingUsage={USAGE_INITIAL}/>
      </div>
      <div className="col-md-6">
        <SectionsContent templateId={targetTemplateId} id='right' hiddenFields mappingUsage={USAGE_TARGET}/>
      </div>
    </div>
  );
}

export default TemplateMapping;
