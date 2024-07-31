import React, { useContext } from "react";
import * as styles from "../assets/css/write_plan.module.css";
import { Panel } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
import { AiOutlineEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";
import { BiDuplicate } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import PanelBody from "react-bootstrap/lib/PanelBody";

import { GlobalContext } from "../context/Global";

function ResearchOutputInfobox({ handleEdit, handleDelete, handleDuplicate, readonly }) {
  const { t } = useTranslation();
  const {
    researchOutputs,
    displayedResearchOutput
  } = useContext(GlobalContext);

  return (
    <Panel
      className={styles.panel}
      style={{
        borderRadius: "10px",
        borderWidth: "2px",
        borderColor: "var(--dark-blue)",
      }}
    >
      <Panel.Heading style={{
        backgroundColor: "rgb(28, 81, 112)",
        borderRadius: "5px 5px 0 0",
        color: "#fff",
      }}>
        <Panel.Title style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <strong>{displayedResearchOutput?.title}</strong>
          <span id="actions" style={{ display: "flex" }}>
            {!readonly && (
              <>
                <Tooltip anchorSelect="#editBtn" place="bottom">
                  {t("Edit")}
                </Tooltip>
                <button
                  type="button"
                  className="btn btn-link btn-sm m-0 p-0"
                  style={{ outline: "none", color: "#fff", padding: 0, margin: "2px 5px 0 5px" }}
                  onClick={handleEdit}
                  id="editBtn"
                >
                  <AiOutlineEdit size={22} />
                </button>
              </>
            )}
            {!readonly && (
              <>
                <Tooltip anchorSelect="#duplicateBtn" place="bottom">
                  {t("Duplicate")}
                </Tooltip>
                <button
                  type="button"
                  className="btn btn-link btn-sm m-0 p-0"
                  style={{ outline: "none", color: "#fff", padding: 0, margin: "2px 5px 0 5px" }}
                  onClick={handleDuplicate}
                  id="duplicateBtn"
                >
                  <BiDuplicate size={22} />
                </button>
              </>
            )}
            {!readonly && researchOutputs.length > 0 && (
              <>
                <Tooltip anchorSelect="#deleteBtn" place="bottom">
                  {t("Delete")}
                </Tooltip>
                <button
                  type="button"
                  className="btn btn-link btn-sm m-0 p-0"
                  style={{ outline: "none", color: "#fff", padding: 0, margin: "2px 5px 0 5px" }}
                  onClick={handleDelete}
                  id="deleteBtn"
                >
                  <FaTrash size={22} />
                </button>
              </>
            )}
          </span>
        </Panel.Title>
      </Panel.Heading>
      <PanelBody>
        <ul>
          <li>
            {t('Short name')} : <strong>{displayedResearchOutput.abbreviation}</strong>
          </li>
          <li>
            {t('Name')} : <strong>{displayedResearchOutput.title}</strong>
          </li>
          <li>
            {t('Type')} : <strong>{t(displayedResearchOutput.type || '-')}</strong>
          </li>
          <li>
            {t('Contains personal data')} : <strong>{displayedResearchOutput.configuration.hasPersonalData ? t('Yes') : t('No')}</strong>
          </li>
        </ul>
      </PanelBody>
    </Panel>
  );
}

export default ResearchOutputInfobox;
