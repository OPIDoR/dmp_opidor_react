import React from "react";
import { useTranslation } from "react-i18next";

import * as styles from "../../assets/css/steps.module.css";

function ActionSelection({ nextStep, set, params }) {
  const { t } = useTranslation();

  const actions = [
    {
      id: 'create',
      title: t('Create a plan'),
      description: t('You create a new plan from a plan template proposed in DMP OPIDoR.'),
    },
    {
      id: 'import',
      title: t('Import an existing plan'),
      description: t('You want to reuse information from an existing plan using a json file.')
      // t('This feature is only available for structured management plans.'),
    }
  ];

  return (
    <div>
      <h2>{t('Select the modality with which you wish to create your plan')}</h2>
      {
        actions.map(({ id, title, description }) => (
          <div
            key={`first-step-${id}-container`}
            className={`${styles.step_list}  ${params.action === id ? styles.checked : ''}`}
            onClick={() => {
              localStorage.setItem('action', id);
              set(id);
              return nextStep();
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
    </div>
  );
}

export default ActionSelection;
