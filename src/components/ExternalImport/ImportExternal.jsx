import React, { useEffect, useState } from "react";
import OrcidList from "./ORCID/OrcidList";
import RorList from "./ROR/RorList";
import { useTranslation } from "react-i18next";
import { Tooltip as ReactTooltip } from "react-tooltip";

function ImportExternal() {
  const { t } = useTranslation();
  const [showRor, setShowRor] = useState(false);
  const [showOrcid, setShowOrcid] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    setRenderKey(renderKey + 1);
  }, []);

  const toggleOrcid = () => {
    setShowOrcid(!showOrcid);
    setShowRor(false);
  };

  const toggleRor = () => {
    setShowRor(!showRor);
    setShowOrcid(false);
  };

  return (
    <div key={renderKey} style={{ margin: "15px" }}>
      <div style={{ marginBottom: "25px" }}>
        <ReactTooltip id="orcid" place="top" effect="solid" variant="info" content={t("ORCID id")} />
        <button data-tooltip-id="orcid" type="button" className="btn btn-dark" style={{ marginRight: "40px" }} onClick={toggleOrcid}>
          {t("Import personal data from ORCID")}
        </button>
        <ReactTooltip id="ror" place="top" effect="solid" variant="info" content={t("ROR id")} />
        <button data-tooltip-id="ror" type="button" className="btn btn-dark" onClick={toggleRor}>
          {t("Import affiliation from RoR")}
        </button>
      </div>

      <React.Fragment key={renderKey + 1}>
        {showOrcid && (
          <>
            <OrcidList></OrcidList>
            <div style={{ display: "flex", justifyContent: "center" }}></div>
          </>
        )}
        {showRor && (
          <>
            <RorList></RorList>
            <div style={{ display: "flex", justifyContent: "center" }}></div>
          </>
        )}
      </React.Fragment>
    </div>
  );
}

export default ImportExternal;
