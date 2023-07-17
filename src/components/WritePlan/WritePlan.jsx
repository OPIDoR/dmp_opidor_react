import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";

import SectionsContent from "./SectionsContent";
import { getPlanData } from "../../services/DmpWritePlanApi";
import CustomSpinner from "../Shared/CustomSpinner";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import { createDynamicObject, roundedUpDivision } from "../../utils/GeneratorUtils";
import Recommandation from "./Recommandation";
import ResearchOutputsTabs from "./ResearchOutputsTabs";
import styles from "../assets/css/sidebar.module.css";

function WritePlan({
  locale = 'en_GB',
  planId,
  templateId,
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
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [renderKey, setRenderKey] = useState(0);
  const [hasPersonalData, setHasPersonalData] = useState(null);

  useEffect(() => {
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));
  }, [locale])

  /* A hook that is called when the component is mounted. It is used to fetch data from the API. */
  //TODO update this , it can make error
  useEffect(() => {
    setLoading(true);
    getPlanData(planId)
      .then((res) => {
        setPlanData(res.data);
        setDmpId(res.data.dmp_id);
        setDisplayedResearchOutput(res.data.research_outputs[0]);
        // setHasPersonalData(researchOutputs[0].id;?.metadata?.hasPersonalData);
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
      {/*
          {!readonly && (<div className="container">
            <Recommandation planId={planId} setTriggerRender={setTriggerRender} />
      </div>)}*/}
      <div className={styles.section}>
        {loading && <CustomSpinner></CustomSpinner>}
        {!loading && error && <CustomError error={error}></CustomError>}
        {!loading && !error && researchOutputs && (
          <>
            <ResearchOutputsTabs planId={planId} />
            <div className={styles.main}>
              {planId && displayedResearchOutput && (
                <SectionsContent
                  planId={planId}
                  templateId={templateId}
                  hasPersonalData={hasPersonalData}
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
