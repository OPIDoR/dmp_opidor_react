import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import styled from "styled-components";

import * as stylesForm from "../assets/css/form.module.css";
import { GlobalContext } from "../context/Global";
import { researchOutput } from "../../services";
import { createOptions, researchOutputTypeToDataType } from "../../utils/GeneratorUtils";
import CustomSelect from "../Shared/CustomSelect";
import { service } from "../../services";
import { getErrorMessage } from "../../utils/utils";

const EndButton = styled.div`
  display: flex;
  justify-content: end;
`;

function AddResearchOutput({ planId, handleClose, inEdition = false, close = true }) {
  const {
    locale,
    displayedResearchOutput, setDisplayedResearchOutput,
    setLoadedSectionsData,
    setResearchOutputs,
    setUrlParams,
    researchOutputs,
    configuration,
  } = useContext(GlobalContext);
  const { t } = useTranslation();
  const [options, setOptions] = useState([{value: '', label: ''}]);
  const [abbreviation, setAbbreviation] = useState(undefined);
  const [title, setTitle] = useState(undefined);
  const [type, setType] = useState(null);
  const [hasPersonalData, setHasPersonalData] = useState(false);
  const selectedOption = options.find((opt) => opt.value === type);
  const [disableTypeChange, setDisableTypeChange] = useState(false);

  useEffect(() => {
    service.getRegistryByName('ResearchDataType').then((res) => {
      setOptions(createOptions(res.data, locale));
    });

    if (inEdition) {
      setAbbreviation(displayedResearchOutput.abbreviation);
      setTitle(displayedResearchOutput.title);
      setHasPersonalData(displayedResearchOutput.configuration.hasPersonalData);
      setType(displayedResearchOutput.type);
    }

    if (!inEdition) {
      const maxOrder = researchOutputs.length > 0 ? Math.max(...researchOutputs.map(ro => ro.order)) : 0;
      setAbbreviation(`${t('RO')} ${maxOrder + 1}`);
      setTitle(`${t('Research output')} ${maxOrder + 1}`);
      setHasPersonalData(configuration.enableHasPersonalData);
      setType(null);
    }
    setDisableTypeChange(inEdition && !configuration.enableResearchOutputTypeChange);

  }, [locale]);

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

    if (!type || type.length === 0) {
      return toast.error(t('Un "type" est nécessaire pour créer un produit de recherche.'));
    }

    const dataType = configuration?.enableSoftwareResearchOutput ? researchOutputTypeToDataType(type) : 'none' ;
    const researchOutputInfo = {
      plan_id: planId,
      abbreviation,
      title,
      type,
      configuration: {
        hasPersonalData,
        dataType,
      }
    };

    if (inEdition) {
      let res;
      try {
        res = await researchOutput.update(displayedResearchOutput.id, researchOutputInfo);
      } catch (error) {
        toast.error(getErrorMessage(error));
        return;
      }

      setDisplayedResearchOutput(res?.data?.research_outputs?.find(({ id }) => id === displayedResearchOutput.id));
      setResearchOutputs(res?.data?.research_outputs);

      setUrlParams({ research_output: displayedResearchOutput.id });

      toast.success(t("Save was successful !"));
      return handleClose();
    }

    let res;
    try {
      res = await researchOutput.create(researchOutputInfo);
    } catch (error) {
      toast.error(getErrorMessage(error));
      return;
    }

    const createdResearchOutput = res?.data?.research_outputs?.find(({ id }) => id === res?.data?.created_ro_id)
    setDisplayedResearchOutput(createdResearchOutput);
    setLoadedSectionsData({ [createdResearchOutput.template.id]: createdResearchOutput.template })
    setResearchOutputs(res?.data?.research_outputs);

    setUrlParams({ research_output: res?.data?.created_ro_id });

    toast.success(t("Research output successfully added."));
    return handleClose();
  };

  return (
    <div style={{ margin: "25px" }}>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <label>{t('Short name')}</label>
        </div>
        <input
          value={abbreviation || ''}
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
          <label>{t('Name')}</label>
        </div>
        <input
          value={title || ''}
          className={`form-control ${stylesForm.input_text}`}
          placeholder={t("add title")}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <label>{t('Type')}</label>
        </div>
        {options && (
          <CustomSelect
            onSelectChange={handleSelect}
            options={options}
            selectedOption={selectedOption}
            placeholder={t("Select a value from the list")}
            overridable={false}
            isDisabled={disableTypeChange}
          />
        )}
      </div>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <label>{t("Does your research output contain personal data?")}</label>
        </div>
          <div style={{
            fontSize: '14px',
            fontWeight: 400,
            marginBottom: '10px'
          }}>
            <i>{t("If the answer is yes, a specific question on personal data protection is proposed. If the answer is no, this question is not displayed.")}</i>
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
        {close && (
          <Button onClick={handleClose} style={{ margin: '0 5px 0 5px' }}>
            {t("Close")}
          </Button>
        )}
        <Button bsStyle="primary" onClick={handleSave} style={{ backgroundColor: "var(--rust)", color: "white", margin: '0 5px 0 5px'  }}>
          {t(inEdition ? "Save" : "Add")}
        </Button>
      </EndButton>
    </div>
  );
}

export default AddResearchOutput;
