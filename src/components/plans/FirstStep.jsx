import React, { useContext } from "react";
import { GlobalContext } from "../context/Global";
import styles from "../assets/css/steps.module.css";
import CircleTitle from "../Styled/CircleTitle";
import CustumButton from "../Styled/CustumButton";

/**
 * This is a React component that renders a form with two radio buttons and a button to validate the user's choice of context for a DMP (Data Management
 * Plan).
 * @returns A React component that renders a form with two radio buttons and a button to validate the user's choice. The component also uses context to
 * set the value of the selected radio button.
 */
function FirstStep({ handleNextStep }) {
  const { setContext } = useContext(GlobalContext);

  /**
   * When the checkbox is checked, the value of the checkbox is passed to the handleCheck
   * function, which then sets the context state to the value of the
   * checkbox.
   */
  const handleCheck = (val) => {
    setContext({ context: val });
  };

  return (
    <div>
      <CircleTitle number="1" title="Indiquez le contexte de votre DMP"></CircleTitle>
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
            Projet de recherche
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
            Structure de recherche
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
        <CustumButton handleNextStep={handleNextStep} title="Valider mon choix" position="start"></CustumButton>
      </div>
    </div>
  );
}

export default FirstStep;
