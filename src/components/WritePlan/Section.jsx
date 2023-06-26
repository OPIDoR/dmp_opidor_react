import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { GlobalContext } from "../context/Global";
import styles from "../assets/css/write_plan.module.css";
import Question from "./Question";


function Section({ section, hasPersonalData }) {
  const { t } = useTranslation();
  const { 
    isCollapsed, setIsCollapsed,
    displayedResearchOutput
  } = useContext(GlobalContext);

  const [initialCollapse, setInitialCollapse] = useState(null);
  const [sectionId] = useState(section.id);

  /**
   * If the idx passed in is the same as the elIndex, then set the value to false, otherwise set it to true.
   */
  const handleCollapseByIndex = (idx) => {
    const updatedState = isCollapsed[displayedResearchOutput.id].map((plan, planIndex) => {
      return Object.fromEntries(Object.entries(plan).map(([qIndex, value]) => [qIndex, planIndex === idx ? false : true]));
    });
    setIsCollapsed({ ...isCollapsed, [displayedResearchOutput.id]: updatedState });
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
              handleCollapseByIndex(sectionId);
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
              setIsCollapsed(initialCollapse);
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
          sectionId={sectionId}
          hasPersonalData={hasPersonalData}
        ></Question>
      ))}
    </>
  );
}

export default Section;
