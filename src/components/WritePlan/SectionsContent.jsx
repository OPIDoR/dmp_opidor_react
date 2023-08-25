import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { getSectionsData } from "../../services/DmpWritePlanApi";
import CustomSpinner from "../Shared/CustomSpinner";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import { deleteResearchOutput } from "../../services/DmpResearchOutput";
import styles from "../assets/css/write_plan.module.css";
import Section from "./Section";

function SectionsContent({ planId, templateId, readonly }) {
  const { t } = useTranslation();
  const { 
    openedQuestions, setOpenedQuestions,
    setResearchOutputs,
    displayedResearchOutput, setDisplayedResearchOutput,
    setQuestionsWithGuidance,
    planData,
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sectionsData, setSectionsData] = useState(null);
  const [showResearchOutputInfo, setShowResearchOutputInfo] = useState(false);

  /* A useEffect hook that is called when the component is mounted. It is calling the getSectionsData function, which is an async function that returns a
promise. When the promise is resolved, it sets the data state to the result of the promise. It then sets the openedQuestions state to the result of the promise.
If the promise is rejected, it sets the error state to the error.
Finally, it sets the loading state to false. */
  useEffect(() => {
    setLoading(true);
    console.log(templateId);
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
          const updatedCollapseState = { ...openedQuestions, [displayedResearchOutput.id]: {} };
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
          <div className="row"></div>
          <div className={styles.write_plan_block}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                className="alert alert-info col-md-10"
                style={{ display: "flex", justifyContent: "space-between" }}
                onClick={() => setShowResearchOutputInfo(!showResearchOutputInfo)}
              >
                <strong>{displayedResearchOutput.title}</strong>
                <span
                  style={{ marginRight: "10px" }}
                  data-toggle="tooltip"
                  data-placement="top"
                  title={`${t("Contains personal data")} : ${displayedResearchOutput.hasPersonalData ? t("Yes") : t("No")} `}
                >
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <i className="fas fa-circle-info" style={{ fontSize: "30px" }} />
                  </a>
                </span>
              </div>

              {!readonly && displayedResearchOutput.order !== 1 && (
                  <div>
                    <button className="btn btn-default" onClick={handleDelete} style={{ margin: " 15px 0px 0px 11px" }}>
                      {t("Delete")} <i className="fa fa-trash" style={{ marginLeft: "10px" }}></i>
                    </button>
                  </div>
                )}
            </div>
            {showResearchOutputInfo && (
              <div style={{ margin: "0px 10px 30px 10px" }}>
                <div className={styles.sous_title}>
                  - {t("Research Output Name")} : <strong style={{ fontSize: "20px" }}>{displayedResearchOutput.abbreviation}</strong>
                </div>
                <div className={styles.sous_title}>
                  - {t("Contains personal data")} :
                  <strong style={{ fontSize: "20px" }}>{displayedResearchOutput.hasPersonalData ? t("Yes") : t("No")}</strong>
                </div>
              </div>
            )}
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
