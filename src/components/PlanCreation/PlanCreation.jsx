import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Step, Stepper } from 'react-form-stepper';


import { CustomButton } from "../Styled";
import { ContextSelection, TypeSelection , TemplateSelection } from './Steps';
import styles from '../assets/css/main.module.css';
import stepperStyles from '../assets/css/stepper.module.css';
import { GlobalContext } from '../context/Global';
import { t } from 'i18next';

function PlanCreation({ locale = 'en_GB', currentOrgId, currentOrgName }) {
  const { i18n } = useTranslation();
  const {
    setLocale,
    setCurrentOrg,
    setUrlParams,
    researchContext, setResearchContext,
    isStructured, setIsStructured,
    selectedTemplate, setSelectedTemplate,
  } = useContext(GlobalContext);

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      label: t('Context selection'),
      component: <ContextSelection />,
    },
    {
      label: t('Type selection'),
      component: <TypeSelection />,
    },
    {
      label: t('Template selection'),
      component: <TemplateSelection />,
    }
  ];

  useEffect(() => {
    setLocale(locale);
    setCurrentOrg({id: currentOrgId, name: currentOrgName});
    i18n.changeLanguage(locale.substring(0, 2));

    setResearchContext(researchContext || localStorage.getItem('researchContext') || null);

    const isStructuredValue = localStorage.getItem('isStructured');
    setIsStructured(isStructured || isStructuredValue ? isStructuredValue === 'true' : null);

    setSelectedTemplate(selectedTemplate || Number.parseInt(localStorage.getItem('templateId'), 10) || null);

    const queryParameters = new URLSearchParams(window.location.search);
    let step = Number.parseInt(queryParameters.get('step'), 10) || 0;

    if (!researchContext) { step = 0; }

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
                steps.map(({ label }, index) => (
                  <Step
                    key={`step-${index}`}
                    label={label}
                    onClick={() => handleStep(index)}
                  />
                ))
              }
            </Stepper>
            <div style={{ padding: '0 20px', boxSizing: 'border-box' }}>
              {
                steps.map(({ component }, index) => {
                  return currentStep === index && React.cloneElement(component, {
                    key: `step-${index}-component`,
                    nextStep,
                    prevStep: index > 0 ? prevStep : undefined,
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
