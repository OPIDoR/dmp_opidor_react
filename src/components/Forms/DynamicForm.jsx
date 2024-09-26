import React, {
  useContext, useEffect, useState,
} from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import unionBy from 'lodash.unionby';

import FormBuilder from './FormBuilder.jsx';
import { GlobalContext } from '../context/Global.jsx';
import { service } from '../../services';
import CustomSpinner from '../Shared/CustomSpinner.jsx';
import CustomButton from '../Styled/CustomButton.jsx';
import FormSelector from './FormSelector';
import { ExternalImport } from '../ExternalImport';
import { getErrorMessage } from '../../utils/utils.js';

function DynamicForm({
  fragmentId,
  className,
  setScriptsData = null,
  questionId = null,
  madmpSchemaId = null,
  setAnswer = null,
  formSelector = {},
  readonly,
}) {
  const { t } = useTranslation();
  const {
    formData, setFormData,
    dmpId,
    displayedResearchOutput,
    researchOutputs, setResearchOutputs,
    loadedTemplates, setLoadedTemplates,
  } = useContext(GlobalContext);
  const methods = useForm({ defaultValues: {} });
  const [loading, setLoading] = useState(false);
  const [error] = useState(null);
  const [template, setTemplate] = useState(null);
  const [templateId, setTemplateId] = useState(madmpSchemaId);
  const [externalImports, setExternalImports] = useState({});

  useEffect(() => {
    setLoading(true);
    if (fragmentId) {
      if (formData[fragmentId]) {
        if (loadedTemplates[formData[fragmentId].template_name]) {
          setTemplate(loadedTemplates[formData[fragmentId].template_name]);
        } else {
          service.getSchema(formData[fragmentId].schema_id).then((res) => {
            setTemplate(res.data);
            setExternalImports(template?.schema?.externalImports || {});
            setLoadedTemplates({ ...loadedTemplates, [res.data.name]: res.data });
          }).catch(console.error);
        }
        methods.reset(formData[fragmentId]);
      } else {
        service.getFragment(fragmentId).then((res) => {
          setTemplate(res.data.template);
          setLoadedTemplates({ ...loadedTemplates, [res.data.template.name]: res.data.template });
          setFormData({ [fragmentId]: res.data.fragment });
          if(res.data.answer_id) setAnswer({id: res.data.answer_id, fragment_id: res.data.fragment.id });
          methods.reset(res.data.fragment);
        }).catch(console.error);
      }
    } else {
      service.getSchema(templateId).then((res) => {
        setTemplate(res.data);
        setExternalImports(template?.schema?.externalImports || {});
        setLoadedTemplates({ ...loadedTemplates, [res.data.name]: res.data });
      }).catch(console.error);
    }
    setLoading(false);
  }, [fragmentId]);

  useEffect(() => {
    methods.reset(formData[fragmentId]);
  }, [formData[fragmentId]]);

  useEffect(() => {
    if (setScriptsData && template?.schema?.run && template.schema.run.length > 0) {
      setScriptsData({
        scripts: template.schema.run,
        apiClient: template.api_client
      });
    } else if (setScriptsData) {
      setScriptsData({ scripts: [] });
    }
    setExternalImports(template?.schema?.externalImports || {});
  }, [template])

  /**
   * It checks if the form is filled in correctly.
   * @param e - the event object
   */
  const handleSaveForm = async (data) => {
    setLoading(true);
    if (fragmentId) {
      let response;
      try {
        response = await service.saveFragment(fragmentId, data);
      } catch (error) {
        toast.error(getErrorMessage(error));
        return setLoading(false);
      }
      if (response.data.plan_title) {
        document.getElementById('plan-title').innerHTML = response.data.plan_title;
      }
      setFormData({ [fragmentId]: response.data.fragment });
    } else {
      handleSaveNew(data);
    }

    setLoading(false);
  };

  const handleSaveNew = (data) => {
    service.createFragment(data, templateId, dmpId, questionId, displayedResearchOutput.id).then((res) => {
      const updatedResearchOutput = { ...displayedResearchOutput };
      const fragment = res.data.fragment;
      const tplt = res.data.template;
      const answerId = res.data.answer_id;
      setLoadedTemplates({ ...loadedTemplates, [tplt.name]: tplt });
      setTemplate(tplt);
      setFormData({ [fragment.id]: fragment });
      setAnswer({ answer_id: answerId, question_id: questionId, fragment_id: fragment.id, madmp_schema_id: templateId });
      updatedResearchOutput.answers.push({ answer_id: answerId, question_id: questionId, fragment_id: fragment.id })
      setResearchOutputs(unionBy(researchOutputs, [updatedResearchOutput], 'id'));
    }).catch(console.error);
  }

  const setValues = (data) => Object.keys(data)
    .forEach((k) => methods.setValue(k, data[k], { shouldDirty: true }));

  return (
    <>
      {loading && (<CustomSpinner isOverlay={true} />)}
      {error && <p>error</p>}
      {!error && template && (
        <>
          {!readonly && Object.keys(externalImports)?.length > 0 && <ExternalImport fragment={methods.getValues()} setFragment={setValues} externalImports={externalImports} />}
          {!readonly && !fragmentId && <FormSelector
            classname={className}
            displayedTemplate={template}
            setTemplateId={setTemplateId}
            setTemplate={setTemplate}
            formSelector={formSelector}
          />}
          <FormProvider {...methods}>
            <form style={{ margin: '15px' }} onSubmit={methods.handleSubmit((data) => handleSaveForm(data))}>
              <div className="m-4">
                <FormBuilder
                  template={template.schema}
                  readonly={readonly}
                />
              </div>
              {!readonly && <CustomButton handleClick={null} title={t("Save")} buttonType="submit" position="center" />}
            </form>
          </FormProvider>
        </>
      )}
    </>
  );
}

export default DynamicForm;
