import React, { useContext } from "react";
import { GlobalContext } from "../context/Global";

function FirstStep({ handleNextStep }) {
  const { setContext } = useContext(GlobalContext);

  /**
   * When the checkbox is checked, the value of the checkbox is passed to the handleCheck
   * function, which then sets the context state to the value of the
   * checkbox.
   */
  const handleCheck = (val) => {
    console.log(val);
    setContext({ context: val });
  };

  return (
    <div className="container-card">
      <div className="row">
        <div className="row circle-content">
          <div className="rom">
            <div className="col-md-4 circle">1</div>
            <div className="circle-text col-md-8 ">Indiquez le contexte de votre DMP</div>
          </div>
        </div>
      </div>
      <div className="column">
        <div className="form-check">
          <input
            className="form-check-input check"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
            defaultChecked={true}
            onClick={() => handleCheck("research_project")}
          />
          <label className="form-check-label label-title" htmlFor="flexRadioDefault1">
            Projet de recherche
          </label>
          <div className="list-context">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi erat tellus, pharetra sed ipsum ac, ornare lacinia leo. Curabitur rutrum
            commodo nibh eget ultricies. Aliquam viverra consequat nulla ac vehicula.
          </div>
        </div>
        <div className="form-check">
          <input
            className="form-check-input check"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault2"
            onClick={() => handleCheck("research_structure")}
          />
          <label className="form-check-label label-title" htmlFor="flexRadioDefault2">
            Structure de recherche
          </label>
          <div className="list-context">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi erat tellus, pharetra sed ipsum ac, ornare lacinia leo. Curabitur rutrum
            commodo nibh eget ultricies. Aliquam viverra consequat nulla ac vehicula.
          </div>
        </div>
      </div>
      <div className="row">
        <button type="button" className="btn btn-primary validate" onClick={handleNextStep}>
          Valider mon choix
        </button>
      </div>
    </div>
  );
}

export default FirstStep;
