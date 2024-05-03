import React from "react";
import { Label } from "react-bootstrap";
import DynamicForm from "../../Forms/DynamicForm";
import useSectionsMode from "../../../hooks/useSectionsMode";



export function DynamicFormContainer({ question, fragmentId, answerId, setScriptsData, readonly, formSelector, setFragmentId, setAnswerId }) {
  // --- STATE ---
  const {
    show: showFormSelectorModal, setShowFormSelectorModal, setFillFormSelectorIconColor
  } = formSelector;

  const { mode } = useSectionsMode();

  
  // --- RENDER ---
  return (
    <>
      {fragmentId && answerId ? (
        <DynamicForm
          fragmentId={fragmentId}
          className={question?.madmp_schema?.classname}
          setScriptsData={setScriptsData}
          readonly={readonly}
          formSelector={{
            show: showFormSelectorModal,
            setShowFormSelectorModal,
            setFillFormSelectorIconColor,
          }}
          fetchAnswersData={true} />
      ) : (readonly && !mode) ? (
        <Label bsStyle="primary">{t('Question not answered.')}</Label>
      ) : (
        <DynamicForm
          fragmentId={null}
          className={question?.madmp_schema?.classname}
          setScriptsData={setScriptsData}
          questionId={question.id}
          madmpSchemaId={question.madmp_schema?.id}
          setFragmentId={setFragmentId}
          setAnswerId={setAnswerId}
          readonly={readonly}
          formSelector={{
            show: showFormSelectorModal,
            setShowFormSelectorModal,
            setFillFormSelectorIconColor,
          }}
          fetchAnswersData={true} />
      )}
    </>
  );
}
