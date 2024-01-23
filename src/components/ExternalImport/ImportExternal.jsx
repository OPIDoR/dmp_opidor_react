import React, { useState } from "react";
import OrcidList from "./ORCID/OrcidList";
import RorList from "./ROR/RorList";
import { useTranslation } from "react-i18next";
import { Tooltip as ReactTooltip } from "react-tooltip";

function ImportExternal({ fragment, setFragment, externalImport = [] }) {
  const { t } = useTranslation();
  const [showRor, setShowRor] = useState(false);
  const [showOrcid, setShowOrcid] = useState(false);

  const toggleOrcid = () => {
    setShowOrcid(!showOrcid);
    setShowRor(false);
  };

  const toggleRor = () => {
    setShowRor(!showRor);
    setShowOrcid(false);
  };

  const buttonColor = (buttonActive) => {
    return buttonActive ? "var(--green)" : "var(--dark-blue)";
  }

  return (
    <div style={{ margin: "0 15px" }}>
      <div style={{ marginBottom: "25px" }}>
        {externalImport?.includes('orcid') && (
          <button data-tooltip-id="orcid" type="button" className="btn btn-dark" style={{ marginRight: "40px", color: "white", backgroundColor: buttonColor(showOrcid) }} onClick={toggleOrcid}>
            {t('Retrieve ORCID identifier')}
          </button>
        )}
        {externalImport?.includes('ror') && (
          <button data-tooltip-id="ror" type="button" className="btn btn-dark" style={{ color: "white", backgroundColor: buttonColor(showRor) }} onClick={toggleRor}>
            {t('Retrieve ROR identifier')}
          </button>
        )}
      </div>

      {showOrcid && (
        <>
          <OrcidList
            fragment={fragment}
            setFragment={setFragment}
          />
          <div style={{ display: "flex", justifyContent: "center" }}></div>
        </>
      )}
      {showRor && (
        <>
          <RorList
            fragment={fragment}
            setFragment={setFragment}
          />
          <div style={{ display: "flex", justifyContent: "center" }}></div>
        </>
      )}
    </div>
  );
}

export default ImportExternal;
