import React, { useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { Modal, Button } from 'react-bootstrap';
import FormBuilder from './FormBuilder';
import { useTranslation } from 'react-i18next';
import ImportExternal from '../ExternalImport/ImportExternal';
import { dirtyValues } from '../../utils/utils';


function ModalForm({ data, template, label, readonly, show, handleSave, handleClose, externalImport = [], mapping }) {
  const { t } = useTranslation();
  const methods = useForm();

  useEffect(() => {
    methods.reset(data);
  }, [data]);

  const onValid = (formData, event) => {
    handleSave(dirtyValues(methods.formState.dirtyFields, formData));
    methods.reset();
  };
  const onInvalid = () => {
    console.log("Modal form errors", methods.errors);
  };

  const handleModalSubmit = (e) => {
    e.stopPropagation();
    methods.handleSubmit(onValid, onInvalid)(e);
  }

  const handleModalClose = () => {
    handleClose();
    methods.reset();
  }

  const setValues = (data) => {
    Object.keys(data).forEach((k) => {
      methods.setValue(k, data[k], { shouldDirty: true })
    })
  }

  return (
    <Modal className="dmpopidor-branding" show={show} backdrop={ 'static' } onHide={handleModalClose}>
      <Modal.Header>
        <Modal.Title style={{ color: "var(--rust)", fontWeight: "bold" }}>{label}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "20px !important" }}>
        {externalImport?.length > 0 && <ImportExternal fragment={methods.getValues()} setFragment={setValues} externalImport={externalImport} mapping={mapping} />}
        <FormProvider {...methods}>
          <form name="modal-form" id="modal-form" style={{ margin: '15px' }} onSubmit={(e) => handleModalSubmit(e)}>
            <FormBuilder
              template={template.schema}
              readonly={readonly}
            />
          </form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleModalClose}>
          {t("Close")}
        </Button>
        {!readonly && (
          <Button bsStyle="primary" type="submit" form="modal-form">
            {t('Save')}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default ModalForm;
