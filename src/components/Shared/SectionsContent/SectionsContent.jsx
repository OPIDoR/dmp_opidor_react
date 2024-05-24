import React, { useContext, useEffect, useState } from "react";
// import { sectionsContent } from "../../../services";
import CustomSpinner from "../CustomSpinner";
import { GlobalContext } from "../../context/Global";
import CustomError from "../CustomError";
import Section from "./Section";
import * as styles from "../../assets/css/write_plan.module.css";
import useSectionsMapping from "../../../hooks/useSectionsMapping";
import useTemplate from "../../../hooks/useTemplate";

function SectionsContent({ templateId, readonly, afterFetchTreatment, children, id = null, hiddenFields, mappingUsage }) {
  // --- STATE ---
  const {
    openedQuestions,
    displayedResearchOutput,
  } = useContext(GlobalContext);

  const { setIsStructuredModel, setIsHiddenQuestionsFields, setUsage } = useSectionsMapping();

  const { 
    loading, setLoading,
    error, 
    sectionsData, setSectionsData,
    fetchAndProcessSectionsData,
  } = useTemplate();

  // --- BEHAVIOURS ---

  /**
    * A useEffect hook that is called when the component is mounted.
    */
  useEffect(() => {
    async function fetchAndProcess() {
      setLoading(true);
      const res = await fetchAndProcessSectionsData(templateId, afterFetchTreatment, [openedQuestions, displayedResearchOutput]);
      setSectionsData(res.data);
      setIsStructuredModel(id, res.data.structured);
      setIsHiddenQuestionsFields(id, hiddenFields);
      setUsage(id, mappingUsage);
    }

    fetchAndProcess();
  }, [templateId]);

  // --- RENDER ---
  return (
    <div style={{ position: 'relative' }}>
      <div className={styles.write_plan_block} id="sections-content">
        {loading ? (
          <CustomSpinner isOverlay={true} />
        ) : error ? (
          <CustomError error={error} />
        ) : (
          <>
            {children}
            {sectionsData?.sections?.map((section) => (
              <Section
                id={id}
                key={section.id}
                section={section}
                readonly={readonly}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default SectionsContent;
