import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import TemplateSelector from "../TemplateMappingComponents/TemplateSelector";

export function TemplatesSelectors({ initialTemplateId, setInitialTemplateId, targetTemplateId, setTargetTemplateId, data, mappingType, setMappingType }) {
  const methods = useForm({ defaultValues: data });

  useEffect(() => {
    methods.setValue('mappingType', mappingType);
  }, [mappingType]);

  return <div className="row">
    <FormProvider {...methods}>
      <div>
        <TemplateSelector
          label="Mapping Type"
          propName="mappingType"
          defaultValue={initialTemplateId}
          data={[
            { value: 'structuredToClassic', label: 'Structured to Classic' },
            { value: 'structuredToStructured', label: 'Structured to Structured' }
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
          requestParams={mappingType === 'structuredToStructured' ? "?type=structured" : "?type=classic"}
          onTemplateChange={setTargetTemplateId} />
      </div>
    </FormProvider>
  </div>;
}

export default TemplatesSelectors;
