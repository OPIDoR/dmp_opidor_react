import { useContext } from "react";
import { GlobalContext } from "../context/Global";
import HandleGenerateForms from "./HandleGenerateForms";

function BuilderForm({ shemaObject, level, schemaId }) {
  const { form, setform, temp, settemp, lng } = useContext(GlobalContext);

  /**
   * Object destructuring
   * If the level is 1, then set the form state to the value of the event target.
   *  If the level is not 1, then set the objectToAdd state to the value of the
   * event target.
   * @param event - the event that is triggered when the input is changed
   */
  const changeValue = (event) => {
    const { name, value } = event.target;
    level === 1 ? setform({ ...form, [name]: value }) : settemp({ ...temp, [name]: value });
  };

  // const changeValue = (event) => {
  //   const { name, value } = event.target;
  //   const updatedForm = { ...form };
  //   updatedForm[schemaId] = updatedForm[schemaId] || {};
  //   updatedForm[schemaId][name] = value;
  //   setform(updatedForm);
  // };

  /**
   * It takes a JSON object and returns a React component
   * @returns An array of React components.
   */

  return <HandleGenerateForms shemaObject={shemaObject} level={level} lng={lng} changeValue={changeValue} schemaId={schemaId}></HandleGenerateForms>;
}

export default BuilderForm;
