import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Alert } from "react-bootstrap";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import * as stylesForm from "../assets/css/form.module.css";
import { GlobalContext } from "../context/Global";
import { researchOutput } from "../../services";
import CustomSelect from "../Shared/CustomSelect";

const EndButton = styled.div`
  display: flex;
  justify-content: end;
`;

function ImportResearchOutput({ planId, handleClose }) {
  const {
    setResearchOutputs,
    setDisplayedResearchOutput,
    setUrlParams,
  } = useContext(GlobalContext);
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [selectedResearchOutput, setSelectedResearchOutput] = useState({});

  useEffect(() => {
    researchOutput.getPlans().then(({ data }) => {
      const plans = data?.plans?.map((plan) => ({
        value: plan.id,
        label: plan.title,
        ...plan,
        researchOutputs: plan.research_outputs.map((ro) => ({
          value: ro.id,
          label: ro.title,
          ...ro,
        })),
      }));
      setPlans(plans || []);
    });
  }, []);

  /**
   * This is a function that handles the selection of a value and sets it as the type.
   */
  const handleSelectPlan = (e) => {
    setSelectedPlan(e);
    setSelectedResearchOutput(e?.researchOutputs?.at(0));
  };

  const handleSelectResearchOutput = (e) => {
    setSelectedResearchOutput(e);
  };

  /**
   * This function handles the import of a product plan and updates the product data.
   */
  const handleImportResearchOutput = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let res;
    try {
      res = await researchOutput.importResearchOutput(  {
        planId,
        uuid: selectedResearchOutput.uuid,
      });
    } catch (err) {
      return toast.error(t('An error occured during import !'));
    }

    const { research_outputs, created_ro_id } = res?.data;

    setDisplayedResearchOutput(research_outputs.find(({ id }) => id === created_ro_id));
    setResearchOutputs(research_outputs);
    // setLoadedSectionsData({ [currentResearchOutput.template.id]: currentResearchOutput.template })
    setUrlParams({ research_output: created_ro_id });

    toast.success(t("Research output successfully imported."));
    return handleClose();
  };

  return (
    <div style={{ margin: "25px", width: "600px" }}>
      {plans.length > 0 ? (
        <div className="form-group">
          <div className={stylesForm.label_form}>
            <label>{t("Choose plan")}</label>
          </div>
          <div className="form-group">
            <Alert variant="info">
              {t('You can import a research output from plans you own or you are coowner (test plans excluded).')}
            </Alert>
          </div>
          <CustomSelect
            onSelectChange={(e) => handleSelectPlan(e)}
            options={plans}
            selectedOption={selectedPlan}
            placeholder={t("Select a value from the list")}
          />
        </div>
      ) : (
        <div className="form-group">
          <Alert variant="warning">
            {t('No plans comply with the import rules (at least one research output or type of research output).')}
          </Alert>
        </div>
      )}

      {selectedPlan?.researchOutputs?.length > 0 && (
      < div className="form-group">
          <div className={stylesForm.label_form}>
            <label>{t("Choose research output")}</label>
          </div>
          <CustomSelect
            onSelectChange={(e) => handleSelectResearchOutput(e)}
            options={selectedPlan.researchOutputs}
            selectedOption={selectedResearchOutput}
            placeholder={t("Select a value from the list")}
          />
        </div>
      )}
      <EndButton>
        <Button variant="secondary" style={{ marginRight: "8px" }} onClick={handleClose}>
          {t("Close")}
        </Button>
        <Button variant="outline-primary" style={{ backgroundColor: "var(--rust)", color: "white" }} onClick={handleImportResearchOutput}>
          {t("Import")}
        </Button>
      </EndButton>
    </div>
  );
}

export default ImportResearchOutput;
