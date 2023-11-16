import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { GlobalContext } from "../../context/Global";
import styles from "../../assets/css/steps.module.css";
import CustomButton from "../../Styled/CustomButton";

function TypeSelection({ prevStep, nextStep }) {
  const { t } = useTranslation();
  const { isStructured, setIsStructured } = useContext(GlobalContext);

  const types = [
    {
      structured: true,
      title: t('Structured template'),
      description: 'Une courte description.',
    },
    {
      structured: false,
      title: t('Classic template'),
      description: 'Une courte description.',
    }
  ];
 
  return (
    <div>
      <h2>{t('Select the type of shot you want')}</h2>
      {
        types.map(({ structured, title, description }, index) => (
          <div
            key={`first-step-${index}-container`}
            className={`${styles.step_list}  ${isStructured === structured ? styles.checked : ''}`}
            onClick={() => {
              localStorage.setItem('isStructured', structured);
              setIsStructured(structured);
            }}
          >
            <div
              id={`type-selection-${index}-label`}
              key={`type-selection-${index}-label`}
              className={styles.step_title}
            >
              {title}
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
            disabled={!isStructured && ![true, false].includes(isStructured)}
          />
        </div>
      </div>
    </div>
  );
}

export default TypeSelection;
