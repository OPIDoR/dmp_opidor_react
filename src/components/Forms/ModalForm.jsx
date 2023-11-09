import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import FormBuilder from './FormBuilder';
import { useTranslation } from 'react-i18next';
import ImportExternal from '../ExternalImport/ImportExternal';


function ModalForm({ fragmentId, data, template, label, readonly, show, handleSave, handleClose, withImport = false }) {
  const { t } = useTranslation();
  const [modalData, setModalData] = useState({});

  const handleModalValueChange = (propName, value) => {
    setModalData({ ...modalData, [propName]: value });
  }
  useEffect(() => {
    setModalData(data);
  }, [data]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title style={{ color: "var(--rust)", fontWeight: "bold" }}>{label}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "20px !important" }}>
        {withImport && <ImportExternal fragment={modalData} setFragment={setModalData}></ImportExternal>}
        <FormBuilder
          fragment={modalData}
          handleChangeValue={handleModalValueChange}
          template={template}
          fragmentId={fragmentId}
          readonly={readonly}
        ></FormBuilder>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t("Close")}
        </Button>
        {!readonly && (
          <Button variant="primary" onClick={() => handleSave(modalData)}>
            {t("Save")}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default ModalForm;
