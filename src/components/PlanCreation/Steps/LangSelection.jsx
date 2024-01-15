import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { GlobalContext } from "../../context/Global";
import styles from "../../assets/css/steps.module.css";

function LangSelection({ prevStep, nextStep }) {
  const { t } = useTranslation();
  const { templateLanguage, setTemplateLanguage } = useContext(GlobalContext);

  const languages = [
    {
      label: 'Français',
      value: 'fr-FR',
      description: t('Forms and recommendations will be in French'),
    },
    {
      label: 'English (UK)',
      value: 'en-GB',
      description: t('Forms and recommendations will be in English'),
    },
  ];
 
  return (
    <div>
      <h2>{t('Select plan language')}</h2>
      {
        languages.map(({ label, value, description }, index) => (
          <div
            key={`first-step-${index}-container`}
            className={`${styles.step_list}  ${templateLanguage === value ? styles.checked : ''}`}
            onClick={() => {
              localStorage.setItem('templateLanguage', value);
              setTemplateLanguage(value);
              return nextStep();
            }}
          >
            <div
              id={`type-selection-${index}-label`}
              key={`type-selection-${index}-label`}
              className={styles.step_title}
            >
              {label}
            </div>
            <div key={`type-selection-${index}-description`}>{description}</div>
          </div>
        ))
      }
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {prevStep}
      </div>
    </div>
  );
}

export default LangSelection;
