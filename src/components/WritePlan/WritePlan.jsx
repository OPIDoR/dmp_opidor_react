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
    setQuestionsWithGuidance,
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

    const queryParameters = new URLSearchParams(window.location.search);
    const researchOutputId = queryParameters.get('research_output');

    writePlan.getPlanData(planId)
      .then((res) => {
        setPlanData(res.data);
        setDmpId(res.data.dmp_id);

        const { research_outputs, questions_with_guidance } = res.data;

        let currentResearchOutput = research_outputs?.[0];
        if (researchOutputId) {
          const researchOutput = research_outputs
            .find(({ id }) => id === Number.parseInt(researchOutputId, 10));
          if (researchOutput) {
            currentResearchOutput = researchOutput;
          }
        }

        setDisplayedResearchOutput(currentResearchOutput);
        !researchOutputs && setResearchOutputs(research_outputs);
        setQuestionsWithGuidance(questions_with_guidance || []);
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
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default WritePlan;
