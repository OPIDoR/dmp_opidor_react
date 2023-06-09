import React, {
    useContext, useEffect, useState,
  } from 'react';
  import toast from 'react-hot-toast';
  import { useTranslation } from "react-i18next";
  
  import BuilderForm from './BuilderForm.jsx';
  import { GlobalContext } from '../context/Global.jsx';
  import { getFragment, loadNewForm, saveForm } from '../../services/DmpServiceApi.js';
  import CustomSpinner from '../Shared/CustomSpinner.jsx';
  import CustomButton from '../Styled/CustomButton.jsx';
  
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
      loadedTemplates, setLoadedTemplates,
    } = useContext(GlobalContext);
    const [loading, setLoading] = useState(true);
    const [error] = useState(null);
    const [template, setTemplate] = useState(null);

    useEffect(() => {
      if(fragmentId) {
        getFragment(fragmentId).then((res) => {
          setTemplate(res.data.schema);
          setLoadedTemplates({...loadedTemplates, [res.data.fragment.schema_id] : res.data.schema});
          setFormData({ [fragmentId]: res.data.fragment });
        }).catch(console.error)
          .finally(() => setLoading(false));
      } else {
        loadNewForm(planId, questionId, displayedResearchOutput.id, madmpSchemaId, dmpId, locale).then((res) => {
          setTemplate(res.data.schema);
          const fragment = res.data.fragment;
          setLoadedTemplates({...loadedTemplates, [fragment.schema_id] : res.data.schema});
          setFormData({ [fragment.id]: fragment });
          setFragmentId(fragment.id);
          setAnswerId(fragment.answer_id);
        }).catch(console.error)
          .finally(() => setLoading(false));

      }
    }, []);
  
    /**
     * It checks if the form is filled in correctly.
     * @param e - the event object
     */
    const handleSaveForm = (e) => {
      e.preventDefault();
      setLoading(true);
      console.log(formData[fragmentId]);
      saveForm(fragmentId, formData[fragmentId]).then((res) => {
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
  