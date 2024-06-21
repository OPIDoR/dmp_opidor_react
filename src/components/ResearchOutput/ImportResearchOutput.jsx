import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";
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
    researchOutputs, setResearchOutputs,
    setDisplayedResearchOutput,
    setLoadedSectionsData,
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
      if (plans.length > 0) {
        setSelectedPlan(plans?.at(0));
        setSelectedResearchOutput(plans?.at(0)?.researchOutputs?.at(0));
      }
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
  const handleImportPlan = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let res;
    try {
      res = await researchOutput.postImportProduct(  {
        planId,
        uuid: selectedResearchOutput.uuid,
      });
    } catch (err) {
      console.log(err);
      return toast.error(t('An error occured during import !'));
    }

    const { research_outputs, current_research_output } = res?.data?.data;

    const currentResearchOutput = research_outputs.find(({ id }) => id === current_research_output);

    setResearchOutputs(research_outputs);
    setDisplayedResearchOutput(currentResearchOutput);
    setLoadedSectionsData({ [currentResearchOutput.template.id]: currentResearchOutput.template })
    setUrlParams({ research_output: current_research_output });

    handleClose();

    return toast.success(res?.data?.message);
  };

  return (
    <div style={{ margin: "25px" }}>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <strong className={stylesForm.dot_label}></strong>
          <label>{t("Choose plan")}</label>
        </div>
        {plans.length > 0 && (
          <CustomSelect
            onSelectChange={(e) => handleSelectPlan(e)}
            options={plans}
            selectedOption={selectedPlan}
            placeholder={t("Select a value from the list")}
          />
        )}
      </div>

      <div className="form-group">
        <div className={stylesForm.label_form}>
          <strong className={stylesForm.dot_label}></strong>
          <label>{t("Choose research output")}</label>
        </div>
        {selectedPlan?.researchOutputs?.length > 0 && (
          <CustomSelect
            onSelectChange={(e) => handleSelectResearchOutput(e)}
            options={selectedPlan.researchOutputs}
            selectedOption={selectedResearchOutput}
            placeholder={t("Select a value from the list")}
          />
        )}
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
