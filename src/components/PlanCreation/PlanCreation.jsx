import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Step, Stepper } from 'react-form-stepper';
import { t } from 'i18next';

import { CustomButton } from "../Styled";
import { ContextSelection , TemplateSelection, LangSelection } from './Steps';
import styles from '../assets/css/main.module.css';
import stepperStyles from '../assets/css/stepper.module.css';
import { GlobalContext } from '../context/Global';

function PlanCreation({ locale = 'en_GB', currentOrgId, currentOrgName }) {
  const { t, i18n } = useTranslation();
  const { setLocale, setUrlParams } = useContext(GlobalContext);

  const [params, setParams] = useState({
    researchContext: null,
    templateLanguage: null,
    selectedTemplate: null,
    templateName: null,
    isStructured: false,
    currentOrg: { id: currentOrgId, name: currentOrgName },
  });

  const [currentStep, setCurrentStep] = useState(0);

  const context = {
    'research_project': t('For a research project'),
    'research_entity': t('For a research entity'),
  };

  const languages = {
    'fr-FR': 'Français',
    'en-GB': 'English (UK)'
  };

  const steps = [
    {
      label: t('Context selection'),
      component: <ContextSelection />,
      value: context[params.researchContext],
      set: (researchContext) => setParams({
        ...params,
        researchContext,
      }),
    },
    {
      label: t('Language selection'),
      component: <LangSelection />,
      value: languages[params.templateLanguage],
      set: (templateLanguage) => setParams({
        ...params,
        templateLanguage,
      }),
    },
    {
      label: t('Template selection'),
      component: <TemplateSelection />,
      value: params.templateName,
      set: (selectedTemplate, templateName) => setParams({
        ...params,
        selectedTemplate,
        templateName,
      }),
    }
  ];

  useEffect(() => {
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));

    const isStructuredValue = localStorage.getItem('isStructured');

    const researchContext = params.researchContext || localStorage.getItem('researchContext') || null;

    setParams({
      ...params,
      researchContext,
      templateLanguage: localStorage.getItem('templateLanguage'),
      selectedTemplate: params.selectedTemplate || Number.parseInt(localStorage.getItem('templateId'), 10) || null,
      templateName: localStorage.getItem('templateName'),
      isStructured: params.isStructured || isStructuredValue ? isStructuredValue === 'true' : null,
    })

    const queryParameters = new URLSearchParams(window.location.search);
    let step = Number.parseInt(queryParameters.get('step') || 0, 10);

    if (!researchContext) {
      step = 0;
    }

    setCurrentStep(step);
    setUrlParams({ step: `${step || 0}` });
  }, [locale, currentOrgId, currentOrgName]);

  const prevStep = <CustomButton
    handleClick={() => handleStep(currentStep - 1)}
    title={t("Go back to previous step")}
    position="start"
  />

  const nextStep = () => {
    handleStep(currentStep + 1);
  };

  const handleStep = (index) => {
    if (index < 0 || index > steps.length) { return; }

    setCurrentStep(index);
    setUrlParams({ step: index });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          <h1>{t('Create your plan in 3 steps')}</h1>
          <div className={`${styles.main} ${stepperStyles.stepper_container}`}>
            <Stepper
              activeStep={currentStep}
              connectorStateColors
              styleConfig={{
                activeBgColor: '#c6503d',
                size: 55,
                labelFontSize: 18
              }}
              className={stepperStyles.stepper_steps}
            >
              {
                steps.map(({ label, value }, index) => (
                  <Step
                    key={`step-${index}`}
                    label={<>{label}<br /><small><i>{value && `(${value})`}</i></small></>}
                    onClick={() => handleStep(index)}
                  />
                ))
              }
            </Stepper>
            <div style={{ padding: '0 20px', boxSizing: 'border-box' }}>
              {
                steps.map(({ component, set }, index) => {
                  return currentStep === index && React.cloneElement(component, {
                    key: `step-${index}-component`,
                    nextStep,
                    prevStep: index > 0 ? prevStep : undefined,
                    set,
                    params,
                    setUrlParams,
                  });
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanCreation;
