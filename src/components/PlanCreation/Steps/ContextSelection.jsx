import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { GlobalContext } from "../../context/Global";
import styles from "../../assets/css/steps.module.css";
import CustomButton from "../../Styled/CustomButton";

/**
 * This is a React component that renders a form with two radio buttons and a button to validate the user's choice of context for a DMP (Data Management
 * Plan).
 * @returns A React component that renders a form with two radio buttons and a button to validate the user's choice. The component also uses context to
 * set the value of the selected radio button.
 */
function ContextSelection({ nextStep }) {
  const { t } = useTranslation();
  const { researchContext, setResearchContext } = useContext(GlobalContext);

  const categories = [
    {
      id: 'research_project',
      title: t('For a research project'),
      description: t('You are leading or participating in a research project, you are carrying out a research activity, you are preparing a doctorate.'),
    },
    {
      id: 'research_entity',
      title: t('For a research entity'),
      description: t('You administer a data analysis or processing platform, a bioinformatics platform, a research infrastructure, an observatory, a research unit, a laboratory.'),
    }
  ];
 
  return (
    <div>
      <h2>{t('Select the context in which you are developing your data management plan')}</h2>
      {
        categories.map(({ id, title, description }) => (
          <div
            key={`first-step-${id}-container`}
            className={`${styles.step_list}  ${researchContext === id ? styles.checked : ''}`}
            onClick={() => {
              localStorage.setItem('researchContext', id);
              if (researchContext === id) {
                return setResearchContext(null);
              }
              return setResearchContext(id);
            }}
          >
            <div
              id={`first-step-${id}-label`}
              key={`first-step-${id}-label`}
              className={styles.step_title}
            >
              {title}
            </div>
            <div key={`first-step-${id}-description`}>{description}</div>
          </div>
        ))
      }
      <div className="row" style={{ margin: '0 0 0 25px' }}>
        <CustomButton
          handleClick={nextStep}
          title={t("Confirm my choice")}
          position="end"
          disabled={!researchContext}
        />
      </div>
    </div>
  );
}

export default ContextSelection;
