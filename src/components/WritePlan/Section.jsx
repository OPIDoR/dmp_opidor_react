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
 * Toggle the state of questions within a section to the provided boolean value.
 *
 * @param {boolean} boolVal - The boolean value to set for all questions in the section.
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
