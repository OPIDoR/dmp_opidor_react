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
function PlanCreation({ locale = 'en_GB' }) {
  const { t, i18n } = useTranslation();
  const { setLocale } = useContext(GlobalContext);
  const [firstStep, setFirstStep] = useState(true);
  const [secondStep, setSecondStep] = useState(false);

  useEffect(() => {
    console.log(locale);
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));
  }, [locale, setLocale, i18n]);

  /**
   * When the user clicks the button, the first step is set to false and the second step
   * is set to true.
   */
  const handleNextStep = () => {
    setFirstStep(!firstStep);
    setSecondStep(!secondStep);
  };

  return (
    <div className={styles.main}>
      <div className={styles.card_articles}>
        {firstStep && <FirstStep handleNextStep={handleNextStep}></FirstStep>}
        {secondStep && <SecondStep></SecondStep>}
      </div>
    </div>
  );
}

export default PlanCreation;
