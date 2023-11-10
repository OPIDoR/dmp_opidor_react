import React, { useContext, useEffect } from "react";
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
function FirstStep({ handleNextStep }) {
  const { t } = useTranslation();
  const { setResearchContext } = useContext(GlobalContext);

  /**
   * When the checkbox is checked, the value of the checkbox is passed to the handleCheck
   * function, which then sets the context state to the value of the
   * checkbox.
   */
  const handleCheck = (val) => {
    setResearchContext(val);
  };

  return (
    <div>
      <CircleTitle number="1" title={t('Indicate the context of your DMP')} />
      <div className="column">
        <div className="form-check">
          <input
            className={`form-check-label ${styles.check}`}
            type="radio"
            name="planContext"
            id="researchProject"
            onClick={() => handleCheck("research_project")}
            style={{ cursor: 'pointer' }}
          />
          <label
            className={`form-check-label ${styles.label_title}`}
            htmlFor="researchProject"
            style={{ cursor: 'pointer' }}
          >
            {t('For a research project')}
          </label>
          <div className={styles.list_context}>
            {t('You are leading or participating in a research project, you are carrying out a research activity, you are preparing a doctorate.')}
          </div>
        </div>
        <div className="form-check">
          <input
            className={`form-check-label ${styles.check}`}
            type="radio"
            name="planContext"
            id="researchStructure"
            onClick={() => handleCheck("research_structure")}
            style={{ cursor: 'pointer' }}
          />
          <label
            className={`form-check-label ${styles.label_title}`}
            htmlFor="researchStructure"
            style={{ cursor: 'pointer' }}
          >
            {t('For a research entity')}
          </label>
          <div className={styles.list_context}>
            {t('You administer a data analysis or processing platform, a bioinformatics platform, a research infrastructure, an observatory, a research unit, a laboratory.')}
          </div>
        </div>
      </div>
      <div className="row">
        {/* <button type="button" className="btn btn-primary validate" onClick={handleNextStep}>
          Valider mon choix
        </button> */}
        <CustomButton handleClick={handleNextStep} title={t("Confirm my choice")} position="start"></CustomButton>
      </div>
    </div>
  );
}

export default FirstStep;
