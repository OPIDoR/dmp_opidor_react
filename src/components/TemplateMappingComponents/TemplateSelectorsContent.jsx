import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import TemplateSelector from "./TemplateSelector";
import { TemplateProvider } from "../context/TemplateContext";

export function TemplateSelectorsContent({ initialTemplateId, setInitialTemplateId, targetTemplateId, setTargetTemplateId, data, mappingType, setMappingType }) {
  const methods = useForm({ defaultValues: data });

  useEffect(() => {
    methods.setValue('mappingType', mappingType);
  }, [mappingType]);

  return <div className="row">
    <FormProvider {...methods}>
      <TemplateProvider>
        <div>
          <TemplateSelector
            label="Mapping Type"
            propName="mappingType"
            defaultValue={initialTemplateId}
            data={[
              { value: 'formToForm', label: 'Form To Form' },
              { value: 'formToJson', label: 'Form To JSON' },
            ]}
            onTemplateChange={setMappingType}
          />
        </div>
        <div className="col-md-6">
          {/* <h2>Initial Template</h2> */}
          <TemplateSelector
            label="Initial Template"
            propName="structuredTemplateId"
            defaultValue={initialTemplateId}
            requestParams="?type=structured"
            onTemplateChange={setInitialTemplateId} />
        </div>
        <div className="col-md-6">
          {/* <h2>Target Template</h2> */}
          <TemplateSelector
            label="Target Template"
            propName="classicTemplateId"
            defaultValue={targetTemplateId}
            requestParams={""}
            onTemplateChange={setTargetTemplateId} />
        </div>
      </TemplateProvider>
    </FormProvider>
  </div>;
}

export default TemplateSelectorsContent;
