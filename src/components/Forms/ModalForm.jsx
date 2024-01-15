import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { Modal, Button } from 'react-bootstrap';
import FormBuilder from './FormBuilder';
import { useTranslation } from 'react-i18next';
import ImportExternal from '../ExternalImport/ImportExternal';


function ModalForm({ data, template, label, readonly, show, handleSave, handleClose, withImport = false }) {
  const { t } = useTranslation();
  const methods = useForm();

  useEffect(() => {
    methods.reset(data);
  }, [data]);

  const onValid = (formData, event) => {
    handleSave(formData);
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

  return (
    <Modal className="dmpopidor-branding" show={show} onHide={handleModalClose}>
      <Modal.Header>
        <Modal.Title style={{ color: "var(--rust)", fontWeight: "bold" }}>{label}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "20px !important" }}>
        {withImport && <ImportExternal fragment={methods.getValues()} setFragment={methods.reset}></ImportExternal>}
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
        <Button onClick={handleModalClose} style={{ margin: '0 5px 0 5px' }}>
          {t("Close")}
        </Button>
        {!readonly && (
          <Button bsStyle="primary" type="submit" form="modal-form" style={{ margin: '0 5px 0 5px' }}>
            {t('Save')}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default ModalForm;
