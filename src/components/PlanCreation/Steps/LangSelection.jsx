import React from "react";
import { useTranslation } from "react-i18next";

import * as styles from "../../assets/css/steps.module.css";

function LangSelection({ prevStep, nextStep, set, params }) {
  const { t } = useTranslation();

  const languages = [
    {
      label: t('Français'),
      value: 'fr-FR',
      description: t('The template will be in French'),
    },
    {
      label: t('English (GB)'),
      value: 'en-GB',
      description: t('The template will be in English'),
    },
  ];

  return (
    <div>
      <h2>{t('Select plan language')}</h2>
      {
        languages.map(({ label, value, description }, index) => (
          <div
            key={`first-step-${index}-container`}
            className={`${styles.step_list}  ${params.templateLanguage === value ? styles.checked : ''}`}
            onClick={() => {
              localStorage.setItem('templateLanguage', value);
              set(value);
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
