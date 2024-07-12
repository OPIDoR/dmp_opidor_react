import React, { useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FormBuilder from './FormBuilder';
import { useTranslation } from 'react-i18next';
import { ExternalImport } from '../ExternalImport';

function ModalForm({ data, template, label, readonly, show, handleSave, handleClose }) {
  const { t } = useTranslation();
  const methods = useForm({ defaultValues: data });

  const externalImports = template?.schema?.externalImports || {};

  useEffect(() => {
    methods.reset(methods.formState.dirtyFields);
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

  const setValues = (data) => Object.keys(data)
    .forEach((k) => methods.setValue(k, data[k], { shouldDirty: true }));

  return (
    <Modal size="xl" className="dmpopidor-branding" show={show} backdrop={ 'static' } onHide={handleModalClose}>
      <Modal.Header>
        <Modal.Title style={{ color: "var(--rust)", fontWeight: "bold" }}>{label}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "20px !important" }}>
        {Object.keys(externalImports)?.length > 0 && <ExternalImport fragment={methods.getValues()} setFragment={setValues} externalImports={externalImports} />}
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
          <Button variant="primary" type="submit" form="modal-form">
            {t('Save')}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default ModalForm;
