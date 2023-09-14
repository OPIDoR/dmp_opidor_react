import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";

import SectionsContent from "./SectionsContent";
import { writePlan } from "../../services";
import CustomSpinner from "../Shared/CustomSpinner";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import { createDynamicObject, roundedUpDivision } from "../../utils/GeneratorUtils";
import GuidanceChoice from "./GuidanceChoice";
import ResearchOutputsTabs from "./ResearchOutputsTabs";
import styles from "../assets/css/sidebar.module.css";

function WritePlan({
  locale = 'en_GB',
  planId,
  templateId,
  userId,
  readonly,
}) {
  const { t, i18n } = useTranslation();
  const {
    setLocale,
    setFormData,
    setPlanData,
    setDmpId,
    displayedResearchOutput, setDisplayedResearchOutput,
    researchOutputs, setResearchOutputs,
    setUserId,
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    setUserId(userId);
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));
  }, [locale])

  /* A hook that is called when the component is mounted. It is used to fetch data from the API. */
  //TODO update this , it can make error
  useEffect(() => {
    setLoading(true);
    writePlan.getPlanData(planId)
      .then((res) => {
        setPlanData(res.data);
        setDmpId(res.data.dmp_id);
        setDisplayedResearchOutput(res.data.research_outputs[0]);
        !researchOutputs && setResearchOutputs(res.data.research_outputs);
        setFormData(null);
        // if (result.length > itemsPerPage) {
        //   let resultDivision = roundedUpDivision(result.length, itemsPerPage);
        //   setOpenedQuestions(createDynamicObject(resultDivision));
        // }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [planId]);


  return (
    <>
      {!readonly && (
        <div className="container">
          <GuidanceChoice planId={planId} />
        </div>
      )}
      <div className={styles.section}>
        {loading && <CustomSpinner></CustomSpinner>}
        {!loading && error && <CustomError error={error}></CustomError>}
        {!loading && !error && researchOutputs && (
          <>
            <ResearchOutputsTabs planId={planId} readonly={readonly} />
            <div className={styles.main}>
              {planId && displayedResearchOutput && (
                <SectionsContent
                  planId={planId}
                  templateId={templateId}
                  readonly={readonly}
                ></SectionsContent>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default WritePlan;
