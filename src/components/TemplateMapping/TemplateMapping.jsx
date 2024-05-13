import React, { useContext, useEffect, useRef } from "react";
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
  const { enableMapping, setEditorRef } = useSectionsMapping();
  const editorRef = useRef(null);

  const methods = useForm({ defaultValues: formData });

  // --- BEHAVIOURS ---
  useEffect(() => {
    enableMapping();
    setEditorRef(editorRef);
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
            ref={editorRef}
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
