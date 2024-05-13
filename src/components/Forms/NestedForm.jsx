import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';

import { ExternalImport } from '../ExternalImport';
import * as styles from '../assets/css/form.module.css';
import FormBuilder from './FormBuilder';
import useSectionsMapping from '../../hooks/useSectionsMapping';

function NestedForm({ propName, data, template, readonly, handleSave, handleClose, jsonPath = null }) {
  const { t } = useTranslation();
  const methods = useForm({ defaultValues: data });
  const { mapping } = useSectionsMapping();

  const externalImports = template?.schema?.externalImports || {};

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

  const setValues = (data) => Object.keys(data)
    .forEach((k) => methods.setValue(k, data[k], { shouldDirty: true }));

  const targetElement = document.getElementById(`nested-form-${propName}`);
  if (!targetElement) return null;
 
  return (
    createPortal(
      <>
        {!mapping && Object.keys(externalImports)?.length > 0 (
          <div style={{ marginTop: '20px' }}>
            <ExternalImport fragment={methods.getValues()} setFragment={setValues} externalImports={externalImports} />
          </div>
        )}
        <FormProvider {...methods}>
          <form name="nested-form" id="nested-form" style={{ margin: '15px' }} onSubmit={(e) => handleNestedFormSubmit(e)}>
            <FormBuilder
              template={template.schema}
              readonly={readonly}
              jsonPath={jsonPath}
            />
          </form>
          <div className={styles.nestedFormFooter}>
            {!mapping && 
              <>
                <Button onClick={handleClose} style={{ margin: '0 5px 0 5px' }}>
                  {t("Cancel")}
                </Button>
                {!readonly && (
                  <Button bsStyle="primary" type="submit" form="nested-form" style={{ margin: '0 5px 0 5px' }}>
                    {t('Save')}
                  </Button>
                )}
              </>
            }
          </div>
        </FormProvider>
      </>,
      targetElement
    )
  )
}

export default NestedForm;
