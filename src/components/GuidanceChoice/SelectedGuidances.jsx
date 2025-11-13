import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FaEye } from 'react-icons/fa6';
import { GlobalContext } from "../context/Global";

function SelectedGuidances() {
  const { t } = useTranslation();
  const {
    selectedGuidances
  } = useContext(GlobalContext);
  return (
    <>
      {selectedGuidances.length > 0 && (
        <div style={{ margin: '20px' }}>
          <h3>{t("followingGuidancesApplyToThisResearchOutput")}</h3>
          <ul>
            {selectedGuidances.map((guidance) => (
              <li key={guidance.id}>
                {guidance.title} ({t("providedBy")} {guidance.orgName})
                <a href={`/guidance_group_export/${guidance.id}.pdf`} target="_blank" rel="noopener noreferrer">
                  <FaEye size={14} style={{ marginLeft: '5px' }} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default SelectedGuidances;
