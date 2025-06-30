import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaXmark } from 'react-icons/fa6';

import * as styles from '../assets/css/form_selector.module.css';
import CustomSpinner from '../Shared/CustomSpinner';
import service from "../../services/service";
import { GlobalContext } from "../context/Global";
import CustomSelect from "../Shared/CustomSelect";

const headerStyle = {
  color: 'var(--white)',
  backgroundColor: 'var(--dark-blue)',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 10px',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  borderRadius: '10px 10px 0 0',
  alignItems: 'center',
};

function FormSelector({ classname, dataType, displayedTemplate, setTemplate, setTemplateId, formSelector }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const {
    setFormSelector,
    loadedTemplates, setLoadedTemplates,
  } = useContext(GlobalContext);

  useEffect(() => {
    service.getAvailableForms(classname, dataType).then(({ data }) => {
      setAvailableTemplates(data);
      setFormSelector((prev) => ({ ...prev, [classname]: data?.length > 1 }));
      data.forEach((template) => {
        setLoadedTemplates({ ...loadedTemplates, [template.name]: template });
        if (template.name === displayedTemplate.name) setSelectedTemplate(template);
      });
    })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [classname, dataType, displayedTemplate])

  const handleSelectTemplate = (e) => {
    setSelectedTemplate(e.object);
    setLoading(true)
    service.getSchemaByName(e.object.name).then((res) => {
      setTemplate(res.data);
      setTemplateId(res.data.id);
      setLoadedTemplates({ ...loadedTemplates, [e.object.name]: res.data });
    })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  return (
    <>
      {availableTemplates.length > 1 && (
        <>
          {formSelector.shown && (
            <div className={styles.container} style={{ position: 'relative' }}>
              {selectedTemplate && (
                <>
                  {loading && (<CustomSpinner isOverlay={true}></CustomSpinner>)}
                  <div
                    style={{ ...headerStyle }}
                  >
                    <label htmlFor={classname} style={{fontSize: 'large'}}>{t('Please select a form to answer the question (the Standard form is displayed by default)')}</label>
                    <div id="header-actions">
                      <ReactTooltip
                        id={`${classname}-form-selector-close-button`}
                        place="bottom"
                        effect="solid"
                        variant="info"
                        content={t('Close')}
                      />
                      <FaXmark
                        data-tooltip-id={`${classname}-form-selector-close-button`}
                        onClick={() => formSelector.hide()}
                        variant="info"
                        size={24}
                        style={{ margin: '8px 5px 0 5px', cursor: 'pointer', color: 'white' }}
                      />
                    </div>
                  </div>
                  <p style={{ color: 'var(--white)', padding: '0 10px' }}>
                    <i>{t('Select a form from the list to view it. Please note that it is no longer possible to change a form once it has been saved.')}</i>
                  </p>
                  <CustomSelect
                    propName={classname}
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
          )}
        </>
      )}
    </>
  )
}

export default FormSelector;
