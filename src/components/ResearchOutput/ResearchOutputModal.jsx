import React, { useContext } from "react";
import { Modal, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Tabs } from "react-bootstrap";
import DOMPurify from "dompurify";
import AddResearchOutput from "./AddResearchOutput";
import ImportResearchOutput from "./ImportResearchOutput";
import * as styles from "../assets/css/modal.module.css";
import { GlobalContext } from "../context/Global";

/* This is a functional component in JavaScript React that renders a modal window with two tabs: "Créer" and "Importer". The component takes in three
props: `planId`, `handleClose`, and `show`. The `useTranslation` hook is used to translate the text displayed in the modal. The `Tabs` component from
`react-bootstrap` is used to create the two tabs, and the `AddResearchOutput` and `ImportResearchOutput` components are rendered within each tab. The
`planId`, `handleClose`, and `show` props are passed down to these child components. */
function ResearchOutputModal({ planId, handleClose, show, edit = false }) {
  const { t } = useTranslation();
  const { configuration } = useContext(GlobalContext);

  return (
    <Modal size="xl" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t(edit ? 'Edit research output' : `Create${configuration.enableImportResearchOutput ? ' or import' : ''} a research output`)}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "20px !important" }}>
        <div className={`col-md-12 ${styles.info_box}`}>
          <fieldset>
            <legend className={styles.legend}>
              Info
            </legend>
            <div
              className="col-md-12"
              style={{ margin: 0, wordWrap: 'break-word' }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize([t('Research product: dataset, software, workflow, sample, protocol, etc.<br />The creation of a research product allows you to describe the specific management of this product according to its nature or discipline.<br />You can create as many research products as you need.')]),
              }}
            >
            </div>
          </fieldset>
        </div>
        {edit ? (
          <AddResearchOutput planId={planId} handleClose={handleClose} show={show} inEdition={edit} />
        ) : (
          <Tabs className={`mb-3 ${styles.modal_tabs}`} defaultActiveKey={"create"} id="create-edit-research-output-tabs">
            <Tab eventKey={"create"} title={t("Create")}>
              <AddResearchOutput planId={planId} handleClose={handleClose} show={show} inEdition={edit} />
            </Tab>
            {configuration.enableImportResearchOutput && (<Tab eventKey="import" title={t("Import")}>
              <ImportResearchOutput planId={planId} handleClose={handleClose} show={show} />
            </Tab>)}
          </Tabs>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ResearchOutputModal;
