import React, { useContext, useEffect, useState } from 'react';
import { getCheckEmailPattern, getCheckPattern } from '../../utils/GeneratorUtils';
import { GlobalContext } from '../context/Global.jsx';
import styles from "../assets/css/form.module.css";

/**
 * It's a function that takes in a bunch of props and returns
 * a div with a label, an input, and a small tag.
 * @returns A React Component
 */
function InputText({
  value,handleChangeValue,  label, type, placeholder, propName, tooltip, hidden, defaultValue, readonly
}) {
  const { setIsEmail } = useContext(GlobalContext);
  const [inputValue, setInputValue] = useState("");
  const [isRequired, setIsRequired] = useState(false);


  useEffect(() => {
    if (defaultValue !== null) {
      setInputValue(value || defaultValue);
    } else {
      setInputValue(value || "");
    }
  }, [value]);

  /**
   * It takes a number, formats it to a string, and then sets the
   * state of the text variable to that string.
   * @param e - The event object
   */
  const handleChangeInput = (e) => {
    const { value } = e.target;
    const isPattern = getCheckPattern(type, value);
    setIsEmail(isPattern);
    handleChangeValue(propName, value)
    setIsRequired(!isPattern);
    setInputValue(value);
  };

 /* The `useEffect` hook in the code snippet is used to perform a side effect in a functional component. In this case, the effect is triggered whenever
the `inputValue` variable changes. */
  useEffect(() => {
    if (type === "email") {
      const isPattern = getCheckEmailPattern(type, inputValue);
      setIsEmail(isPattern);
    }
  }, [inputValue]);

  return (
    <div className="form-group">
      <div className={styles.label_form}>
        <strong className={styles.dot_label}></strong>
        <label>{label}</label>
        {tooltip && (
          <span 
            className="fas fa-circle-info" 
            data-toggle="tooltip" data-placement="top" title={tooltip}
          ></span>
        )}
      </div>
      <input
        type={type}
        value={inputValue}
        className={isRequired ? `form-control ${styles.input_text} ${styles.outline_red}` : `form-control ${styles.input_text}`}
        hidden={hidden}
        placeholder={placeholder}
        onChange={handleChangeInput}
        name={propName}
        // disabled={defaultValue === false ? false : true}
        disabled={readonly === true}
      />
    </div>
  );
}
export default InputText;
