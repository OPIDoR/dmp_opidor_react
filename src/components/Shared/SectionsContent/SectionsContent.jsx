import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { writePlan } from "../../../services";
import CustomSpinner from "../CustomSpinner";
import { GlobalContext } from "../../context/Global";
import CustomError from "../CustomError";
import Section from "./Section";
import * as styles from "../../assets/css/write_plan.module.css";
import useSectionsMode from "../../../hooks/useSectionsMode";



function SectionsContent({ templateId, readonly, afterFetchTreatment, children }) 
{
  // --- STATE ---
  const { t } = useTranslation();
  const {
    openedQuestions,
    displayedResearchOutput, 
  } = useContext(GlobalContext);
  const { mode } = useSectionsMode();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sectionsData, setSectionsData] = useState(null);


  // --- BEHAVIOURS ---
  
  /**
    * A useEffect hook that is called when the component is mounted.
    */
  useEffect(() => {
    fetchAndProcessData();
  }, [templateId, mode]);

  /**
   * Call data fetching, then call a custom processing if provided in the props
   * @returns void
   */
  const fetchAndProcessData = async () => {
    const res = await fetchAndDisplayData();
    if (!afterFetchTreatment) return;
    afterFetchTreatment(res, openedQuestions, displayedResearchOutput);
  };
  
  /**
   * It is calling the getSectionsData function, which is an async function that returns a
   * promise. When the promise is resolved, it sets the data state to the result of the promise. 
   * It then sets the openedQuestions state to the result of the promise.
   * If the promise is rejected, it sets the error state to the error.
   * Finally, it sets the loading state to false.
   * @returns AxiosResponse | void - Réponse de la requête
   */
  const fetchAndDisplayData = async () => {
    setLoading(true);

    const res = await writePlan.getSectionsData(templateId)
                        .catch((error) => setError(error))
                        .finally(() => setLoading(false));

    setSectionsData(res.data);

    return res;
  }

  // --- RENDER ---
  return (
    <div style={{ position: 'relative' }}>
      {loading && <CustomSpinner isOverlay={true}/>}
      {error && <CustomError error={error}/>}
      {!error && sectionsData?.sections && (
        <div className={styles.write_plan_block} id="sections-content">
          {children}
          {sectionsData?.sections?.map((section) => (
            <Section
              key={section.id}
              section={section}
              readonly={readonly}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SectionsContent;
