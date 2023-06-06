import React, { useContext } from 'react';

import { GlobalContext } from '../context/Global.jsx';
import HandleGenerateForms from './HandleGenerateForms.jsx';

function BuilderForm({ shemaObject, level, fragmentId }) {
  const {
    formData, setFormData, subData, setSubData,
  } = useContext(GlobalContext);

  /**
   * The function updates a form object with a new value based on the name and value of an event target, and sets either the form or temporary state
   * depending on the level.
   */
  const changeValue = (event) => {
    const { name, value } = event.target;
    if (level === 1) {
      const updatedFormData = { ...formData };
      updatedFormData[fragmentId] = updatedFormData[fragmentId] || {};
      updatedFormData[fragmentId][name] = value;
      setFormData(updatedFormData);
    } else {
      setSubData({ ...subData, [name]: value });
    }
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
      fragmentId={fragmentId}
    ></HandleGenerateForms>
  );
}

export default BuilderForm;
