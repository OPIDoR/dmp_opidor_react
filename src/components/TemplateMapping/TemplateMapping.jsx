import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../context/Global";
import useSectionsMapping from "../../hooks/useSectionsMapping";
import TemplateSelectorsContent from "../TemplateMappingComponents/TemplateSelectorsContent";
import Mapper from "../TemplateMappingComponents/Mapper";
import CustomButton from "../Styled/CustomButton";

function TemplateMapping({ data, locale, mappingId }) {
  // --- STATE ---
  const { i18n } = useTranslation();
  const { setLocale } = useContext(GlobalContext);
  const {
    enableMapping,
    initialTemplateId,
    targetTemplateId,
    templateMappingId, setTemplateMappingId,
    saveMapping,
  } = useSectionsMapping();

  const [mappingType, setMappingType] = useState('formToForm');

  // --- EFFECTS ---
  useEffect(() => {
    enableMapping();
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));

    // setInitialTemplateId(5);
    // setTargetTemplateId(4);
    console.log(initialTemplateId, targetTemplateId);
  }, [locale]);

  useEffect(() => {
    setTemplateMappingId(mappingId);
  }, [mappingId]);

  // --- RENDER ---
  return (
    <>
      <h1>Template Mapping</h1>
      <p>Here you can map the sections of a structured template to the sections of a classic template.</p>
      <TemplateSelectorsContent
        data={data}
        mappingType={mappingType}
        setMappingType={setMappingType}
      />
      <Mapper
        mappingType={mappingType}
      />
      <div style={{
        alignContent:"center",
        display:"flex",
        justifyContent:"center",
        marginTop: "20px"
      }}>
        <CustomButton
          title={templateMappingId ? "Save mapping" : "Create mapping"}
          handleClick={saveMapping}
          buttonColor="orange"
        />
      </div>
      
    </>
  );
}

export default TemplateMapping;