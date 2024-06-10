import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';
import * as styles from '../assets/css/form.module.css';
import MappingButton from './MappingButton';
import useSectionsMapping from '../../hooks/useSectionsMapping';

/**
 * It's a function that takes in a bunch of props and returns
 * a div with a label, an input, and a small tag.
 * @returns A React Component
 */
function InputText({
  label,
  type,
  placeholder,
  propName,
  tooltip,
  hidden = false,
  defaultValue = null,
  readonly = false,
  min,
  jsonPath = null,
  disableMapping = false,
}) {
  const { mapping } = useSectionsMapping();
  const { register } = useFormContext();
  const [isRequired] = useState(false);
  const tooltipedLabelId = uniqueId('input_text_tooltip_id_');

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
      <div>
        {(!mapping || disableMapping) &&
          <input
            {...register(propName, {
              valueAsNumber: type === 'number'
            })}
            defaultValue={defaultValue}
            type={hidden ? 'hidden' : type}
            className={isRequired ? `form-control ${styles.input_text} ${styles.outline_red}` : `form-control ${styles.input_text}`}
            placeholder={placeholder}
            readOnly={readonly === true}
            min={min}
          />
        }
        {!disableMapping && <MappingButton path={jsonPath} label={label}/> }
      </div>
    </div>
  );
}
export default InputText;
