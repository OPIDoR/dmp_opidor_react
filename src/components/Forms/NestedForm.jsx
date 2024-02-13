import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';

import styles from '../assets/css/form.module.css';
import FormBuilder from './FormBuilder';

function NestedForm({ propName, data, template, readonly, handleSave, handleClose }) {
  const { t } = useTranslation();
  const methods = useForm({ defaultValues: data });

  useEffect(() => {
    methods.reset(methods.formState.dirtyFields);
  }, [data]);


  const onValid = (formData, event) => {
    handleSave(formData);
  };
  const onInvalid = () => {
    console.log("Modal form errors", methods.errors);
  };

  const handleNestedFormSubmit = (e) => {
    e.stopPropagation();
    methods.handleSubmit(onValid, onInvalid)(e);
  }

  return (
    createPortal(
      <FormProvider {...methods}>
        <form name="nested-form" id="nested-form" style={{ margin: '15px' }} onSubmit={(e) => handleNestedFormSubmit(e)}>
          <FormBuilder
            template={template.schema}
            readonly={readonly}
          />
        </form>
        <div className={styles.nestedFormFooter}>
          <Button onClick={handleClose} style={{ margin: '0 5px 0 5px' }}>
            {t("Cancel")}
          </Button>
          {!readonly && (
            <Button bsStyle="primary" type="submit" form="nested-form" style={{ margin: '0 5px 0 5px' }}>
              {t('Save')}
            </Button>
          )}
        </div>
      </FormProvider>,
      document.getElementById(`nested-form-${propName}`)
    )
  )
}


export default NestedForm;
