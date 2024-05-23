import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../context/Global";
import useSectionsMapping from "../../hooks/useSectionsMapping";
import TemplatesSelectors from "../TemplateMappingComponents/TemplatesSelectors";
import Mapper from "../TemplateMappingComponents/Mapper";

function TemplateMapping({ data, locale }) {
  const { i18n } = useTranslation();
  const { setLocale } = useContext(GlobalContext);
  const { enableMapping } = useSectionsMapping();

  const [initialTemplateId, setInitialTemplateId] = useState(5);
  const [targetTemplateId, setTargetTemplateId] = useState(1);
  const [mappingType, setMappingType] = useState('structuredToClassic');

  useEffect(() => {
    enableMapping();
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));
  }, [locale]);

  return (
    <>
      <h1>Template Mapping</h1>
      <p>Here you can map the sections of a structured template to the sections of a classic template.</p>
      <TemplatesSelectors
        initialTemplateId={initialTemplateId}
        setInitialTemplateId={setInitialTemplateId}
        targetTemplateId={targetTemplateId}
        setTargetTemplateId={setTargetTemplateId}
        data={data}
        mappingType={mappingType}
        setMappingType={setMappingType}
      />
      <Mapper
        initialTemplateId={initialTemplateId} 
        targetTemplateId={targetTemplateId}
      />
    </>
  );
}

export default TemplateMapping;