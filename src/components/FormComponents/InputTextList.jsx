import React, { } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';
import { FaXmark } from 'react-icons/fa6';

import * as styles from '../assets/css/form.module.css';
import CustomButton from '../Styled/CustomButton';
import useSectionsMapping from '../../hooks/useSectionsMapping';
import MappingButton from './MappingButton';

/**
 * A React component that renders a form with a text input and a button.
 * When the button is clicked, a new text input is added to the form. When the text
 * input is changed, the form is updated.
 */
function InputTextList({ label, propName, tooltip, readonly, jsonPath = null }) {
  // --- STATE ---
  const { t } = useTranslation();
  const { register } = useFormContext({
    defaultValues: {
      [propName]: ['']
    }
  });
  const { fields, append, remove } = useFieldArray({ name: propName });
  const inputTextTooltipId = uniqueId('input_text_dynamicaly_tooltip_id_');


  // --- RENDER ---
  return (
    <div>
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

      {fields.map((item, index) => (
        <div className="row" style={{ marginBottom: '10px' }} key={`row-${index}`}>
          <div className="col-md-11">
            <div style={{ display: 'flex', alignItems: 'space-between' }}>
              <input
                key={item.id}
                {...register(`${propName}.${index}`)}
                type="text"
                className="form-control"
                style={{ border: '1px solid var(--dark-blue)', borderRadius: '8px', flex: 1 }}
                disabled={readonly}
              />
            </div>
          </div>
          {!readonly && (
            <div className="col-md-1" key={`col-md-1-input-text-dynamically-${index}`}>
              <ReactTooltip
                id={`input-text-dynamically-del-button-${index}`}
                place="bottom"
                effect="solid"
                variant="info"
                content={t('Delete')}
              />
              <FaXmark
                data-tooltip-id={`input-text-dynamically-del-button-${index}`}
                onClick={() => remove(index)}
                variant="info"
                size={24}
                className={styles.icon}
              />
            </div>
          )}
        </div>
      ))}

      <MappingButton path={jsonPath} label={label}/>

      {!readonly && (
        <CustomButton
          handleClick={() => append('')}
          title={t("Add an element")}
          buttonColor="rust"
          position="start"
        ></CustomButton>
      )}
    </div>
  );
}

export default InputTextList;
