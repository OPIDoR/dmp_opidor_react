import React, {
    useContext, useEffect, useState,
  } from 'react';
  import toast from 'react-hot-toast';
  import { useTranslation } from "react-i18next";
  
  import BuilderForm from './BuilderForm.jsx';
  import { GlobalContext } from '../context/Global.jsx';
  import { getFragment, saveForm } from '../../services/DmpServiceApi.js';
  import CustomSpinner from '../Shared/CustomSpinner.jsx';
  import CustomButton from '../Styled/CustomButton.jsx';
  
  function DynamicForm({fragmentId}) {
    const { t } = useTranslation();
    const {
      formData, setFormData, loadedTemplates, setLoadedTemplates,
    } = useContext(GlobalContext);
    const [loading, setLoading] = useState(true);
    const [error] = useState(null);
    const [template, setTemplate] = useState(null);
    useEffect(() => {
      getFragment(fragmentId).then((res) => {
        setTemplate(res.data.schema);
        setLoadedTemplates({...loadedTemplates, [res.data.fragment.schema_id] : res.data.schema});
        setFormData({ [fragmentId]: res.data.fragment });
      }).catch(console.error)
        .finally(() => setLoading(false));
    }, [fragmentId]);
  
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
              ></BuilderForm>
            </div>
            <CustomButton handleClick={handleSaveForm} title={t("Save")} position="center"></CustomButton>
          </div>
        )}
      </>
    );
  }
  
  export default DynamicForm;
  