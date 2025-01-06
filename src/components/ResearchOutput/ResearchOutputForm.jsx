import React, { useContext } from "react";
import { Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Tabs } from "react-bootstrap";
import AddResearchOutput from "./AddResearchOutput";
import ImportResearchOutput from "./ImportResearchOutput";
import * as styles from "../assets/css/modal.module.css";
import { GlobalContext } from "../context/Global";

/* This is a functional component in JavaScript React that renders a modal window with two tabs: "Créer" and "Importer". The component takes in three
props: `planId`, `handleClose`, and `show`. The `useTranslation` hook is used to translate the text displayed in the modal. The `Tabs` component from
`react-bootstrap` is used to create the two tabs, and the `AddResearchOutput` and `ImportResearchOutput` components are rendered within each tab. The
`planId`, `handleClose`, and `show` props are passed down to these child components. */
function ResearchOutputForm({ planId, handleClose, edit = false }) {
  const { t } = useTranslation();
  const { configuration } = useContext(GlobalContext);

  return (
    <>
      {edit ? (
        <AddResearchOutput planId={planId} handleClose={handleClose} inEdition={edit} />
      ) : (
        <Tabs className={`mb-3 ${styles.modal_tabs}`} defaultActiveKey={"create"} id="create-edit-research-output-tabs">
          <Tab eventKey={"create"} title={t("Create")}>
            <AddResearchOutput planId={planId} handleClose={handleClose} inEdition={edit} />
          </Tab>
          {configuration.enableImportResearchOutput && (<Tab eventKey="import" title={t("Import")}>
            <ImportResearchOutput planId={planId} handleClose={handleClose} />
          </Tab>)}
        </Tabs>
      )}
    </>
  );
}

export default ResearchOutputForm;
