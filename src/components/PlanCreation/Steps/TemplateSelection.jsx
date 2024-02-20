import React, { useEffect, useMemo, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { PiTreeStructureDuotone, PiBank } from "react-icons/pi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { Label } from "react-bootstrap";

import styles from "../../assets/css/steps.module.css";
import { planCreation } from "../../../services";
import { CustomButton } from "../../Styled";
import { CustomSpinner, CustomError, CustomSelect } from "../../Shared";

function TemplateSelection({ prevStep, set, params: selectionData, setUrlParams }) {
  const { t } = useTranslation();

  const [planTemplates, setPlanTemplates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const placeHolder = t('Begin typing to see a list of suggestions');

  const params = useMemo(() => selectionData, [selectionData]);

  /* A hook that is called when the component is mounted. It is used to fetch data from an API. */
  useEffect(() => {
    const tmpls = {
      default: { title: t('Template recommended by DMP OPIDoR'), templates: [] },
      myOrg: { title: t('Template recommended by your organization ({{orgName}})', { orgName: params.currentOrg.name }), templates: [] },
      others: { id: 'others', title: t('Templates from other organizations or funders'), type: 'select', data: [] },
    };

    const fetchTemplates = async () => {
      setLoading(true);

      let currentTemplatesRes;
      try {
        currentTemplatesRes = await planCreation.getRecommendedTemplate(params.researchContext, params.templateLanguage);
      } catch (error) {
        setLoading(false);
        return handleError(error);
      }

      const defaultTemplateID = currentTemplatesRes?.data?.id

      tmpls.default.templates = Array.isArray(currentTemplatesRes?.data)
        ? currentTemplatesRes?.data
        : [currentTemplatesRes?.data]
        // .filter(({ structured }) => structured === params.isStructured)
        .filter(({ locale }) => locale?.toLowerCase() === params.templateLanguage.toLowerCase());

      let myOrgTemplatesRes;
      try {
        myOrgTemplatesRes = await planCreation.getTemplatesByOrgId(params.currentOrg, params.researchContext);
      } catch (error) {
        setLoading(false);
        return handleError(error);
      }

      tmpls.myOrg.templates = myOrgTemplatesRes?.data
        // .filter(({ structured }) => structured === params.isStructured)
        .filter(({ id }) => id !== defaultTemplateID)
        .filter(({ locale }) => locale?.toLowerCase() === params.templateLanguage.toLowerCase()) || [];

      let orgsRes;
      try {
        orgsRes = await planCreation.getOrgs(params.researchContext);
      } catch (error) {
        setLoading(false);
        return handleError(error);
      }

      orgsRes = orgsRes?.data?.map((org) => ({ ...org, templates: [] }))
        .filter((option) => option.name.toLowerCase() !== params.currentOrg.name.toLowerCase());

      for await (const org of orgsRes) {
        let orgTemplatesRes;

        try {
          orgTemplatesRes = await planCreation.getTemplatesByOrgId(org, params.researchContext);
        } catch (error) {
          setLoading(false);
          handleError(error);
          break;
        }

        tmpls.others.data.push({
          ...org,
          type: 'org',
          templates: orgTemplatesRes?.data
            // .filter(({ structured }) => structured === params.isStructured)
            .map((obj) => ({ ...obj, type: 'org' }))
            .filter(({ id }) => id !== defaultTemplateID)
            .filter(({ locale }) => locale?.toLowerCase() === params.templateLanguage.toLowerCase()) || [],
          selected: false,
        });
      }

      let fundersRes;
      try {
        fundersRes = await planCreation.getFunders(params.researchContext);
      } catch (error) {
        setLoading(false);
        return handleError(error);
      }

      fundersRes = fundersRes?.data?.map((funder) => ({ ...funder, templates: [] }));

      for await (const funder of fundersRes) {
        let fundersTemplatesRes;

        try {
          fundersTemplatesRes = await planCreation.getTemplatesByFunderId(funder, params.researchContext);
        } catch (error) {
          setLoading(false);
          handleError(error);
          break;
        }

        tmpls.others.data.push({
          ...funder,
          type: 'funder',
          templates: fundersTemplatesRes?.data
            // .filter(({ structured }) => structured === isStructured)
            .map((obj) => ({ ...obj, type: 'funder' }))
            // .filter(({ id }) => id !== defaultTemplateID)
            .filter(({ locale }) => locale?.toLowerCase() === params.templateLanguage.toLowerCase()) || [],
          selected: false,
        });
      }

      setPlanTemplates(tmpls);
      setLoading(false);
    };

    fetchTemplates();
  }, [params.currentOrg, params.researchContext, params.templateLanguage, setPlanTemplates, t]);

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
    if (!params.selectedTemplate) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: t("You must choose a template"),
      });
    }

    let response;
    try {
      response = await planCreation.createPlan(params.selectedTemplate);
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
      localStorage.removeItem('researchContext');
    }
    if (localStorage.getItem('isStructured')) {
      localStorage.removeItem('isStructured');
    }
    if (localStorage.getItem('templateId')) {
      localStorage.removeItem('templateId');
    }
    if (localStorage.getItem('templateName')) {
      localStorage.removeItem('templateName');
    }
    if (localStorage.getItem('templateLanguage')) {
      localStorage.removeItem('templateLanguage');
    }

    window.location = `/plans/${response.data.id}`
  };

  const handleSelectedList = (selectedValue) => {
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
          className={`${styles.step_list} ${template.id === params.selectedTemplate ? styles.checked : ''}`}
          key={`template-${index}-${template.id}`}
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: '20px',
            marginTop: 0,
          }}
          onClick={() => {
            localStorage.setItem('templateId', template.id);
            localStorage.setItem('templateName', template.title);
            if (params.selectedTemplate === template.id) {
              return set(null);
            }
            return set(template.id, template.title);
          }}
        >
          <div
            key={`template-${index}-title`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {template?.structured && <PiTreeStructureDuotone size="18" style={{ marginRight: '10px' }} />}
            {template.title}
          </div>
          <ReactTooltip
            id={`template-${index}-description-tooltip`}
            place="left"
            effect="solid"
            variant="dark"
            key={`template-${index}-description-tooltip`}
            style={{ width: '600px', textAlign: 'center' }}
          >
            <div dangerouslySetInnerHTML={{
              __html: template?.description?.trim(),
            }} />
          </ReactTooltip>
          <FaMagnifyingGlass
            data-tooltip-id={`template-${index}-description-tooltip`}
            key={`template-${index}-magnifier`}
            size={18}
            style={{ marginRight: '10px', cursor: 'pointer' }}
          />
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

    data = data.map(({ name, id, templates, selected, type: dataType }) => {
      const types = {
        org: <HiOutlineBuildingOffice2 size="18" style={{ margin: '0 10px 0 0' }} />,
        funder: <PiBank size="18" style={{ margin: '0 10px 0 0' }} />
      };

      const hasSelectedTemplate = templates.some(({ id }) => id === params.selectedTemplate);

      return {
        label: name,
        value: id,
        type,
        selected: hasSelectedTemplate || selected,
        templates,
        prependIcon: types?.[dataType],
      };
    });

    const structuredTemplates = [];
    data.forEach(({ templates }) => {
      if (templates.length > 0) {
        structuredTemplates.push(templates);
      }
    });

    return structuredTemplates.length <= 0 ? noModelAvailable : <div style={{ marginLeft: '20px' }}>
      <CustomSelect
        key={`select-${index}-${type}`}
        placeholder={placeHolder}
        options={data}
        onSelectChange={handleSelectedList}
        selectedOption={data.find(({ selected }) => selected)}
      />
      <div key={`template-${index}-${type}`} style={{ margin: '10px 0 10px 20px' }}>
        {createList({
          index,
          templates: data.find(({ selected }) => selected)?.templates || [],
        })}
      </div>
    </div>;
  };

  return (
    <div>
      <h2>{t('Select a management plan template')}</h2>
      {loading && <CustomSpinner />}
      {!loading && error && <CustomError error={error} />}
      {!loading && !error && (
        <>
          <Trans
              defaults="You can choose a template provided by your organization, another organization or a funding agency.<br>The default template is <bold>{{model}}</bold>."
              values={{
                model: planTemplates?.default?.templates?.[0]?.title || 'Science Europe : modèle structuré',
              }}
              components={{ br: <br />, bold: <strong /> }}
          />
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0 20px 0' }}>
            <span>Légende:</span>
            <Label bsStyle="primary" style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
              <PiTreeStructureDuotone size={18} style={{ marginRight: '10px' }}/> <i>{t('Structured template')}</i>
            </Label>
            <Label bsStyle="primary" style={{ margin: '0 10px 0 10px', display: 'flex', alignItems: 'center' }}>
              <PiBank size={18} style={{ marginRight: '10px' }}/> <i>{t('Funders')}</i>
            </Label>
            <Label bsStyle="primary" style={{ display: 'flex', alignItems: 'center' }}>
              <HiOutlineBuildingOffice2 size={18} style={{ marginRight: '10px' }}/> <i>{t('Other organisation')}</i>
            </Label>
          </div>
          <div className="column">
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
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {prevStep}
            <div className="row" style={{ margin: '0 0 0 25px' }}>
              <CustomButton
                handleClick={handleSendTemplateId}
                title={t("Confirm my choice")}
                position="end"
                disabled={!params.selectedTemplate}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TemplateSelection;
