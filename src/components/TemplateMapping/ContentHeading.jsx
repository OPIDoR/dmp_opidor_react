import React from "react";
import CustomButton from "../Styled/CustomButton";
import { t } from "i18next";

function ContentHeading({ templateMappingId, saveMapping }) {
  const stickyStyle = {
    position: "sticky",
    top: "60px", // Replace with navbar height constant
    zIndex: 1000,
    backgroundColor: "white",
    width: "100%",
  };

  return (
    <div className="row content-heading" style={stickyStyle}>
      <div className="col-md-12">
        <h1 style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <a href="/super_admin/template_mappings" className="btn btn-primary pull-left">{t('← All Mappings')}</a>
          </div>
          <span>{(templateMappingId ? `${t('Edit Mapping')} ${templateMappingId}` : t('Create Mapping'))}</span>
          <div>
            <div style={{ visibility: templateMappingId ? 'visible' : 'hidden' }}>
              <CustomButton
                title="💾 Save mapping"
                handleClick={saveMapping}
                buttonColor="orange" />
            </div>
          </div>
        </h1>
      </div>
    </div>
  );
}

export default ContentHeading;