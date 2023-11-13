import React, { useContext, useEffect, useState } from 'react';

import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import styles from '../assets/css/main.module.css';
import Info from '../Styled/Info';
import { GlobalContext } from '../context/Global';
import { useTranslation } from 'react-i18next';

/**
 * This is a React component that renders a plan with two steps and a banner, header, info message, and footer.
 * @returns The Plan component is being returned, which includes a Header, Banner, Info, FirstStep, SecondStep, and Footer components. The Info component
 * displays a message to the user, and the FirstStep and SecondStep components are conditionally rendered based on the state of the firstStep and
 * secondStep variables. The handleNextStep function is used to update the state of these variables when the user clicks a
 */
function PlanCreation({ locale = 'en_GB', currentOrgId, currentOrgName }) {
  const { i18n } = useTranslation();
  const { setLocale, setCurrentOrg, setUrlParams } = useContext(GlobalContext);
  const [steps, setSteps] = useState({
    firstStep: true,
    secondStep: false,
  });

  useEffect(() => {
    setLocale(locale);
    setCurrentOrg({id: currentOrgId, name: currentOrgName});
    i18n.changeLanguage(locale.substring(0, 2));

    const queryParameters = new URLSearchParams(window.location.search);
    const step = queryParameters.get('step');
    setSteps(prevSteps => ({
      firstStep: step === 'first',
      secondStep: step === 'second',
    }));
    setUrlParams({ step: step || 'first' });
  }, [locale, currentOrgId, currentOrgName]);

  const handleSteps = (step) => {
    setSteps(prevSteps => ({
      ...prevSteps,
      firstStep: step === 'first',
      secondStep: step === 'second',
    }));
    setUrlParams({ step });
  };

  return (
    <div className={styles.main}>
      {steps.firstStep && <FirstStep key="firstStep" nextStep={handleSteps} />}
      {steps.secondStep && <SecondStep key="secondStep" prevStep={handleSteps} />}
    </div>
  );
}

export default PlanCreation;
