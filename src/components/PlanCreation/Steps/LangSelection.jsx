import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { GlobalContext } from "../../context/Global";
import styles from "../../assets/css/steps.module.css";
import CustomButton from "../../Styled/CustomButton";

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
      <h2>{t('Select the type of shot you want')}</h2>
      {
        languages.map(({ label, value, description }, index) => (
          <div
            key={`first-step-${index}-container`}
            className={`${styles.step_list}  ${templateLanguage === value ? styles.checked : ''}`}
            onClick={() => {
              localStorage.setItem('templateLanguage', value);
              if (templateLanguage === value) {
                return setTemplateLanguage(null);
              }
              return setTemplateLanguage(value);
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
        <div className="row" style={{ margin: '0 0 0 25px' }}>
          <CustomButton
            handleClick={nextStep}
            title={t("Confirm my choice")}
            position="end"
            disabled={!templateLanguage && !languages.map(({ value }) => value).includes(templateLanguage)}
          />
        </div>
      </div>
    </div>
  );
}

export default LangSelection;
