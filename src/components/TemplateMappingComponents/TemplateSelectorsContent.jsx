import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import TemplateSelector from "./TemplateSelector";
import { TemplateProvider } from "../context/TemplateContext";
import useSectionsMapping from "../../hooks/useSectionsMapping";
import InputText from "../FormComponents/InputText";

export function TemplateSelectorsContent({ data, mappingType, setMappingType }) {
  const methods = useForm({ defaultValues: data });

  const {
    initialTemplateId, setInitialTemplateId,
    targetTemplateId, setTargetTemplateId,
    templateMappingId,
    TYPE_FORM, TYPE_JSON,
  } = useSectionsMapping();

  useEffect(() => {
    methods.setValue('mappingType', mappingType);
  }, [mappingType]);

  return <div className="row">
    <FormProvider {...methods}>
      <TemplateProvider>
        {/* <InputText label="Mapping Name" propName="templateMappingName" hidden={false} /> */}
        <div className="col-md-12">
          <InputText label="Mapping Name" propName="templateMappingName" hidden={false} disableMapping />
          <TemplateSelector
            label="Mapping Type"
            propName="mappingType"
            defaultValue={initialTemplateId}
            data={[
              TYPE_FORM,
              TYPE_JSON,
            ]}
            onTemplateChange={setMappingType}
            readonly={templateMappingId}
          />
        </div>
        <div className="col-md-6">
          <TemplateSelector
            label="Initial Template"
            propName="structuredTemplateId"
            defaultValue={initialTemplateId}
            requestParams="?type=structured"
            onTemplateChange={setInitialTemplateId}
            readonly={templateMappingId}
          />
        </div>
        <div className="col-md-6">
          <TemplateSelector
            label="Target Template"
            propName="classicTemplateId"
            defaultValue={targetTemplateId}
            requestParams={"?type=classic"}
            onTemplateChange={setTargetTemplateId}
            readonly={templateMappingId}
          />
        </div>
      </TemplateProvider>
    </FormProvider>
  </div>;
}

export default TemplateSelectorsContent;
