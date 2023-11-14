import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { GlobalContext } from "../context/Global";
import styles from "../assets/css/steps.module.css";
import CircleTitle from "../Styled/CircleTitle";
import CustomButton from "../Styled/CustomButton";

/**
 * This is a React component that renders a form with two radio buttons and a button to validate the user's choice of context for a DMP (Data Management
 * Plan).
 * @returns A React component that renders a form with two radio buttons and a button to validate the user's choice. The component also uses context to
 * set the value of the selected radio button.
 */
function FirstStep({ nextStep }) {
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
      <CircleTitle number="1" title={t('Indicate the context of your DMP')} />
      <div className="column">
        {
          categories.map(({ id, title, description }) => (
            <div className="form-check" key={`category-${id}-form`}>
              <input
                key={`category-${id}`}
                className={`form-check-label ${styles.check}`}
                type="radio"
                name="planContext"
                id={id}
                onClick={() => setResearchContext(id)}
                defaultChecked={researchContext === id}
                style={{ cursor: 'pointer' }}
              />
              <label
                key={`category-${id}-label`}
                className={`form-check-label ${styles.title}`}
                htmlFor={id}
                style={{ cursor: 'pointer', marginLeft: '10px' }}
              >
                {title}
              </label>
              <div className={styles.context_list} key={`category-${id}-description`}>{description}</div>
            </div>
          ))
        }
      </div>
      {researchContext && <div className="row" style={{ marginTop: '20px' }}>
        <CustomButton
          handleClick={() => nextStep('second')}
          title={t("Confirm my choice")}
          position="start"
        />
      </div>}
    </div>
  );
}

export default FirstStep;
