import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import * as stylesForm from "../assets/css/form.module.css";
import { GlobalContext } from "../context/Global";
import Select from "react-select";
import { researchOutput } from "../../services";

const EndButton = styled.div`
  display: flex;
  justify-content: end;
`;

function ImportResearchOutput({ planId, handleClose, show }) {
  const { setResearchOutputs } = useContext(GlobalContext);
  const { t } = useTranslation();
  const [uuid, setUuid] = useState(null);
  const [plan, setPlan] = useState(null);
  const [product, setProduct] = useState(null);
  const [dataPlans, setDataPlans] = useState(null);
  const [dataProducts, setDataProducts] = useState([]);

  useEffect(() => {
    researchOutput.getPlans("").then((res) => {
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
    setPlan(planValue);
    researchOutput.getProducts(planValue, "").then((res) => {
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
    researchOutput.postImportProduct(plan, uuid).then((res) => {
      setResearchOutputs(res.data.plan.research_outputs);
      handleClose();
    });
  };

  return (
    <div style={{ margin: "25px" }}>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <strong className={stylesForm.dot_label}></strong>
          <label>{t("Choose plan")}</label>
        </div>
        {dataPlans && (
          <Select
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999, color: "grey" }),
              singleValue: (base) => ({ ...base, color: "var(--dark-blue)" }),
              control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--dark-blue)" }),
            }}
            options={dataPlans}
            style={{ color: "red" }}
            onChange={(e) => handleSelectPlan(e)}
          />
        )}
        <small className="form-text text-muted">{t("Please choose one of the plan you have access to")}</small>
      </div>

      <div className="form-group">
        <div className={stylesForm.label_form}>
          <strong className={stylesForm.dot_label}></strong>
          <label>{t("Choose research output")}</label>
        </div>
        {dataProducts && (
          <Select
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999, color: "grey" }),
              singleValue: (base) => ({ ...base, color: "var(--dark-blue)" }),
              control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--dark-blue)" }),
            }}
            options={dataProducts}
            style={{ color: "red" }}
            onChange={(e) => handleSelectProduct(e)}
          />
        )}
        <small className="form-text text-muted">{t("Please choose one of the research outputs")}</small>
      </div>
      <EndButton>
        <Button variant="secondary" style={{ marginRight: "8px" }} onClick={handleClose}>
          {t("Close")}
        </Button>
        <Button variant="outline-primary" style={{ backgroundColor: "var(--rust)", color: "white" }} onClick={handleImportPlan}>
          {t("Import")}
        </Button>
      </EndButton>
    </div>
  );
}

export default ImportResearchOutput;
