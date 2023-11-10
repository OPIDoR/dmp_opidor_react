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

  return (
    <Modal show={show} onHide={handleClose}>
      <form style={{ margin: '15px' }} onSubmit={methods.handleSubmit((data) => handleSave(data))}>
        <Modal.Header>
          <Modal.Title style={{ color: "var(--rust)", fontWeight: "bold" }}>{label}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px !important" }}>
          {withImport && <ImportExternal fragment={methods.value} setFragment={methods.reset}></ImportExternal>}
          <FormProvider {...methods}>
            <FormBuilder
              template={template}
              readonly={readonly}
            />
          </FormProvider>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("Close")}
          </Button>
          {!readonly && (
            // <Button variant="primary" onClick={() => handleSave(modalData)}>
            //   {t("Save")}
            // </Button>
            <input type="submit" className="btn btn-primary" value="Save" />
          )}
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default ModalForm;
