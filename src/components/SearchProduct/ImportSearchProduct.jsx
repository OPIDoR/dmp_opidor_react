import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import stylesForm from "../assets/css/form.module.css";
import { GlobalContext } from "../context/Global";
import Select from "react-select";
import { getPlans, getProducts, postImportProduct } from "../../services/DmpSearchProduct";

const EndButton = styled.div`
  display: flex;
  justify-content: end;
`;

function ImportSearchProduct({ planId, handleClose, show }) {
  const { setProductData } = useContext(GlobalContext);
  const { t } = useTranslation();
  const [uuid, setUuid] = useState(null);
  const [plan, setPlan] = useState(null);
  const [product, setProduct] = useState(null);
  const [dataPlans, setDataPlans] = useState(null);
  const [dataProducts, setDataProducts] = useState([]);

  useEffect(() => {
    getPlans("").then((res) => {
      console.log(res.data);
      const options = res.data.map((option) => ({
        value: option.id,
        label: option.title,
      }));
      setDataPlans(options);
    });
  }, []);

  /**
   * This is a function that handles the selection of a value and sets it as the type.
   */
  const handleSelectPlan = (e) => {
    const planValue = e.value;
    console.log(planValue);
    setPlan(planValue);
    getProducts(planValue, "").then((res) => {
      console.log(res.data);
      const options = res.data.map((option) => ({
        value: option.uuid,
        label: option.title,
      }));
      setDataProducts(options);
    });
  };
  const handleSelectProduct = (e) => {
    setProduct(e.value);
  };

  /**
   * This function handles the import of a product plan and updates the product data.
   */
  const handleImportPlan = (e) => {
    e.preventDefault();
    e.stopPropagation();
    postImportProduct(plan, uuid).then((res) => {
      setProductData(res.data.plan.research_outputs);
      handleClose();
    });
  };

  return (
    <div style={{ margin: "25px" }}>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <strong className={stylesForm.dot_label}></strong>
          <label>{t("Choisir plan")}</label>
        </div>
        {dataPlans && (
          <Select
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999, color: "grey" }) }}
            options={dataPlans}
            style={{ color: "red" }}
            onChange={(e) => handleSelectPlan(e)}
          />
        )}
        <small className="form-text text-muted">{t("Veuillez saisir l'UUID d'un plan")}</small>
      </div>

      <div className="form-group">
        <div className={stylesForm.label_form}>
          <strong className={stylesForm.dot_label}></strong>
          <label>{t("Choisir produit")}</label>
        </div>
        {dataProducts && (
          <Select
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999, color: "grey" }) }}
            options={dataProducts}
            style={{ color: "red" }}
            onChange={(e) => handleSelectProduct(e)}
          />
        )}
        <small className="form-text text-muted">{t("Veuillez saisir l'un des produits de recherche")}</small>
      </div>
      <EndButton>
        <Button variant="secondary" style={{ marginRight: "8px" }} onClick={handleClose}>
          {t("Fermer")}
        </Button>
        <Button variant="outline-primary" style={{ backgroundColor: "var(--orange)", color: "white" }} onClick={handleImportPlan}>
          {t("Importer")}
        </Button>
      </EndButton>
    </div>
  );
}

export default ImportSearchProduct;