import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { writePlan } from "../../services";
import CustomSpinner from "../Shared/CustomSpinner";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import { researchOutput } from "../../services";
import styles from "../assets/css/write_plan.module.css";
import Section from "./Section";
import ResearchOutputModal from "../ResearchOutput/ResearchOutputModal";
import ResearchOutputInfobox from "../ResearchOutput/ResearchOutputInfobox";


function SectionsContent({ planId, templateId, readonly }) {
  const { t } = useTranslation();
  const {
    openedQuestions,
    setOpenedQuestions,
    setResearchOutputs,
    displayedResearchOutput, setDisplayedResearchOutput,
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(null);
  const [sectionsData, setSectionsData] = useState(null);

  /* A useEffect hook that is called when the component is mounted. It is calling the getSectionsData function, which is an async function that returns a
  promise. When the promise is resolved, it sets the data state to the result of the promise. It then sets the openedQuestions state to the result of the promise.
  If the promise is rejected, it sets the error state to the error.
  Finally, it sets the loading state to false. */
  useEffect(() => {
    setLoading(true);
    writePlan.getSectionsData(templateId)
      .then((res) => {
        // const researchOutputFilter = res.data.plan.research_outputs.filter((el) => {
        //   return el.id === displayedResearchOutput.id;
        // });
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
        researchOutput.deleteResearchOutput(displayedResearchOutput.id, planId).then((res) => {
          setResearchOutputs(res.data.research_outputs);
          setDisplayedResearchOutput(res.data.research_outputs[0])
          toast.success(t("Research output was successfully deleted."));
        })
        .catch((error) => setError(error)) ;
      }
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShow(true);
    setEdit(true);
  };

  const handleClose = (e) => {
    setShow(false);
    setEdit(false);
  }

  return (
    <>
      {show && <ResearchOutputModal planId={planId} handleClose={handleClose} show={show} edit={edit} />}
      {loading && <CustomSpinner></CustomSpinner>}
      {!loading && error && <CustomError error={error}></CustomError>}
      {!loading && !error && sectionsData && (
        <>
          <div className={styles.write_plan_block}>
            <ResearchOutputInfobox handleEdit={handleEdit} handleDelete={handleDelete} readonly={readonly}></ResearchOutputInfobox>
            {sectionsData.map((section) => (
              <Section
                key={section.id}
                section={section}
                readonly={readonly}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default SectionsContent;
