import React, {
  useContext, useEffect, useState,
} from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";

import BuilderForm from './BuilderForm.jsx';
import { GlobalContext } from '../context/Global.jsx';
import { service } from '../../services';
import CustomSpinner from '../Shared/CustomSpinner.jsx';
import CustomButton from '../Styled/CustomButton.jsx';
import { unionBy } from 'lodash';

function DynamicForm({
  fragmentId,
  planId = null,
  questionId = null,
  madmpSchemaId = null,
  setFragmentId = null,
  setAnswerId = null,
  readonly,
}) {
  const { t } = useTranslation();
  const {
    locale,
    formData, setFormData,
    dmpId,
    displayedResearchOutput,
    researchOutputs, setResearchOutputs,
    loadedTemplates, setLoadedTemplates,
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    if (fragmentId) {
      if (formData[fragmentId]) {
        service.getSchema(formData[fragmentId].schema_id).then((res) => {
          setTemplate(res.data);
          setLoadedTemplates({...loadedTemplates, [formData[fragmentId].schema_id] : res.data});
        });
        setLoading(false);
      } else {
        service.getFragment(fragmentId).then((res) => {
          setTemplate(res.data.schema);
          setLoadedTemplates({ ...loadedTemplates, [res.data.fragment.schema_id]: res.data.schema });
          setFormData({ [fragmentId]: res.data.fragment });
        }).catch(console.error)
          .finally(() => setLoading(false));
      }
    } else {
      service.loadNewForm(planId, questionId, displayedResearchOutput.id, madmpSchemaId, dmpId, locale).then((res) => {
        const updatedResearchOutput = { ...displayedResearchOutput };
        setTemplate(res.data.schema);
        const fragment = res.data.fragment;
        const answerId = res.data.answer_id
        setLoadedTemplates({ ...loadedTemplates, [fragment.schema_id]: res.data.schema });
        setFormData({ [fragment.id]: fragment });
        setFragmentId(fragment.id);
        setAnswerId(answerId);
        updatedResearchOutput.answers.push({ answer_id: answerId, question_id: questionId, fragment_id: fragment.id })
        setResearchOutputs(unionBy(researchOutputs, [updatedResearchOutput], 'id'));
      }).catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

  /**
   * It checks if the form is filled in correctly.
   * @param e - the event object
   */
  const handleSaveForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    let response;
    try {
      response = await service.saveForm(fragmentId, formData[fragmentId]);
    } catch (error) {
      let errorMessage = t("An error occured during form saving");

      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = error.request;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      return setLoading(false);
    }

    if(response.data.plan_title) {
      document.getElementById('plan-title').innerHTML = response.data.plan_title;
    }
    setFormData({ [fragmentId]: response.data.fragment });

    setLoading(false);
  };

  return (
    <>
      {loading && (<CustomSpinner></CustomSpinner>)}
      {error && <p>error</p>}
      {!error && template && (
        <div style={{ margin: '15px' }}>
          <div className="row"></div>
          <div className="m-4">
            <BuilderForm
              shemaObject={template}
              level={1}
              fragmentId={fragmentId}
              readonly={readonly}
            ></BuilderForm>
          </div>
          <CustomButton handleClick={handleSaveForm} title={t("Save")} position="center"></CustomButton>
        </div>
      )}
    </>
  );
}

export default DynamicForm;
