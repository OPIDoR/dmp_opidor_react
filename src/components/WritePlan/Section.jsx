import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { GlobalContext } from "../context/Global";
import styles from "../assets/css/write_plan.module.css";
import Question from "./Question";


function Section({ section, readonly }) {
  const { t } = useTranslation();
  const { 
    openedQuestions, setOpenedQuestions,
    displayedResearchOutput
  } = useContext(GlobalContext);

  const [sectionId] = useState(section.id);

  /**
   * If the idx passed in is the same as the elIndex, then set the value to false, otherwise set it to true.
   */
  const toggleQuestionsInSection = (boolVal) => {
    console.log(section);
    const updatedState = { ...openedQuestions[displayedResearchOutput.id] };
    if(!updatedState[sectionId]) updatedState[sectionId] = {}
    section.questions.forEach((question) => {
      if(updatedState[sectionId]) {
        updatedState[sectionId][question.id] = boolVal;
      } else {
        updatedState[sectionId] = {[question.id]: boolVal}
      }
    })
    console.log(updatedState);
    setOpenedQuestions({ ...openedQuestions, [displayedResearchOutput.id]: updatedState });
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
              toggleQuestionsInSection(true);
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
              toggleQuestionsInSection(false);
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
          readonly={readonly}
        ></Question>
      ))}
    </>
  );
}

export default Section;
