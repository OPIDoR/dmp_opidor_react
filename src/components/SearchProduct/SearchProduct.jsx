import React from "react";
import { getTypeSearchProduct, postSearchProduct } from "../../services/DmpSearchProduct";
import { useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "../context/Global";
import { Modal, Button, Tab, Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Tabs } from "react-bootstrap";
import AddSearchProduct from "./AddSearchProduct";
import ImportSearchProduct from "./ImportSearchProduct";

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
            <ImportSearchProduct />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default SearchProduct;
