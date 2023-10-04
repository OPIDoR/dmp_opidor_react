import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import stylesForm from "../assets/css/form.module.css";
import { GlobalContext } from "../context/Global";
import { researchOutput } from "../../services";
import styled from "styled-components";
import { createOptions } from "../../utils/GeneratorUtils";
import CustomSelect from "../Shared/CustomSelect";
import { service } from "../../services";
import { toast } from "react-hot-toast";

const EndButton = styled.div`
  display: flex;
  justify-content: end;
`;

function AddResearchOutput({ planId, handleClose, edit = false }) {
  const { 
    locale,
    displayedResearchOutput, setDisplayedResearchOutput,
    setResearchOutputs,
    setUrlParams,
    researchOutputs,
  } = useContext(GlobalContext);
  const { t } = useTranslation();
  const [options, setOptions] = useState([{value:'', label:''}]);
  const [abbreviation, setAbbreviation] = useState(null);
  const [title, setTitle] = useState(null);
  const [type, setType] = useState(null);
  const [hasPersonalData, setHasPersonalData] = useState(false);
  const selectedOption = options.find((opt) => opt.value === type);

  useEffect(() => {
    if (edit) {
      setAbbreviation(displayedResearchOutput.abbreviation);
      setTitle(displayedResearchOutput.title);
      setHasPersonalData(displayedResearchOutput.hasPersonalData);
      setType(displayedResearchOutput.type);
    }

    if (!edit) {
      setAbbreviation(`${t('Research output')} ${researchOutputs.length + 1}`);
      setTitle(`${t('Research output')} ${researchOutputs.length + 1}`);
    }

    service.getRegistryByName('ResearchDataType').then((res) => {
      setOptions(createOptions(res.data, locale));
    });
  }, []);

  /**
   * This is a function that handles the selection of a value and sets it as the type.
   */
  const handleSelect = (e) => {
    setType(e.value);
  };

  /**
   * The function handles saving data by creating an object and posting it to a server, then updating state variables and closing a modal.
   */
  const handleSave = async (e) => {
    e.stopPropagation();
    const researchOutputInfo = {
      plan_id: planId,
      abbreviation,
      title,
      type,
      configuration: {
        hasPersonalData
      }
    };

    if (edit) {
      let res;
      try {
        res = await researchOutput.update(displayedResearchOutput.id, researchOutputInfo);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.message);
        } else if (error.request) {
          toast.error(error.request);
        } else {
          toast.error(error.message);
        }
        return handleClose();
      }

      setDisplayedResearchOutput(res?.data?.research_outputs?.find(({ id }) => id === displayedResearchOutput.id));
      setResearchOutputs(res?.data?.research_outputs);

      setUrlParams({ research_output: displayedResearchOutput.id });

      return handleClose();
    }

    let res;
    try {
      res = await researchOutput.create(researchOutputInfo);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.message);
      } else if (error.request) {
        toast.error(error.request);
      } else {
        toast.error(error.message);
      }
      return handleClose();
    }

    setDisplayedResearchOutput(res?.data?.research_outputs?.find(({ id }) => id === res?.data?.created_ro_id));
    setResearchOutputs(res?.data?.research_outputs);

    setUrlParams({ research_output: res?.data?.created_ro_id });

    return handleClose();
  };

  return (
    <div style={{ margin: "25px" }}>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <strong className={stylesForm.dot_label}></strong>
          <label>{t('Short name')}</label>
        </div>
        <input
          value={abbreviation || `${t('Research output')} ${researchOutputs.length + 1}`}
          className={`form-control ${stylesForm.input_text}`}
          placeholder={t("add abbreviation")}
          type="text"
          onChange={(e) => setAbbreviation(e.target.value)}
          maxLength="20"
        />
        <small className="form-text text-muted">{t("Limited to 20 characters")}</small>
      </div>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <strong className={stylesForm.dot_label}></strong>
          <label>{t('Name')}</label>
        </div>
        <input
          value={title || `${t('Research output')} ${researchOutputs.length + 1}`}
          className={`form-control ${stylesForm.input_text}`}
          placeholder={t("add title")}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <strong className={stylesForm.dot_label}></strong>
          <label>{t('Type')}</label>
        </div>
        {options && (
          <CustomSelect
            onChange={handleSelect}
            options={options}
            selectedOption={selectedOption}
          />
        )}
      </div>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <label>{t("Does your research output contain personal data?")}</label>
        </div>
          <div className="form-check">
          <label className={stylesForm.switch}>
            <input type="checkbox" id="togBtn" checked={hasPersonalData} onChange={() => { setHasPersonalData(!hasPersonalData) }}/>
            <div className={`${stylesForm.switchSlider} ${stylesForm.switchRound}`}>
              <span className={stylesForm.switchOn}>{t('Yes')}</span>
              <span className={stylesForm.switchOff}>{t('No')}</span>
            </div>
          </label>
        </div>
      </div>
      <EndButton>
        <Button variant="secondary" onClick={handleClose} style={{ marginRight: "8px" }}>
          {t("Close")}
        </Button>
        <Button variant="primary" onClick={handleSave} style={{ backgroundColor: "var(--orange)", color: "white" }}>
          {t(edit ? "Save" : "Add")}
        </Button>
      </EndButton>
    </div>
  );
}

export default AddResearchOutput;
