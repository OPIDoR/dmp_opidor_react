import React, {
  useContext, useEffect, useState,
} from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import unionBy from 'lodash.unionby';

import FormBuilder from './FormBuilder';
import { GlobalContext } from '../context/Global';
import { service } from '../../services';
import CustomSpinner from '../Shared/CustomSpinner';
import CustomButton from '../Styled/CustomButton';
import FormSelector from './FormSelector';
import { ExternalImport } from '../ExternalImport';
import { getErrorMessage } from '../../utils/utils';

function DynamicForm({
  fragmentId,
  className,
  setScriptsData = null,
  questionId = null,
  madmpSchemaId = null,
  setFragmentId = null,
  setAnswerId = null,
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
  const methods = useForm({ defaultValues: formData });
  const [loading, setLoading] = useState(false);
  const [error] = useState(null);
  const [template, setTemplate] = useState(null);
  const [externalImports, setExternalImports] = useState({});

  useEffect(() => {
    setLoading(true);
    if (fragmentId) {
      if (formData[fragmentId]) {
        if (loadedTemplates[formData[fragmentId].schema_id]) {
          setTemplate(loadedTemplates[formData[fragmentId].schema_id]);
        } else {
          service.getSchema(formData[fragmentId].schema_id).then((res) => {
            setTemplate(res.data);
            setExternalImports(template?.schema?.externalImports || {});
            setLoadedTemplates({ ...loadedTemplates, [formData[fragmentId].schema_id]: res.data });
          }).catch(console.error)
            .finally(() => setLoading(false));
        }
        methods.reset(formData[fragmentId]);
      } else {
        service.getFragment(fragmentId).then((res) => {
          setTemplate(res.data.template);
          setLoadedTemplates({ ...loadedTemplates, [res.data.fragment.schema_id]: res.data.schema });
          setFormData({ [fragmentId]: res.data.fragment });
          methods.reset(res.data.fragment);
        }).catch(console.error)
          .finally(() => setLoading(false));
      }
    } else {
      service.createFragment(null, madmpSchemaId, dmpId, questionId, displayedResearchOutput.id).then((res) => {
        const updatedResearchOutput = { ...displayedResearchOutput };
        setTemplate(res.data.template);
        const { fragment } = res.data;
        const answerId = res.data.answer_id;
        setLoadedTemplates({ ...loadedTemplates, [fragment.schema_id]: res.data.schema });
        setFormData({ [fragment.id]: fragment });
        setFragmentId(fragment.id);
        setAnswerId(answerId);
        updatedResearchOutput.answers.push({ answer_id: answerId, question_id: questionId, fragment_id: fragment.id });
        setResearchOutputs(unionBy(researchOutputs, [updatedResearchOutput], 'id'));
      }).catch(console.error)
        .finally(() => setLoading(false));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    methods.reset(formData[fragmentId]);
  }, [formData[fragmentId]]);

  useEffect(() => {
    if (setScriptsData && template?.schema?.run && template.schema.run.length > 0) {
      setScriptsData({
        scripts: template.schema.run,
        apiClient: template.api_client,
      });
    }
    setExternalImports(template?.schema?.externalImports || {});
  }, [template]);

  /**
   * It checks if the form is filled in correctly.
   * @param e - the event object
   */
  const handleSaveForm = async (data) => {
    setLoading(true);

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

    setLoading(false);
  };

  const setValues = (data) => Object.keys(data)
    .forEach((k) => methods.setValue(k, data[k], { shouldDirty: true }));

  return (
    <>
      {loading && (<CustomSpinner isOverlay />)}
      {error && <p>error</p>}
      {!error && template && (
        <>
          {Object.keys(externalImports)?.length > 0 && <ExternalImport fragment={methods.getValues()} setFragment={setValues} externalImports={externalImports} />}
          <FormSelector
            className={className}
            selectedTemplateId={template.id}
            fragmentId={fragmentId}
            setFragment={methods.reset}
            setTemplate={setTemplate}
          />
          <FormProvider {...methods}>
            <form style={{ margin: '15px' }} onSubmit={methods.handleSubmit((data) => handleSaveForm(data))}>
              <div className="m-4">
                <FormBuilder
                  template={template.schema}
                  readonly={readonly}
                />
              </div>
              <CustomButton handleClick={null} title={t('Save')} buttonType="submit" position="center" />
            </form>
          </FormProvider>
        </>
      )}
    </>
  );
}

export default DynamicForm;
