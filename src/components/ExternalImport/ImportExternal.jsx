import React, { useState } from "react";
import OrcidList from "./ORCID/OrcidList";
import RorList from "./ROR/RorList";

function ImportExternal() {
  const [showRor, setShowRor] = useState(false);
  const [showOrcid, setShowOrcid] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  const toggleOrcid = () => {
    setShowOrcid(!showOrcid);
    setShowRor(false);
  };

  const toggleRor = () => {
    setShowRor(!showRor);
    setShowOrcid(false);
  };

  return (
    <div style={{ margin: "10px" }}>
      <button type="button" className="btn btn-dark" style={{ marginRight: "40px" }} onClick={toggleOrcid}>
        ORCID
      </button>
      <button type="button" className="btn btn-dark" onClick={toggleRor}>
        ROR
      </button>
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
