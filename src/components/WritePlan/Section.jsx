import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { GlobalContext } from "../context/Global";
import styles from "../assets/css/write_plan.module.css";
import Question from "./Question";

function Section({ section, readonly }) {
  const { t } = useTranslation();
  const { openedQuestions, setOpenedQuestions, displayedResearchOutput } = useContext(GlobalContext);
  const sectionId = useState(section.id);

  /**
   * If the idx passed in is the same as the elIndex, then set the value to false, otherwise set it to true.
   */
  const toggleQuestionsInSection = (boolVal) => {
    const updatedState = {
      ...openedQuestions[displayedResearchOutput.id],
      [sectionId]: section.questions.reduce((acc, question) => {
        acc[question.id] = boolVal;
        return acc;
      }, {})
    };

    setOpenedQuestions({
      ...openedQuestions,
      [displayedResearchOutput.id]: updatedState
    });
  };

  return (
    <>
      <p className={styles.title}>
        {section.number}. {section.title}
      </p>
      <div className="column">
        <div className={styles.collapse_title}>
          <button
            type="button"
            className={`btn btn-link btn-sm m-0 p-0 ${styles.sous_title}`}
            style={{ outline: "none", fontSize: "14px", padding: 0, color: "#1c5170" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleQuestionsInSection(true);
            }}
          >
            {t("Expand all")}
          </button>
          <span className={styles.sous_title}> | </span>
          <button
            type="button"
            className={`btn btn-link btn-sm m-0 p-0 ${styles.sous_title}`}
            style={{ outline: "none", fontSize: "14px", padding: 0, color: "#1c5170" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleQuestionsInSection(false);
            }}
          >
            {t("Collapse all")}
          </button>
        </div>
      </div>
      {section.questions.map((question) => (
        <Question
          key={question.id}
          question={question}
          sectionId={sectionId}
          readonly={readonly}
        />
      ))}
    </>
  );
}

export default Section;
