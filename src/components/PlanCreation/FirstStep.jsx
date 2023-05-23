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
    setResearchContext({ researchContext: val });
  };

  return (
    <div>
      <CircleTitle number="1" title={t('Indicate the context of your DMP')}></CircleTitle>
      <div className="column">
        <div className="form-check">
          <input
            className={`form-check-label ${styles.check}`}
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
            defaultChecked={true}
            onClick={() => handleCheck("research_project")}
          />
          <label className={`form-check-label ${styles.label_title}`} htmlFor="flexRadioDefault1">
            {t('Research Project')}
          </label>
          <div className={styles.list_context}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi erat tellus, pharetra sed ipsum ac, ornare lacinia leo. Curabitur rutrum
            commodo nibh eget ultricies. Aliquam viverra consequat nulla ac vehicula.
          </div>
        </div>
        <div className="form-check">
          <input
            className={`form-check-label ${styles.check}`}
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault2"
            onClick={() => handleCheck("research_structure")}
          />
          <label className={`form-check-label ${styles.label_title}`} htmlFor="flexRadioDefault2">
            {t('Research Structure')}
          </label>
          <div className={styles.list_context}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi erat tellus, pharetra sed ipsum ac, ornare lacinia leo. Curabitur rutrum
            commodo nibh eget ultricies. Aliquam viverra consequat nulla ac vehicula.
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
