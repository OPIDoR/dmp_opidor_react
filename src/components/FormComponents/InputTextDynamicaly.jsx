import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';
import { FaPlus } from 'react-icons/fa6';
import { IoIosClose } from 'react-icons/io';
import styles from '../assets/css/form.module.css';

/* A React component that renders a form with a text input and a button.
When the button is clicked, a new text input is added to the form. When the text
input is changed, the form is updated. */
function InputTextDynamicaly({ values, handleChangeValue, label, propName, tooltip, fragmentId, readonly }) {
  const { t } = useTranslation();
  const [formFields, setFormFields] = useState([]);
  const [fieldContent, setFieldContent] = useState('');
  const inputTextTooltipId = uniqueId('input_text_dynamicaly_tooltip_id_');

  useEffect(() => {
    setFormFields(values || []);
  }, [values]);

  /**
   * When the form changes, update the form fields and set the form to the new data.
   */
  const handleFormChange = (event, index) => {
    const data = [...formFields];
    data[index] = event.target.value;
    setFormFields(data);
    // setFormData(updateFormState(formData, fragmentId, propName, data));
    handleChangeValue(propName, data)
  };

  /**
   * Function to add field in formFields state.
   * @param {Event} e - The event object, typically a click event.
   * @returns {void}
   */
  const addFields = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setFormFields([...formFields, fieldContent]);
    return setFieldContent('');
  };

  /**
   * Function to remove field in formFields state
   * @param {Event} e - The event object, typically a click event.
   * @param {number} index - The index of the field to be removed.
   * @returns {void}
   */
  const removeFields = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
    // setFormData(updateFormState(formData, fragmentId, propName, data));
    handleChangeValue(propName, data);
  };

  return (
    <div className="App">
      <div className={styles.label_form}>
        <strong className={styles.dot_label}></strong>
        <label data-tooltip-id={inputTextTooltipId}>{label}</label>
        {
          tooltip && (
            <ReactTooltip
              id={inputTextTooltipId}
              place="bottom"
              effect="solid"
              variant="info"
              style={{ width: '300px', textAlign: 'center' }}
              content={tooltip}
            />
          )
        }
      </div>

      <div className="row" style={{ marginBottom: '10px' }}>
        <div className="col-md-11">
          <input
            type="text"
            className="form-control"
            style={{ border: '1px solid var(--dark-blue)', borderRadius: '8px', flex: 1 }}
            onChange={(e) => setFieldContent(e.target.value)}
            value={fieldContent}
            name={propName}
            disabled={readonly}
          />
        </div>
        <div className="col-md-1">
          <ReactTooltip
            id="input-text-dynamicaly-add-button"
            place="bottom"
            effect="solid"
            variant="info"
            content={t('Add')}
          />
          <FaPlus
            data-tooltip-id="input-text-dynamicaly-add-button"
            onClick={(e) => addFields(e)}
            style={{ margin: '8px', cursor: 'pointer' }}
          />
        </div>
      </div>

      {formFields.map((content, index) => (
        <div className="row" style={{ marginBottom: '10px' }} key={`row-${index}`}>
          <div className="col-md-11">
            <div style={{ display: 'flex', alignItems: 'space-between' }}>
              <input
                key={`input-text-dynamically-${index}`}
                type="text"
                className="form-control"
                style={{ border: '1px solid var(--dark-blue)', borderRadius: '8px', flex: 1 }}
                value={content}
                name={propName}
                onChange={(event) => handleFormChange(event, index)}
                disabled={readonly}
              />
            </div>
          </div>
          <div className="col-md-1" key={`col-md-1-input-text-dynamically-${index}`}>
            <ReactTooltip
              id={`input-text-dynamically-del-button-${index}`}
              place="bottom"
              effect="solid"
              variant="info"
              content={t('Delete')}
            />
            <IoIosClose
              data-tooltip-id={`input-text-dynamically-del-button-${index}`}
              onClick={(e) => removeFields(e, index)}
              variant="info"
              size={24}
              style={{ margin: '6px 0 0 4px', cursor: 'pointer' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default InputTextDynamicaly;
