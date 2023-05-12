import React from "react";
import { Modal, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Tabs } from "react-bootstrap";
import AddSearchProduct from "./AddSearchProduct";
import ImportSearchProduct from "./ImportSearchProduct";

/* This is a functional component in JavaScript React that renders a modal window with two tabs: "Créer" and "Importer". The component takes in three
props: `planId`, `handleClose`, and `show`. The `useTranslation` hook is used to translate the text displayed in the modal. The `Tabs` component from
`react-bootstrap` is used to create the two tabs, and the `AddSearchProduct` and `ImportSearchProduct` components are rendered within each tab. The
`planId`, `handleClose`, and `show` props are passed down to these child components. */
function SearchProduct({ planId, handleClose, show }) {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("Produit de recherche")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="create" id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="create" title={t("Créer")}>
            <AddSearchProduct planId={planId} handleClose={handleClose} show={show} />
          </Tab>
          <Tab eventKey="import" title={t("Importer")}>
            <ImportSearchProduct planId={planId} handleClose={handleClose} show={show} />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default SearchProduct;
