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
import { writePlan } from "../../services";
import useSectionsMode, { MODE_MAPPING } from '../../hooks/useSectionsMode.js';

function DynamicForm({
  fragmentId,
  className,
  setScriptsData = null,
  questionId = null,
  madmpSchemaId = null,
  setFragmentId = null,
  setAnswerId = null,
  formSelector = {},
  readonly,
  fetchAnswersData = false,
}) {
  const { t } = useTranslation();
  const {
    formData, setFormData,
    dmpId,
    displayedResearchOutput,
    researchOutputs, setResearchOutputs,
    loadedTemplates, setLoadedTemplates,
    setQuestionsWithGuidance,
    planData,
  } = useContext(GlobalContext);
  const { mode } = useSectionsMode();
  const methods = useForm({ defaultValues: formData });
  const [loading, setLoading] = useState(false);
  const [error] = useState(null);
  const [template, setTemplate] = useState(null);
  const [externalImports, setExternalImports] = useState({});

  useEffect(() => {
    setLoading(true);
    if (mode === MODE_MAPPING) {
      service.getSchema(madmpSchemaId).then((res) => {
        setTemplate(res.data);
        // setExternalImports(template?.schema?.externalImports || {});
        setLoadedTemplates({ ...loadedTemplates, [template?.name]: res.data });
      }).catch(console.error)
        .finally(() => setLoading(false));
    } else {
      if (fragmentId) {
        if (formData[fragmentId]) {
          if (loadedTemplates[formData[fragmentId].template_name]) {
            setTemplate(loadedTemplates[formData[fragmentId].template_name]);
          } else {
            service.getSchemaByName(formData[fragmentId].template_name).then((res) => {
              setTemplate(res.data);
              setExternalImports(template?.schema?.externalImports || {});
              setLoadedTemplates({ ...loadedTemplates, [template?.name]: res.data });
            }).catch(console.error)
              .finally(() => setLoading(false));
          }
          methods.reset(formData[fragmentId]);
        } else {
          service.getFragment(fragmentId).then((res) => {
            setTemplate(res.data.template);
            setLoadedTemplates({ ...loadedTemplates, [res.data.template.name]: res.data.schema });
            setFormData({ [fragmentId]: res.data.fragment });
            methods.reset(res.data.fragment);
          }).catch(console.error)
            .finally(() => setLoading(false));
        }
      } else {
        service.createFragment(null, madmpSchemaId, dmpId, questionId, displayedResearchOutput.id).then((res) => {
          const updatedResearchOutput = { ...displayedResearchOutput };
          setTemplate(res.data.template);
          const fragment = res.data.fragment;
          const answerId = res.data.answer_id
          setLoadedTemplates({ ...loadedTemplates, [fragment?.template.name]: res?.data?.schema });
          setFormData({ [fragment.id]: fragment });
          setFragmentId(fragment.id);
          setAnswerId(answerId);
          updatedResearchOutput.answers.push({ answer_id: answerId, question_id: questionId, fragment_id: fragment.id })
          setResearchOutputs(unionBy(researchOutputs, [updatedResearchOutput], 'id'));
        }).catch(console.error)
          .finally(() => setLoading(false));
      }

      if (fetchAnswersData) {
        writePlan.getPlanData(planData.id)
          .then((res) => {
            const { questions_with_guidance } = res.data;
            setQuestionsWithGuidance(questions_with_guidance || []);
          })
          .catch(() => setQuestionsWithGuidance([]));
        setLoading(false);
      }
    }
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
      {loading && (<CustomSpinner isOverlay={true} />)}
      {error && <p>error</p>}
      {!error && template && (
        <>
          {!readonly && Object.keys(externalImports)?.length > 0 && <ExternalImport fragment={methods.getValues()} setFragment={setValues} externalImports={externalImports} />}
          {!readonly && <FormSelector
            className={className}
            selectedTemplateName={template.name}
            fragmentId={fragmentId}
            setFragment={methods.reset}
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
