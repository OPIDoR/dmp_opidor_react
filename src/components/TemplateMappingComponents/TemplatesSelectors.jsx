import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import TemplateSelector from "../TemplateMappingComponents/TemplateSelector";

export function TemplatesSelectors({ initialTemplateId, setInitialTemplateId, targetTemplateId, setTargetTemplateId, data }) {
  const methods = useForm({ defaultValues: data });

  return <div className="row">
    <FormProvider {...methods}>
      <div className="col-md-6">
        {/* <h2>Initial Template</h2> */}
        <TemplateSelector
          label="Structured Template"
          propName="structuredTemplateId"
          defaultValue={initialTemplateId}
          requestParams="?type=structured"
          onTemplateChange={setInitialTemplateId} />
      </div>
      <div className="col-md-6">
        {/* <h2>Target Template</h2> */}
        <TemplateSelector
          label="Classic Template"
          propName="classicTemplateId"
          defaultValue={targetTemplateId}
          requestParams="?type=classic"
          onTemplateChange={setTargetTemplateId} />
      </div>
    </FormProvider>
  </div>;
}

export default TemplatesSelectors;