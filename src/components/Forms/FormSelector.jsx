import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaShuffle } from "react-icons/fa6";
import { Button } from 'react-bootstrap';

import styles from '../assets/css/form_selector.module.css';
import CustomSpinner from '../Shared/CustomSpinner';
import service from "../../services/service";
import { GlobalContext } from "../context/Global";
import CustomSelect from "../Shared/CustomSelect";

function FormSelector({ className, selectedTemplateId, fragmentId, setFragment, setTemplate, formSelector }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const {
    loadedTemplates, setLoadedTemplates, locale
  } = useContext(GlobalContext);

  useEffect(() => {
    service.getSchemasByClass(className).then((res) => {
      setAvailableTemplates(res.data);
      res.data.forEach((tplt) => {
        setLoadedTemplates({ ...loadedTemplates, [tplt.id]: tplt.schema });
        if (tplt.id === selectedTemplateId) setSelectedTemplate(tplt);
      });
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [className, selectedTemplateId])


  const handleSelectTemplate = (e) => {
    setSelectedTemplate(e.object);
  }

  const handleChangeForm = () => {
    setLoading(true)
    service.changeForm(fragmentId, selectedTemplate.id, locale).then((res) => {
      setFragment(res.data.fragment);
      setTemplate(res.data.template)
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }

  return (
    <>
      {availableTemplates.length > 1 && (
        <>
          {formSelector.show && (
            <div className={styles.container} style={{ position: 'relative' }}>
              {selectedTemplate && (
                <>
                  {loading && (<CustomSpinner isOverlay={true}></CustomSpinner>)}
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
                  <div className={styles.form_selector_footer}>
                    <Button
                      onClick={() => {
                        formSelector.setFillFormSelectorIconColor("var(--dark-blue)");
                        formSelector.setShowFormSelectorModal(false);
                      }}
                      style={{ margin: '0 5px 0 5px' }}
                    >
                      {t("Close")}
                    </Button>
                    <Button onClick={handleChangeForm} bsStyle="primary" type="submit" style={{ margin: '0 5px 0 5px' }}>
                      {t('Save')}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default FormSelector;
