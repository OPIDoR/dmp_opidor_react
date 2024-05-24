import React from "react";
import { Label } from "react-bootstrap";
import DynamicForm from "../../Forms/DynamicForm";
import useSectionsMapping from "../../../hooks/useSectionsMapping";
import useQuestionModals from "../../../hooks/useQuestionModals";
import useQuestionIcons from "../../../hooks/useQuestionIcons";
import useQuestionState from "../../../hooks/useQuestionState";
import { TemplateProvider } from "../../context/TemplateContext";



export function DynamicFormContainer({ question, readonly, id }) {
  // --- STATE ---
  const {
    showFormSelectorModal, setShowFormSelectorModal
  } = useQuestionModals();

  const {
    setFillFormSelectorIconColor
  } = useQuestionIcons();

  const {
    fragmentId, setFragmentId,
    answerId, setAnswerId,
    setScriptsData
  } = useQuestionState();

  const { mapping } = useSectionsMapping();


  // --- RENDER ---
  return (
    <>
      <TemplateProvider>
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
            fetchAnswersData={true}
            id={id}
          />
        ) : (readonly && !mapping) ? (
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
            fetchAnswersData={true}
            id={id}
          />
        )}
      </TemplateProvider>
    </>
  );
}