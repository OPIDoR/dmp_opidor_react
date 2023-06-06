import React from "react";
import { Modal, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Tabs } from "react-bootstrap";
import AddResearchOutput from "./AddResearchOutput";
import ImportResearchOutput from "./ImportResearchOutput";
import styles from "../assets/css/form.module.css";

/* This is a functional component in JavaScript React that renders a modal window with two tabs: "Créer" and "Importer". The component takes in three
props: `planId`, `handleClose`, and `show`. The `useTranslation` hook is used to translate the text displayed in the modal. The `Tabs` component from
`react-bootstrap` is used to create the two tabs, and the `AddResearchOutput` and `ImportResearchOutput` components are rendered within each tab. The
`planId`, `handleClose`, and `show` props are passed down to these child components. */
function ResearchOutputModal({ planId, handleClose, show }) {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={handleClose}>
      {/* <Modal.Header closeButton>
        <Modal.Title>{t("Research Product")}</Modal.Title>
      </Modal.Header> */}
      <Modal.Body style={{ padding: "20px !important" }}>
        <div className={`col-md-12 ${styles.funder}`}>
          <fieldset className="sub-fragment registry">
            <legend className={`sub-fragment registry ${styles.legend}`}>
              Info
              <a href="#" style={{ marginLeft: "10px" }}>
                <span className="registry-info fas fa-info-circle" />
              </a>
            </legend>
            <div className="col-md-12 fragment-display">
              <div className="fragment-property">
                <p className="property-label">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                  ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book{" "}
                </p>
              </div>
            </div>
          </fieldset>
          <br></br>
        </div>
        <Tabs defaultActiveKey="create" id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="create" title={t("Create")}>
            <AddResearchOutput planId={planId} handleClose={handleClose} show={show} />
          </Tab>
          <Tab eventKey="import" title={t("Import")}>
            <ImportResearchOutput planId={planId} handleClose={handleClose} show={show} />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default ResearchOutputModal;
