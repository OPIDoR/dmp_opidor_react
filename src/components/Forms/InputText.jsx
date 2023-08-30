import React, { useContext, useEffect, useState } from "react";
import { getCheckEmailPatern, updateFormState } from "../../utils/GeneratorUtils";
import { GlobalContext } from "../context/Global";
import styles from "../assets/css/form.module.css";

/**
 * It's a function that takes in a bunch of props and returns a div with a label, an input, and a small tag.
 * @returns A React Component
 */
function InputText({ label, type, placeholder, name, changeValue, tooltip, hidden, isConst, schemaId, readonly }) {
  const { form, setForm, temp, setIsEmail } = useContext(GlobalContext);
  const [text, setText] = useState("");
  const [isRequired, setIsRequired] = useState(false);

  /* The `useEffect` hook is used to perform side effects in a functional component. In this case, the effect is triggered only once when the component is
mounted (empty dependency array `[]`). */
  useEffect(() => {
    if (isConst !== undefined && isConst !== false) {
      setForm(updateFormState(form, schemaId, name, isConst));
    }
  }, []);

  /* The `useEffect` hook is used to perform side effects in a functional component. In this case, the effect is triggered whenever the `form[name]` value
changes. */
  useEffect(() => {
    if (form?.[schemaId]?.[name] !== undefined) {
      setText(form?.[schemaId]?.[name]);
    }
  }, [form[name]]);

  /**
   * The handleChangeInput function updates the state based on the input value and checks if it matches a specific email pattern.
   */
  const handleChangeInput = (e) => {
    const { value } = e.target;
    const isPattern = getCheckEmailPatern(type, value);
    setIsEmail(isPattern);
    changeValue(e);
    setIsRequired(!isPattern);
    setText(value);
  };

  /* The line `const inputValue = isConst !== undefined && isConst !== false ? isConst : temp && temp[name] !== undefined ? temp[name] : text;` is
assigning a value to the `inputValue` variable based on certain conditions. */
  const inputValue = isConst !== undefined && isConst !== false ? isConst : temp && temp[name] !== undefined ? temp[name] : text;

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
        value={inputValue}
        className={isRequired ? `form-control ${styles.input_text} ${styles.outline_red}` : `form-control ${styles.input_text}`}
        hidden={hidden}
        placeholder={placeholder}
        onChange={handleChangeInput}
        name={name}
        disabled={(isConst !== undefined && isConst !== false) || readonly === true}
      />
    </div>
  );
}
export default InputText;
