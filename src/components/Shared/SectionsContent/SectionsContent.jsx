import React, { useContext, useEffect, useState } from "react";
import { sectionsContent } from "../../../services";
import CustomSpinner from "../CustomSpinner";
import { GlobalContext } from "../../context/Global";
import CustomError from "../CustomError";
import Section from "./Section";
import * as styles from "../../assets/css/write_plan.module.css";
import useSectionsMapping from "../../../hooks/useSectionsMapping";

function SectionsContent({ templateId, readonly, afterFetchTreatment, children, id = null, hiddenFields, mappingUsage }) {
  // --- STATE ---
  const {
    openedQuestions,
    displayedResearchOutput,
  } = useContext(GlobalContext);

  const { setIsStructuredModel, setIsHiddenQuestionsFields, setUsage } = useSectionsMapping();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionsData, setSectionsData] = useState(null);

  // --- BEHAVIOURS ---

  /**
    * A useEffect hook that is called when the component is mounted.
    */
  useEffect(() => {
    setLoading(true);
    fetchAndProcessData();
  }, [templateId]);


  /**
   * It is calling the getSectionsData function, which is an async function that returns a
   * promise. When the promise is resolved, it sets the data state to the result of the promise. 
   * It then sets the openedQuestions state to the result of the promise.
   * If the promise is rejected, it sets the error state to the error.
   * Finally, it sets the loading state to false.
   * Then it calls a custom processing if provided in the props
   * @returns {void | any} - Réponse de la requête
   */
  const fetchAndProcessData = async () => {
    try {
      const res = await sectionsContent.getSectionsData(templateId);

      setSectionsData(res.data);
      setIsStructuredModel(id, res.data.structured);
      setIsHiddenQuestionsFields(id, hiddenFields);
      setUsage(id, mappingUsage);

      if (afterFetchTreatment)
        return afterFetchTreatment(res, openedQuestions, displayedResearchOutput);
    }
    catch (err) {
      setError(err);
    }
    finally {
      setLoading(false);
    }
  };

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
