import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";
import { Panel } from "react-bootstrap";
import { AiOutlineEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";

import { getSectionsData } from "../../services/DmpWritePlanApi";
import CustomSpinner from "../Shared/CustomSpinner";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import { deleteResearchOutput } from "../../services/DmpResearchOutput";
import styles from "../assets/css/write_plan.module.css";
import Section from "./Section";
import PanelBody from "react-bootstrap/lib/PanelBody";

function SectionsContent({ planId, templateId, readonly }) {
  const { t } = useTranslation();
  const {
    openedQuestions,
    setOpenedQuestions,
    setResearchOutputs,
    displayedResearchOutput, setDisplayedResearchOutput,
    setQuestionsWithGuidance,
    planData,
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sectionsData, setSectionsData] = useState(null);

  /* A useEffect hook that is called when the component is mounted. It is calling the getSectionsData function, which is an async function that returns a
  promise. When the promise is resolved, it sets the data state to the result of the promise. It then sets the openedQuestions state to the result of the promise.
  If the promise is rejected, it sets the error state to the error.
  Finally, it sets the loading state to false. */
  useEffect(() => {
    setLoading(true);
    getSectionsData(templateId)
      .then((res) => {
        // const researchOutputFilter = res.data.plan.research_outputs.filter((el) => {
        //   return el.id === displayedResearchOutput.id;
        // });
        // setQuestionsWithGuidance(res?.data?.plan.questions_with_guidance || []);
        setSectionsData(res.data);
        if (!openedQuestions || !openedQuestions[displayedResearchOutput.id]) {
          // const allCollapses = res.data.map((section) => {
          //   return {[section.id]: []};
          // });
          const updatedCollapseState = {
            ...openedQuestions,
            [displayedResearchOutput.id]: {},
          };
          setOpenedQuestions(updatedCollapseState);
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [templateId]);

  /**
   * The function handles the deletion of a product from a research output and displays a confirmation message using the SweetAlert library.
   */
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: t("Do you confirm the deletion"),
      text: t("By deleting this search product, the associated answers will also be deleted"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("Close"),
      confirmButtonText: t("Yes, delete!"),
    }).then((result) => {
      if (result.isConfirmed) {
        //delete
        deleteResearchOutput(displayedResearchOutput.id, planId).then((res) => {
          setResearchOutputs(res.data.research_outputs);
          setDisplayedResearchOutput(res.data.research_outputs[0])
          toast.success(t("Research output was successfully deleted."));
        })
        .catch((error) => setError(error)) ;
      }
    });
  };

  return (
    <>
      {loading && <CustomSpinner></CustomSpinner>}
      {!loading && error && <CustomError error={error}></CustomError>}
      {!loading && !error && sectionsData && (
        <>
          <div className={styles.write_plan_block}>
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
                          style={{
                            outline: "none",
                            color: "#fff",
                            padding: 0,
                            margin: "2px 5px 0 5px",
                          }}
                          // onClick={handleEdit}
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
                          style={{
                            outline: "none",
                            color: "#fff",
                            padding: 0,
                            margin: "2px 5px 0 5px",
                          }}
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
                    {t("Research Output Name")}: <strong>{displayedResearchOutput.abbreviation}</strong>
                    </li>
                  <li>
                    {t("Contains personal data")}: <strong>{displayedResearchOutput.hasPersonalData ? t("Yes") : t("No")}</strong>
                  </li>
                </ul>
              </PanelBody>
            </Panel>
            {sectionsData.map((section) => (
              <Section
                key={section.id}
                section={section}
                readonly={readonly}
              ></Section>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default SectionsContent;
