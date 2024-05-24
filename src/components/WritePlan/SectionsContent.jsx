import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { writePlan } from "../../services";
import CustomSpinner from "../Shared/CustomSpinner";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import { researchOutput } from "../../services";
import Section from "./Section";
import ResearchOutputModal from "../ResearchOutput/ResearchOutputModal";
import ResearchOutputInfobox from "../ResearchOutput/ResearchOutputInfobox";
import * as styles from "../assets/css/write_plan.module.css";

function SectionsContent({ planId, readonly }) {
  const { t } = useTranslation();
  const {
    planTemplateId,
    loadedSectionsData, setLoadedSectionsData,
    openedQuestions,
    setOpenedQuestions,
    setResearchOutputs,
    displayedResearchOutput, setDisplayedResearchOutput,
    setPlanInformations,
    setUrlParams,
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(null);
  const [moduleId, setModuleId] = useState(null);


  useEffect(() => {
    setModuleId(displayedResearchOutput?.configuration?.moduleId || planTemplateId)
  }, [displayedResearchOutput])
  /* A useEffect hook that is called when the component is mounted. It is calling the getSectionsData function, which is an async function that returns a
  promise. When the promise is resolved, it sets the data state to the result of the promise. It then sets the openedQuestions state to the result of the promise.
  If the promise is rejected, it sets the error state to the error.
  Finally, it sets the loading state to false. */
  useEffect(() => {
    if (moduleId && !loadedSectionsData[moduleId]) {
      setLoading(true);
      writePlan.getSectionsData(moduleId)
        .then((res) => {
          setLoadedSectionsData({ ...loadedSectionsData, [moduleId]: res.data });
        })
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  }, [moduleId]);

  useEffect(() => {
    if (loadedSectionsData[moduleId]) {
      setPlanInformations({
        locale: loadedSectionsData[moduleId].locale.split('-')?.at(0) || 'fr',
        title: loadedSectionsData[moduleId].title,
        version: loadedSectionsData[moduleId].version,
        org: loadedSectionsData[moduleId].org,
        publishedDate: loadedSectionsData[moduleId].publishedDate,
      });
    }

  }, [loadedSectionsData[moduleId]])

  useEffect(() => {
    if (!openedQuestions || !openedQuestions[displayedResearchOutput.id]) {
      const updatedCollapseState = {
        ...openedQuestions,
        [displayedResearchOutput.id]: {},
      };
      setOpenedQuestions(updatedCollapseState);
    }

  }, [displayedResearchOutput])

  /**
   * The function handles the deletion of a product from a research output and displays a confirmation message using the SweetAlert library.
   */
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: t("Do you confirm the deletion?"),
      text: t("By deleting this research output, the associated answers will also be deleted"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("Close"),
      confirmButtonText: t("Yes, delete!"),
    }).then((result) => {
      if (result.isConfirmed) {
        //delete
        researchOutput.deleteResearchOutput(displayedResearchOutput.id, planId).then(({ data }) => {
          setResearchOutputs(data.research_outputs);

          const updatedOpenedQuestions = { ...openedQuestions };
          delete updatedOpenedQuestions[displayedResearchOutput.id];
          setOpenedQuestions(updatedOpenedQuestions);

          setDisplayedResearchOutput(data.research_outputs[0]);
          setUrlParams({ research_output: data.research_outputs[0].id });
          toast.success(t("Research output was successfully deleted."));
        })
          .catch((error) => setError(error));
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
    <div style={{ position: 'relative' }}>
      {show && <ResearchOutputModal planId={planId} handleClose={handleClose} show={show} edit={edit} />}
      {loading && <CustomSpinner isOverlay={true}></CustomSpinner>}
      {error && <CustomError error={error}></CustomError>}
      {!error && loadedSectionsData[moduleId]?.sections && (
        <>
          <div className={styles.write_plan_block} id="sections-content">
            <ResearchOutputInfobox handleEdit={handleEdit} handleDelete={handleDelete} readonly={readonly}></ResearchOutputInfobox>
            {loadedSectionsData[moduleId]?.sections?.map((section) => (
              <Section
                key={section.id}
                section={section}
                readonly={readonly}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SectionsContent;
