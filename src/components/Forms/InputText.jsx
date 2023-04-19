import React, { useContext, useEffect, useState } from "react";
import { getCheckPatern } from "../../utils/GeneratorUtils";
import { GlobalContext } from "../context/Global";
import styles from "../assets/css/form.module.css";

/**
 * It's a function that takes in a bunch of props and returns a div with a label, an input, and a small tag.
 * @returns A React Component
 */
function InputText({ label, type, placeholder, name, changeValue, tooltip, hidden, isConst, schemaId }) {
  const { form, setForm, temp } = useContext(GlobalContext);
  const [text, settext] = useState(null);
  const [isRequired, setisRequired] = useState(false);

  /* It's setting the state of the form to the value of the isConst variable. */
  useEffect(() => {
    if (isConst !== false) {
      //TODO constant not updated
      setForm({ [name]: isConst });
    }
  }, []);

  useEffect(() => {
    settext(form?.[schemaId]?.[name]);
  }, [form[name]]);

  /**
   * It takes a number, formats it to a string, and then sets the state of the text variable to that string.
   * @param e - The event object
   */
  const handleChangeInput = (e) => {
    const { value } = e.target;
    const isPattern = getCheckPatern(type, value);
    changeValue(e);
    setisRequired(!isPattern);
    settext(value);
  };
  return (
    <div className="form-group">
      <div className={styles.label_form}>
        <strong className={styles.dot_label}></strong>
        <label>{label}</label>
        {tooltip && (
          <span className="" data-toggle="tooltip" data-placement="top" title={tooltip}>
            ?
          </span>
        )}
      </div>
      <input
        type={type}
        value={isConst === false ? (temp ? temp[name] : text == null ? "" : text) : isConst}
        className={isRequired ? `form-control ${styles.input_text} ${styles.outline_red}` : `form-control ${styles.input_text}`}
        hidden={hidden}
        placeholder={placeholder}
        onChange={handleChangeInput}
        name={name}
        disabled={isConst === false ? false : true}
      />
    </div>
  );
}

export default InputText;
