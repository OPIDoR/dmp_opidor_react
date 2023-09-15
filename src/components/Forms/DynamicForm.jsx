import React, {
  useContext, useEffect, useState,
} from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";

import FormBuilder from './FormBuilder.jsx';
import { GlobalContext } from '../context/Global.jsx';
import { getFragment, getSchema, loadNewForm, saveForm } from '../../services/DmpServiceApi.js';
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
  const [fragment, setFragment] = useState({});

  useEffect(() => {
    if (fragmentId) {
      if (formData[fragmentId]) {
        getSchema(formData[fragmentId].schema_id).then((res) => {
          setTemplate(res.data);
          setLoadedTemplates({...loadedTemplates, [formData[fragmentId].schema_id] : res.data});
        });
        setLoading(false);
      } else {
        getFragment(fragmentId).then((res) => {
          setTemplate(res.data.schema);
          setLoadedTemplates({ ...loadedTemplates, [res.data.fragment.schema_id]: res.data.schema });
          setFormData({ [fragmentId]: res.data.fragment });
          setFragment(res.data.fragment);
        }).catch(console.error)
          .finally(() => setLoading(false));
      }
    } else {
      loadNewForm(planId, questionId, displayedResearchOutput.id, madmpSchemaId, dmpId, locale).then((res) => {
        const updatedResearchOutput = { ...displayedResearchOutput };
        setTemplate(res.data.schema);
        const fragment = res.data.fragment;
        const answerId = res.data.answer_id
        setLoadedTemplates({ ...loadedTemplates, [fragment.schema_id]: res.data.schema });
        setFormData({ [fragment.id]: fragment });
        setFragment(fragment);
        setFragmentId(fragment.id);
        setAnswerId(answerId);
        updatedResearchOutput.answers.push({ answer_id: answerId, question_id: questionId, fragment_id: fragment.id })
        setResearchOutputs(unionBy(researchOutputs, [updatedResearchOutput], 'id'));
      }).catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

  const handleChangeValue = (propName, value) => {
    const updatedFragment = { ...fragment };
    updatedFragment[propName] = value;
    setFragment(updatedFragment);
    setFormData({ ...formData,  [fragmentId] : updatedFragment});
  }

  /**
   * It checks if the form is filled in correctly.
   * @param e - the event object
   */
  const handleSaveForm = (e) => {
    e.preventDefault();
    setLoading(true);
    saveForm(fragmentId, formData[fragmentId]).then((res) => {
      if(res.data.plan_title) {
        document.getElementById('plan-title').innerHTML = res.data.plan_title;
      }
      setFormData({ [fragmentId]: res.data.fragment });
    }).catch((res) => {
      toast.error(res.data.message);
    })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {loading && (<CustomSpinner></CustomSpinner>)}
      {error && <p>error</p>}
      {!error && template && fragment && (
        <div style={{ margin: '15px' }}>
          <div className="row"></div>
          <div className="m-4">
            <FormBuilder
              fragment={fragment}
              handleChangeValue={handleChangeValue}
              template={template}
              level={1}
              fragmentId={fragmentId}
              readonly={readonly}
            ></FormBuilder>
          </div>
          <CustomButton handleClick={handleSaveForm} title={t("Save")} position="center"></CustomButton>
        </div>
      )}
    </>
  );
}

export default DynamicForm;
