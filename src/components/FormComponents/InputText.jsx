import React, { useEffect, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';
import { getCheckEmailPattern, getCheckPattern } from '../../utils/GeneratorUtils';
import styles from '../assets/css/form.module.css';

/**
 * It's a function that takes in a bunch of props and returns
 * a div with a label, an input, and a small tag.
 * @returns A React Component
 */
function InputText({
  value,
  handleChangeValue,
  label,
  type,
  placeholder,
  propName,
  tooltip,
  hidden = false,
  defaultValue,
  readonly,
}) {
  const [inputValue, setInputValue] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const tooltipedLabelId = uniqueId('input_text_tooltip_id_');


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
    handleChangeValue(propName, value)
    setInputValue(value);
  };

  return (
    <div className="form-group">
      {hidden === false && (
        <div className={styles.label_form}>
          <strong className={styles.dot_label}></strong>
          <label data-tooltip-id={tooltipedLabelId}>{label}</label>
          {
            tooltip && (
              <ReactTooltip
                id={tooltipedLabelId}
                place="bottom"
                effect="solid"
                variant="info"
                style={{ width: '300px', textAlign: 'center' }}
                content={tooltip}
              />
            )
          }
        </div>
      )}
      <input
        type={hidden ? 'hidden' : type}
        value={inputValue}
        className={isRequired ? `form-control ${styles.input_text} ${styles.outline_red}` : `form-control ${styles.input_text}`}
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
