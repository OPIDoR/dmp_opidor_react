import React, { act, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Step, Stepper } from 'react-form-stepper';

import { CustomButton } from "../Styled";
import {
  ActionSelection,
  ContextSelection,
  TemplateSelection,
  FormatSelection,
  LangSelection,
  Import,
} from './Steps';
import * as styles from '../assets/css/main.module.css';
import * as stepperStyles from '../assets/css/stepper.module.css';
import { GlobalContext } from '../context/Global';

function PlanCreation({ locale = 'en_GB', currentOrgId, currentOrgName }) {
  const { t, i18n } = useTranslation();
  const { setLocale, setUrlParams } = useContext(GlobalContext);

  const [params, setParams] = useState({
    action: null,
    researchContext: null,
    templateLanguage: null,
    selectedTemplate: null,
    format: null,
    templateName: null,
    isStructured: false,
    currentOrg: { id: currentOrgId, name: currentOrgName },
  });

  const [currentStep, setCurrentStep] = useState(0);

  const actions = {
    'import': t('Import an existing plan'),
    'create': t('Create new plan'),
  };

  const formats = {
    'standard': t('DMP OPIDoR Format'),
    'rda': t('RDA DMP Common Standard Format'),
  };

  const context = {
    'research_project': t('For a research project'),
    'research_entity': t('For a research entity'),
  };

  const languages = {
    'fr-FR': 'Français',
    'en-GB': 'English (UK)'
  };

  const [steps, setSteps] = useState([]);
  const dataSteps = [
    {
      label: t('Action selection'),
      component: <ActionSelection />,
      value: actions[params.action],
      set: (action) => setParams({
        ...params,
        action,
      }),
    },
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
  ];

  useEffect(() => {
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));

    setSteps(dataSteps);

    const isStructuredValue = localStorage.getItem('isStructured');

    const researchContext = params.researchContext || localStorage.getItem('researchContext') || null;

    const action = localStorage.getItem('action');

    setParams({
      ...params,
      action,
      format: localStorage.getItem('format'),
      researchContext,
      templateLanguage: localStorage.getItem('templateLanguage'),
      selectedTemplate: params.selectedTemplate || Number.parseInt(localStorage.getItem('templateId'), 10) || null,
      templateName: localStorage.getItem('templateName'),
      isStructured: params.isStructured || isStructuredValue ? isStructuredValue === 'true' : null,
    });

    if (action === 'create') {
      setSteps([
        ...dataSteps,
        {
          label: t('Template selection'),
          component: <TemplateSelection />,
          value: params.templateName,
          set: (selectedTemplate, templateName) => setParams({
            ...params,
            selectedTemplate,
            templateName,
          }),
        },
      ]);
    }

    if (action === 'import') {
      setSteps([
        ...dataSteps,
        {
          label: t('Format selection'),
          component: <FormatSelection />,
          value: formats[params.format],
          set: (format) => setParams({
            ...params,
            format,
          }),
        },
        {
          label: t('Import plan'),
          component: <Import />,
          value: '',
          set: () => console.log('Toto'),
        },
      ]);
    }

    const queryParameters = new URLSearchParams(window.location.search);
    let step = Number.parseInt(queryParameters.get('step') || 0, 10);

    if (!action) {
      step = 0;
    }

    setCurrentStep(step);
    setUrlParams({ step: `${step || 0}` });
  }, [locale, currentOrgId, currentOrgName, currentStep]);

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
          <h1>{t('Create or import your plan')}</h1>
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
