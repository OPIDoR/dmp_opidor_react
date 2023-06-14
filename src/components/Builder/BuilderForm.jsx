import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../context/Global";
import HandleGenerateForms from "./HandleGenerateForms";

function BuilderForm({ shemaObject, level, schemaId, readonly }) {
  const { i18n } = useTranslation();
  const { form, setForm, temp, setTemp } = useContext(GlobalContext);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLanguage(lng);
    };
    i18n.on("languageChanged", handleLanguageChanged);
    // Clean up listener when the component is unmounted or the effect re-runs
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n]);

  /**
   * The function updates a form object with a new value based on the name and value of an event target, and sets either the form or temporary state
   * depending on the level.
   */
  const changeValue = (event) => {
    const { name, value } = event.target;
    const updatedForm = { ...form };
    updatedForm[schemaId] = updatedForm[schemaId] || {};
    updatedForm[schemaId][name] = value;
    level === 1 ? setForm(updatedForm) : setTemp({ ...temp, [name]: value });
  };

  /**
   * It takes a JSON object and returns a React component
   * @returns An array of React components.
   */
  return (
    <HandleGenerateForms
      shemaObject={shemaObject}
      level={level}
      changeValue={changeValue}
      schemaId={schemaId}
      lng={currentLanguage}
      readonly={readonly}
    ></HandleGenerateForms>
  );
}

export default BuilderForm;
