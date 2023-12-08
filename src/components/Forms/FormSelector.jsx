import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from '../assets/css/form_selector.module.css';
import CustomSpinner from '../Shared/CustomSpinner';
import service from "../../services/service";
import { GlobalContext } from "../context/Global";
import CustomSelect from "../Shared/CustomSelect";

function FormSelector({ className, selectedTemplateId, fragmentId, setFragment, setTemplate }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const {
    loadedTemplates, setLoadedTemplates,
  } = useContext(GlobalContext);

  useEffect(() => {
    service.getSchemasByClass(className).then((res) => {
      setAvailableTemplates(res.data);
      res.data.forEach((tplt) => {
        setLoadedTemplates({ ...loadedTemplates, [tplt.id]: tplt.schema });
        if (tplt.id === selectedTemplateId) setSelectedTemplate(tplt);
      });
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [className, selectedTemplateId])


  const handleSelectTemplate = (e) => {
    setSelectedTemplate(e.object);
    setLoading(true)
    service.changeForm(fragmentId, e.value).then((res) => {
      setFragment(res.data.fragment);
      setTemplate(res.data.template)
    }).catch(console.error)
      .finally(() => setLoading(false));
  }
  return (
    <div className={styles.container} style={{ position: 'relative' }}>
      {loading && (<CustomSpinner isOverlay={true}></CustomSpinner>)}
      {availableTemplates.length > 1 && selectedTemplate && (
        <>
          <label htmlFor={className} className={styles.label}>{t('You can pick a different question form')}</label>
          <CustomSelect
            propName={className}
            onSelectChange={handleSelectTemplate}
            options={availableTemplates.map((tplt) => ({
              value: tplt.id,
              label: tplt.label,
              object: tplt,
            }))}
            selectedOption={selectedTemplate}
          />
        </>
      )}
    </div>
  )
}

export default FormSelector;
