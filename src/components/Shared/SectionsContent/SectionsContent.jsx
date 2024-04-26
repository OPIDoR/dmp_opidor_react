import React, { Children, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { writePlan } from "../../../services";
import CustomSpinner from "../CustomSpinner";
import { GlobalContext } from "../../context/Global";
import CustomError from "../CustomError";
import { researchOutput } from "../../../services";
import Section from "./Section";
import ResearchOutputModal from "../../ResearchOutput/ResearchOutputModal";
import ResearchOutputInfobox from "../../ResearchOutput/ResearchOutputInfobox";
import * as styles from "../../assets/css/write_plan.module.css";
import useSectionsMode, { MODE_MAPPING, MODE_WRITING } from "../../../hooks/useSectionsMode";



function SectionsContent({ planId, templateId, readonly, children }) 
{
  // --- STATE ---
  const { t } = useTranslation();
  const {
    openedQuestions,
    setOpenedQuestions,
    researchOutputs, setResearchOutputs,
    displayedResearchOutput, setDisplayedResearchOutput,
    setPlanInformations,
    setUrlParams,
  } = useContext(GlobalContext);
  const { mode } = useSectionsMode();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sectionsData, setSectionsData] = useState(null);


  // --- BEHAVIOURS ---

  /* 
  A useEffect hook that is called when the component is mounted. It is calling the getSectionsData function, which is an async function that returns a
  promise. When the promise is resolved, it sets the data state to the result of the promise. It then sets the openedQuestions state to the result of the promise.
  If the promise is rejected, it sets the error state to the error.
  Finally, it sets the loading state to false. 
  */
  useEffect(() => {
    setLoading(true);

    writePlan.getSectionsData(templateId)
      .then((res) => {
        setSectionsData(res.data);

        if (mode !== MODE_WRITING) return;

        setPlanInformations({
          locale: res?.data?.locale.split('-')?.at(0) || 'fr',
          title: res?.data?.title,
          version: res?.data?.version,
          org: res?.data?.org,
          publishedDate: res?.data?.publishedDate,
        });

        if (openedQuestions && openedQuestions[displayedResearchOutput.id]) return;

        const updatedCollapseState = {
          ...openedQuestions,
          [displayedResearchOutput.id]: {},
        };
        setOpenedQuestions(updatedCollapseState);
        
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));

  }, [templateId, mode]);

  // --- RENDER ---
  return (
    <div style={{ position: 'relative' }}>
      {loading && <CustomSpinner isOverlay={true}></CustomSpinner>}
      {error && <CustomError error={error}></CustomError>}
      {!error && sectionsData?.sections && (
        <>
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
        </>
      )}
    </div>
  );
}

export default SectionsContent;
