import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SectionsContent from "../Shared/SectionsContent/SectionsContent";
import { GlobalContext } from "../context/Global";
import useSectionsMapping from "../../hooks/useSectionsMapping";
import TinyArea from "../FormComponents/TinyArea";
import { FormProvider, useForm } from "react-hook-form";


function TemplateMapping({locale, templateId}) {
  // --- STATE ---
  const { i18n } = useTranslation();
  const { setLocale, formData } = useContext(GlobalContext);
  const { enableMapping } = useSectionsMapping();

  const methods = useForm({ defaultValues: formData });

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
        <SectionsContent templateId={templateId} readonly/>
      </div>
      <div className="col-md-6">
        <FormProvider {...methods}>
          <TinyArea
            key="uniqueKeyForTinyArea"
            label="Edit Export Template"
            propName="template"
            defaultValue=""
            disableMappingBtn
          />
        </FormProvider>
      </div>
    </div>
  );
}

export default TemplateMapping;
