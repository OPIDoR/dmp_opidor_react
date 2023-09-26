import React, { useContext, useEffect, useRef } from "react";
import styles from "../assets/css/write_plan.module.css";
import { Panel } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
import { AiOutlineEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";
import { GlobalContext } from "../context/Global";
import { useTranslation } from "react-i18next";
import PanelBody from "react-bootstrap/lib/PanelBody";
import consumer from "../../cable";


function ResearchOutputInfobox({ handleEdit, handleDelete, readonly }) {
  const { t } = useTranslation();
  const {
    displayedResearchOutput, setDisplayedResearchOutput
  } = useContext(GlobalContext);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if(subscriptionRef.current) subscriptionRef.current.unsubscribe();
    subscriptionRef.current = consumer.subscriptions.create({ channel: "ResearchOutputChannel", id: displayedResearchOutput.id },
      {
        connected: () => console.log("connected!"),
        disconnected: () => console.log("disconnected !"),
        received: data => setDisplayedResearchOutput({ ...displayedResearchOutput, ...data }),
      });
  }, [displayedResearchOutput, setDisplayedResearchOutput])

  useEffect(() => {
    return () => {
      consumer.disconnect();
    }
  }, [])


  return (
    <Panel
      className={styles.panel}
      style={{
        borderRadius: "10px",
        borderWidth: "2px",
        borderColor: "var(--primary)",
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
            {!readonly && displayedResearchOutput.order !== 1 && (
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
            {t("Title")}: <strong>{displayedResearchOutput.title}</strong>
          </li>
          <li>
            {t("Research Output Name")}: <strong>{displayedResearchOutput.abbreviation}</strong>
          </li>
          <li>
            {t("Contains personal data")}: <strong>{displayedResearchOutput.hasPersonalData ? t("Yes") : t("No")}</strong>
          </li>
          <li>
            {t("Type")}: <strong>{t(displayedResearchOutput.type || '-')}</strong>
          </li>
        </ul>
      </PanelBody>
    </Panel>
  );
}

export default ResearchOutputInfobox;
