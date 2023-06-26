import React, { useContext } from "react";

import { GlobalContext } from "../context/Global";
import Question from "./Question";
import styles from "../assets/css/redactions.module.css";
import { useTranslation } from "react-i18next";

function Section({section, researchOutputId, planId, hasPersonalData, readonly}) {
  const { t } = useTranslation();
  const { 
    isCollapsed, setIsCollapsed,
    initialQuestionCollapse,
  } = useContext(GlobalContext);

  /**
   * If the idx passed in is the same as the elIndex, then set the value to false, otherwise set it to true.
   */
  const handleCollapseByIndex = (sectionId) => {
    const updatedState = isCollapsed[researchOutputId].map((plan, planIndex) => {
      return Object.fromEntries(Object.entries(plan).map(([qIndex, value]) => [qIndex, planIndex === sectionId ? false : true]));
    });
    setIsCollapsed({ ...isCollapsed, [researchOutputId]: updatedState });
  };

  return (
    <>
      <p className={styles.title}>
        {section.number}. {section.title}
      </p>
      <div className="column">
        <div className={styles.collapse_title}>
          <a
            href="#"
            className={styles.sous_title}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCollapseByIndex(section.id);
            }}
          >
            {t("Expand all")}
          </a>
          <span className={styles.sous_title}> | </span>
          <a
            href="#"
            className={styles.sous_title}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsCollapsed(initialQuestionCollapse);
            }}
          >
            {t("Collapse all")}
          </a>
        </div>
      </div>
      {section.questions.map((question) => (
        <Question
          key={question.id}
          question={question}
          sectionId={section.id}
          planId={planId}
          researchOutputId={researchOutputId}
          hasPersonalData={hasPersonalData}
          readonly={readonly}
        />
      ))}
    </>
  );
};

export default Section;