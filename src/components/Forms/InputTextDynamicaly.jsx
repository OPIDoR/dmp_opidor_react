import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { GlobalContext } from '../context/Global.jsx';
import { updateFormState } from '../../utils/GeneratorUtils';
import styles from '../assets/css/form.module.css';

/* A React component that renders a form with a text input and a button.
When the button is clicked, a new text input is added to the form. When the text
input is changed, the form is updated. */
function InputTextDynamicaly({ label, propName, tooltip, fragmentId }) {
  const { t } = useTranslation();
  const [formFields, setFormFields] = useState(['']);
  const { formData, setFormData } = useContext(GlobalContext);
  
  /* A React hook that is called when the component is mounted and when the name variable changes. */
  useEffect(() => {
    setFormFields(formData?.[fragmentId]?.[propName] || [""]);
  }, [propName]);

  /**
   * When the form changes, update the form fields and set the form to the new data.
   */
  const handleFormChange = (event, index) => {
    const data = [...formFields];
    data[index] = event.target.value;
    setFormFields(data);
    setFormData(updateFormState(formData, fragmentId, propName, data));
  };

  /**
   * When the addFields function is called, the setFormFields
   * function is called with the current formFields array and a new empty string.
   */
  const addFields = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormFields([...formFields, '']);
  };

  /**
   * If the formFields array has more than one element,
   * then remove the element at the index specified by the index parameter.
   */
  const removeFields = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (formFields.length > 1) {
      const data = [...formFields];
      data.splice(index, 1);
      setFormFields(data);
      setFormData(updateFormState(formData, fragmentId, propName, data));
    }
  };

  return (
    <div className="App">
      <div className={styles.label_form}>
        <strong className={styles.dot_label}></strong>
        <label>{label}</label>
        {tooltip && (
          <span className="" data-toggle="tooltip" data-placement="top" title={tooltip}>
            ?
          </span>
        )}
      </div>
      {formFields.map((form, index) => {
        return (
          <div key={index} style={{ margin: "10px" }}>
            <div className={styles.input_container}>
              <input type="text" className={styles.input} value={form} name={propName} onChange={(event) => handleFormChange(event, index)} />
              {formFields.length !== 1 && (
                <span className={styles.input_img} data-role="toggle">
                  <a
                    className="text-primary"
                    type="button"
                    href="#"
                    onClick={(e) => removeFields(e, index)}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={t("Delete")}
                    style={{ marginRight: "8px" }}
                  >
                    <i className="fa fa-minus" aria-hidden="true" />
                  </a>
                </span>
              )}
              <span className={styles.input_img} data-role="toggle">
                <a
                  href="#"
                  className="text-primary"
                  type="button"
                  onClick={(e) => addFields(e)}
                  data-toggle="tooltip"
                  data-placement="top"
                  title={t("Add")}
                >
                  <i className="fa fa-plus" aria-hidden="true" />
                </a>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default InputTextDynamicaly;
