import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";

import styles from "../assets/css/steps.module.css";
import { planCreation } from "../../services";
import { GlobalContext } from "../context/Global";
import { CustomButton, CircleTitle } from "../Styled";
import { CustomSpinner, CustomError, CustomSelect } from "../Shared";

/* The above code is a React functional component that renders a form with radio buttons to select a template for a document. It fetches data from APIs
using useEffect hooks and uses react-select library to create dropdown menus. It also has functions to handle the selection of options and to send the
selected template ID to the next step. */
function SecondStep({ prevStep }) {
  const { t } = useTranslation();
  const {
    researchContext, setResearchContext,
    currentOrg,
    setUrlParams,
    planTemplates, setPlanTemplates,
    selectedTemplate, setSelectedTemplate,
  } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const placeHolder = t('Begin typing to see a list of suggestions.');

  /* A hook that is called when the component is mounted. It is used to fetch data from an API. */
  useEffect(() => {
    setResearchContext(researchContext);

    if (!researchContext) {
      setResearchContext(localStorage.getItem('researchContext') || '');
    }

    const tmpls = {
      default: { title: t('Default template'), templates: [] },
      myOrg: { title: `${currentOrg.name} (${t('your organisation')})`, templates: [] },
      otherOrgs: { id: 'otherOrgs', title: t('Other organisation'), type: 'select', data: [] },
      funders: { id: 'funders', title: t('Funder'), type: 'select', data: [] },
    };

    const fetchTemplates = async () => {
      setLoading(true);

      let currentTemplatesRes;
      try {
        currentTemplatesRes = await  planCreation.getDefaultTemplate();
      } catch (error) {
        setLoading(false);
        return handleError(error);
      }

      tmpls.default.templates = Array.isArray(currentTemplatesRes?.data || []) ? currentTemplatesRes?.data : [currentTemplatesRes?.data];

      let myOrgTemplatesRes;
      try {
        myOrgTemplatesRes = await planCreation.getTemplatesByOrgId(currentOrg, researchContext);
      } catch (error) {
        setLoading(false);
        return handleError(error);
      }

      tmpls.myOrg.templates = myOrgTemplatesRes?.data || [];

      let orgsRes;
      try {
        orgsRes = await planCreation.getOrgs(researchContext);
      } catch (error) {
        setLoading(false);
        return handleError(error);
      }

      orgsRes = orgsRes?.data?.map((org) => ({ ...org, templates: [] }))
        .filter((option) => option.name.toLowerCase() !== currentOrg.name.toLowerCase());

      for await (const org of orgsRes) {
        let orgTemplatesRes;

        try {
          orgTemplatesRes = await planCreation.getTemplatesByOrgId(org, researchContext);
        } catch (error) {
          setLoading(false);
          handleError(error);
          break;
        }

        tmpls.othersOrgs.data.push({
          ...org,
          templates: orgTemplatesRes?.data || [],
          selected: false,
        });
      }

      let fundersRes;
      try {
        fundersRes = await planCreation.getFunders(researchContext);
      } catch (error) {
        setLoading(false);
        return handleError(error);
      }

      fundersRes = fundersRes?.data?.map((funder) => ({ ...funder, templates: [] }));

      for await (const funder of fundersRes) {
        let fundersTemplatesRes;

        try {
          fundersTemplatesRes = await planCreation.getTemplatesByFunderId(funder, researchContext);
        } catch (error) {
          setLoading(false);
          handleError(error);
          break;
        }

        tmpls.funders.data.push({
          ...funder,
          templates: fundersTemplatesRes?.data || [],
          selected: false,
        });
      }


      setPlanTemplates(tmpls);
      setLoading(false);
    };

    fetchTemplates();
  }, [currentOrg, researchContext]);

  const handleError = (error) => setError({
    code: error?.response?.status,
    message: error?.response?.statusText,
    error: error?.response?.data?.message || '',
    home: false,
  });

  /**
   * The function checks if a template ID exists in a context object and logs it, or displays an error message if it doesn't exist.
   */
  const handleSendTemplateId = async () => {
    if (!selectedTemplate) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: t("You must choose a template"),
      });
    }

    let response;
    try {
      response = await planCreation.createPlan(selectedTemplate);
    } catch (error) {
      let errorMessage = t("An error occurred while creating the plan");

      if (error.response) {
        errorMessage = error.response.message;
      } else if (error.request) {
        errorMessage = error.request;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }

    setUrlParams({ step: undefined });

    if (localStorage.getItem('researchContext')) {
      localStorage.remove('researchContext');
    }

    window.location = `/plans/${response.data.id}`
  };

  const handelSelectedList = (selectedValue) => {
    const data = { ...planTemplates };

    setPlanTemplates({
      ...data,
      [selectedValue?.type]: {
        ...data[selectedValue?.type],
        data: data[selectedValue?.type].data.map((d) => ({
          ...d,
          selected: selectedValue.value === d.id,
        }))
      }
    });
  }

  const createList = ({ index, templates }) => {
    if (templates.length === 0) { return; }

    const list = [];
    for (const template of templates) {
      const element = (
        <div
          className={`${styles.context_list} ${template.id === selectedTemplate ? styles.checked : ''}`}
          key={`template-${index}-${template.id}`}
          style={{
            cursor: 'pointer',
          }}
          onClick={() => setSelectedTemplate(template.id)}
        >
          {template.title}
        </div>
      );
      list.push(element);
    }
    return list;
  };

  const displayTemplatesByCategory = (index) => {
    const noModelAvailable = (<p style={{ margin: '-10px 0 0 0' }} className={styles.subtitle}><i>{t('No model available')}</i></p>);

    if (!planTemplates[index].type) {
      const { templates } = planTemplates?.[index];

      if (templates.length <= 0) {
        return noModelAvailable;
      }

      return createList({ index, templates });
    }

    let { data } = planTemplates?.[index];

    if (data.length <= 0) {
      return noModelAvailable;
    }

    const type = planTemplates?.[index].id;

    data = data.map(({ name, id, templates, selected }) => ({
      label: name,
      value: id,
      type,
      selected,
      templates,
    }));

    return (
      <div style={{ width: '100%', marginLeft: '10px' }}>
        <CustomSelect
          key={`select-${index}-${type}`}
          placeholder={placeHolder}
          options={data}
          onChange={handelSelectedList}
          selectedOption={data.find(({ selected }) => selected)}
        />
        <div key={`template-${index}-${type}`} style={{ marginTop: '10px' }}>
          {createList({
            index,
            templates: data.find(({ selected }) => selected)?.templates || [],
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <CircleTitle number="2" title={t('Choose your template')} />
      {loading && <CustomSpinner />}
      {!loading && error && <CustomError error={error} />}
      {!loading && !error && (
        <>
          <div className="column">
            <span
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                return prevStep('first');
              }}
              style={{ display: 'block', marginBottom: '20px', cursor: 'pointer' }}
            >
              <BsFillArrowLeftCircleFill size={12} style={{ marginRight: '10px' }} />
              {t('Go back to previous step')}
            </span>
            {
              Object.keys(planTemplates).map((index) => (
                <div key={`category-${index}`}>
                  <label key={`category-label-${index}`} className={`${styles.title}`}>
                    {planTemplates?.[index]?.title}
                  </label>
                  {displayTemplatesByCategory(index)}
                </div>
              ))
            }
          </div>
          { selectedTemplate && <div className="row" style={{ marginTop: '20px' }}>
            <CustomButton
              handleClick={handleSendTemplateId}
              title={t("Confirm my choice")}
              position="start"
            />
          </div>}
        </>
      )}
    </div>
  );
}

export default SecondStep;
