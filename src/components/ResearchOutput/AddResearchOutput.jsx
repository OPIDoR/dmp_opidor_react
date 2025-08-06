import React, { useContext, useEffect, useState } from "react";
import { Button, Alert, Spinner } from 'react-bootstrap';
import { Trans, useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from "styled-components";
import uniqueId from "lodash.uniqueid";
import DOMPurify from "dompurify";

import * as stylesForm from "../assets/css/form.module.css";
import { GlobalContext } from "../context/Global";
import { researchOutput } from "../../services";
import { createOptions, displayPersonalData, researchOutputTypeToDataType } from "../../utils/GeneratorUtils";
import CustomSelect from "../Shared/CustomSelect";
import { service } from "../../services";
import { getErrorMessage } from "../../utils/utils";
import TooltipInfoIcon from '../FormComponents/TooltipInfoIcon';

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
  } = useContext(GlobalContext);
  const { t } = useTranslation();
  const [options, setOptions] = useState([{ value: '', label: '' }]);
  const [abbreviation, setAbbreviation] = useState(undefined);
  const [title, setTitle] = useState(undefined);
  const [type, setType] = useState(null);
  const [hasPersonalData, setHasPersonalData] = useState(false);
  const [selectedOption, setSelectedOption] = useState({ value: '', label: '' });
  const [disableTypeChange, setDisableTypeChange] = useState(false);
  const tooltipedLabelId = uniqueId('type_tooltip_id_');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    service.getRegistryByName('ResearchDataType').then((res) => {
      const opts = createOptions(res.data, locale);
      setOptions(opts);

      if (inEdition) {
        setAbbreviation(displayedResearchOutput.abbreviation);
        setTitle(displayedResearchOutput.title);
        setHasPersonalData(displayedResearchOutput.configuration.hasPersonalData);
        setType(displayedResearchOutput.type);
        handlePersonalData(displayedResearchOutput.type);
        setSelectedOption(opts.find(({ value }) => value === displayedResearchOutput.type));
      }

      if (!inEdition) {
        const pos = Math.max(...researchOutputs.map(({ order }) => order));
        const nextOrder = pos < researchOutputs.length ? researchOutputs.length + 1 : pos + 1;
        setAbbreviation(`${t('RO')} ${nextOrder}`);
        setTitle(`${t('Research output')} ${nextOrder}`);
        setHasPersonalData(true);
      }
    });

    setDisableTypeChange(inEdition);

  }, [locale]);

  /**
   * This is a function that handles the selection of a value and sets it as the type.
   */
  const handleSelect = (e) => {
    setSelectedOption(options.find(({ value }) => value === e.value));
    setType(e.value);
    handlePersonalData(e.value);
  };

  /**
   * The function handles saving data by creating an object and posting it to a server, then updating state variables and closing a modal.
   */
  const handleSave = async (e) => {
    e.stopPropagation();

    setLoading(true);

    if (!type || type.length === 0) {
      setLoading(false);
      return toast.error(t("A 'type' is required to create a research output."));
    }

    const dataType = researchOutputTypeToDataType(type);
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
        setLoading(false);
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
      setLoading(false);
      toast.error(getErrorMessage(error));
      return;
    }

    const createdResearchOutput = res?.data?.research_outputs?.find(({ id }) => id === res?.data?.created_ro_id)
    setDisplayedResearchOutput(createdResearchOutput);
    setLoadedSectionsData({ [createdResearchOutput.template.id]: createdResearchOutput.template })
    setResearchOutputs(res?.data?.research_outputs);
    setUrlParams({ research_output: res?.data?.created_ro_id });

    toast.success(t("Research output successfully added."));

    const event = new CustomEvent('trigger-refresh-ro-data', {
      detail: { message: { roId: res?.data?.created_ro_id, planId: planId } },
    });
    window.dispatchEvent(event);

    setLoading(false);

    return handleClose();
  };

  const handlePersonalData = (researchOutputType) => {
    if (inEdition) return;
    if (displayPersonalData(researchOutputType)) {
      setHasPersonalData(true);
    } else {
      setHasPersonalData(false);
    }
  }

  return (
    <div style={{ margin: "25px" }}>
      <div className="form-group">
        <Alert variant="info">
          {t('You can create a new research output and display questions by selecting the type.')}
        </Alert>
      </div>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <label>{t('Short name')}</label>
        </div>
        <input
          value={abbreviation || ''}
          disabled={loading}
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
          disabled={loading}
          className={`form-control ${stylesForm.input_text}`}
          placeholder={t("add title")}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <label data-tooltip-id={tooltipedLabelId}>
            {t('Type')}
            <TooltipInfoIcon />
            <ReactTooltip
              id={tooltipedLabelId}
              place="bottom"
              effect="solid"
              variant="info"
              content={<Trans
                t={t}
                defaults="You can find the different types of research outputs in the LEARN MORE menu."
              />}
            />
          </label>
        </div>
        {type && !inEdition && (
          <div style={{
            fontSize: '14px',
            fontWeight: 400,
            marginBottom: '10px',
            color: 'var(--rust)'
          }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize([t('The choice of <strong>type</strong> for a research output conditions the display of questions specific to its management.<br /><strong>It is no longer possible to change the type of a research output once it has been added.</strong>')]),
            }} />
        )}
        {options && (
          <CustomSelect
            onSelectChange={handleSelect}
            options={options}
            selectedOption={selectedOption}
            placeholder={t("Select a value from the list")}
            overridable={false}
            isDisabled={disableTypeChange || loading}
          />
        )}
      </div>
      {type && displayPersonalData(type) && (
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
              <input type="checkbox" id="togBtn" checked={hasPersonalData} onChange={() => { setHasPersonalData(!hasPersonalData) }} />
              <div className={`${stylesForm.switchSlider} ${stylesForm.switchRound}`}>
                <span className={stylesForm.switchOn}>{t('Yes')}</span>
                <span className={stylesForm.switchOff}>{t('No')}</span>
              </div>
            </label>
          </div>
        </div>
      )}
      <EndButton>
        {close && (
          <Button onClick={handleClose} style={{ margin: '0 5px 0 5px' }} disabled={loading}>
            {t("Close")}
          </Button>
        )}
        <Button variant="primary" onClick={handleSave} style={{ backgroundColor: "var(--rust)", color: "white", margin: '0 5px 0 5px' }} disabled={loading}>
          {loading && (<Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />)}
          {t(inEdition ? "Save" : "Add")}
        </Button>
      </EndButton>
    </div>
  );
}

export default AddResearchOutput;
