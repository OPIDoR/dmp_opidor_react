import React, { useContext, useEffect, useState } from "react";
import { getQuestion } from "../../services/DmpRedactionApi";
import CustomSpinner from "../Shared/CustomSpinner";
import { Panel, PanelGroup } from "react-bootstrap";
import styles from "../assets/css/redactions.module.css";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import Swal from "sweetalert2";
import { deleteResearchOutput } from "../../services/DmpResearchOutput";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Section from "./Section";

function SectionsContent({ researchOutputId, planId, hasPersonalData, readonly }) {
  const { t } = useTranslation();
  const { 
    isCollapsed, setIsCollapsed,
    setInitialQuestionCollapse,
    setResearchOutputsData, researchOutputsData,
    planData, setPlanData,
    setQuestionsWithGuidance,
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sectionsData, setSectionsData] = useState(null);
  const [displayedResearchOutput, setDisplayedResearchOutput] = useState(null);
  const [showResearchOutputInfo, setShowResearchOutputInfo] = useState(false);

  /* A useEffect hook that is called when the component is mounted. It is calling the getQuestion function, which is an async function that returns a
promise. When the promise is resolved, it sets the data state to the result of the promise. It then sets the initialQuestionCollapse state to the result of
the promise. It then sets the isCollapsed state to the result of the promise. If the promise is rejected, it sets the error state to the error.
Finally, it sets the loading state to false. */
  useEffect(() => {
    setLoading(true);
    getQuestion("token")
      .then((res) => {
        const researchOutputFilter = res.data.plan.research_outputs.filter((el) => {
          return el.id === researchOutputId;
        });
        setDisplayedResearchOutput(researchOutputFilter[0]);
        setQuestionsWithGuidance(res?.data?.plan.questions_with_guidance || []);
        setPlanData(res.data);
        const result = res.data.sections;
        setSectionsData(result);
        if (!isCollapsed || !isCollapsed[researchOutputId]) {
          const allCollapses = res.data.sections.map((plan) => plan.questions.reduce((acc, _, idx) => ({ ...acc, [idx]: true }), {}));
          const updatedCollapseState = { ...isCollapsed, [researchOutputId]: allCollapses };
          setInitialQuestionCollapse(updatedCollapseState);
          setIsCollapsed(updatedCollapseState);
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [researchOutputId, researchOutputsData, isCollapsed]);


  /**
   * The function handles the deletion of a product from a research output and displays a confirmation message using the SweetAlert library.
   */
  const handleDelete = (e) => {
    const index = planData.plan.research_outputs
      .map(function (img) {
        return img.id;
      })
      .indexOf(researchOutputId);
    e.preventDefault();
    e.stopPropagation();
    if (index == 0) {
      toast.error(t("You cannot delete the first element"));
    } else {
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
          deleteResearchOutput(researchOutputId, planId).then((res) => {
            //const objectList = { ...researchOutputs };
            //delete objectList[researchOutputId];
            //setResearchOutputs(objectList);
            setResearchOutputsData(res.data.plan.research_outputs);
          });
          Swal.fire(t("Deleted!"), t("Operation completed successfully!."), "success");
        }
      });
    }
  };

  return (
    <>
      <div>
        {loading && <CustomSpinner></CustomSpinner>}
        {!loading && error && <CustomError></CustomError>}
        {!loading && !error && sectionsData && (
          <div>
            <div className="row"></div>

            <div className={styles.redaction_bloc}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  className="alert alert-info col-md-10"
                  style={{ display: "flex", justifyContent: "space-between" }}
                  onClick={() => setShowResearchOutputInfo(!showResearchOutputInfo)}
                >
                  <strong>{displayedResearchOutput?.abbreviation}</strong>
                  <span
                    style={{ marginRight: "10px" }}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={`${t("Contains personal data")} : ${displayedResearchOutput?.metadata?.hasPersonalData ? t("Yes") : t("No")} `}
                  >
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <i className="fas fa-info-circle" style={{ fontSize: "30px" }} />
                    </a>
                  </span>
                </div>

                {!readonly && (
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
                    - {t("Search Product Name")} : <strong style={{ fontSize: "20px" }}>{displayedResearchOutput?.metadata?.abbreviation}</strong>
                  </div>
                  <div className={styles.sous_title}>
                    - {t("Contains personal data")} :
                    <strong style={{ fontSize: "20px" }}>{displayedResearchOutput?.metadata?.hasPersonalData ? t("Yes") : t("No")}</strong>
                  </div>
                </div>
              )}
              {sectionsData.map((section) => (
                <Section 
                  key={section.id}
                  section={section}
                  planId={planId}
                  researchOutputId={researchOutputId}
                  hasPersonalData={hasPersonalData}
                  readonly={readonly}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SectionsContent;
