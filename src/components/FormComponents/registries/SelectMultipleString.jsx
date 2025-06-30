import React, { useContext, useEffect, useState } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';
import { FaXmark } from 'react-icons/fa6';

import { GlobalContext } from '../../context/Global.jsx';
import { service } from '../../../services/index.js';
import { createOptions, createRegistryPlaceholder } from '../../../utils/GeneratorUtils.js';
import * as styles from '../../assets/css/form.module.css';
import CustomSelect from '../../Shared/CustomSelect.jsx';
import { ASYNC_SELECT_OPTION_THRESHOLD } from '../../../config.js';
import swalUtils from '../../../utils/swalUtils.js';
import TooltipInfoIcon from '../TooltipInfoIcon.jsx';
import { getErrorMessage } from '../../../utils/utils.js';

function SelectMultipleString({
  label,
  propName,
  tooltip,
  header,
  category,
  dataType,
  // eslint-disable-next-line no-unused-vars
  topic,
  overridable = false,
  readonly = false,
}) {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { field } = useController({ control, name: propName });
  const [selectedValues, setSelectedValues] = useState([]);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRegistry, setSelectedRegistry] = useState(null);
  const [registries, setRegistries] = useState([]);
  const tooltipId = uniqueId('select_multiple_list_tooltip_id_');
  const inputId = uniqueId('select_multiple_list_id_');

  const {
    locale, loadedRegistries, setLoadedRegistries
  } = useContext(GlobalContext);

  useEffect(() => {
    if (category) {
      service.getAvailableRegistries(category, dataType)
        .then((res) => {
          const registriesData = Array?.isArray(res.data) ? res.data.map((r) => r.name) : [res.data.name]; setRegistries(registriesData);
          if (registriesData.length === 1) {
            const registry = res.data[0];
            setSelectedRegistry(registry.name);
            setLoadedRegistries({ ...loadedRegistries, [registry.name]: registry.values });
            setOptions(createOptions(registry.values, locale));
          }
        })
        .catch((error) => {
          setError(getErrorMessage(error));
        });
    }
  }, [category, dataType])


  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(() => {
    if (registries.length === 1) return;

    if (selectedRegistry) {
      if (loadedRegistries[selectedRegistry]) {
        setOptions(createOptions(loadedRegistries[selectedRegistry], locale));
      } else if (selectedRegistry) {
        service.getRegistryByName(selectedRegistry)
          .then((res) => {
            setLoadedRegistries({ ...loadedRegistries, [selectedRegistry]: res.data });
            setOptions(createOptions(res.data, locale));
          })
          .catch((error) => {
            setError(getErrorMessage(error));
          });
      }
    }
  }, [selectedRegistry]);

  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(() => {
    if (field.value) {
      const value = Array.isArray(field.value) ? field.value : [field.value]
      setSelectedValues(value);
    } else {
      setSelectedValues([]);
    }
  }, [field.value]);

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  const handleSelectRegistryValue = (e) => {
    const newList = [...(selectedValues || []), e.value];
    setSelectedValues(newList);
    field.onChange(newList);
  };

  /**
   * This function handles the deletion of an element from a list and displays a confirmation message using the Swal library.
   */
  const handleDeleteList = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire(swalUtils.defaultConfirmConfig(t)).then((result) => {
      if (result.isConfirmed) {
        const newList = [...selectedValues];
        // only splice array when item is found
        if (idx > -1) {
          newList.splice(idx, 1); // 2nd parameter means remove one item only
        }
        setSelectedValues(newList);
        field.onChange(newList);
      }
    });
  };

  /**
   * The handleSelectRegistry function updates the registry name based on the value of the input field.
   */
  const handleSelectRegistry = (e) => {
    setSelectedRegistry(e.value);
  };


  return (
    <div>
      <div className="form-group">
        <div className={styles.label_form}>
          <label htmlFor={inputId} data-testid="select-multiple-string-label" data-tooltip-id={tooltipId}>
            {label}
            {tooltip && (<TooltipInfoIcon />)}
          </label>
          {
            tooltip && (
              <ReactTooltip
                id={tooltipId}
                place="bottom"
                effect="solid"
                variant="info" style={{ width: '300px', textAlign: 'center' }}
                content={tooltip}
              />
            )
          }
        </div>

        <span className={styles.errorMessage}>{error}</span>
        {/* ************Select registry************** */}
        <div className="row">
          {registries && registries.length > 1 && (
            <div data-testid="select-multiple-string-registry-selector" className="col-md-6">
              <div className="row">
                <div className={`col-md-11 ${styles.select_wrapper}`}>
                  <CustomSelect
                    inputId={`${propName}-registry-selector`}
                    onSelectChange={handleSelectRegistry}
                    options={registries.map((registry) => ({
                      value: registry,
                      label: registry,
                    }))}
                    name={propName}
                    selectedOption={
                      selectedRegistry ? { value: selectedRegistry, label: selectedRegistry } : null
                    }
                    isDisabled={readonly}
                    placeholder={t("Select a registry")}
                  />
                </div>
              </div>
            </div>
          )}

          <div className={registries && registries.length > 1 ? "col-md-6" : "col-md-12"} data-testid="select-multiple-string-div">
            <div className="row">
              <div className={`col-md-11 ${styles.select_wrapper}`}>
                {options && (
                  <CustomSelect
                    inputId={inputId}
                    onSelectChange={handleSelectRegistryValue}
                    options={options}
                    name={propName}
                    isDisabled={readonly || !selectedRegistry}
                    async={options.length > ASYNC_SELECT_OPTION_THRESHOLD}
                    placeholder={createRegistryPlaceholder(registries.length, true, overridable, 'simple', t)}
                    overridable={overridable}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* *************Select registry************* */}

        <div style={{ margin: "20px 2px 20px 2px" }}>
          {selectedValues && (
            <table style={{ marginTop: "0px" }} className="table">
              {header && <thead><tr><th scope="col">{header}</th></tr></thead>}
              <tbody>
                {selectedValues.map((el, idx) => (
                  <tr key={idx}>
                    <td style={{ width: "100%" }}>
                      <div className={styles.cell_content}>
                        <div>{el} </div>
                        <div className={styles.table_container}>
                          {!readonly && (
                            <FaXmark
                              onClick={(e) => handleDeleteList(e, idx)}
                              size={18}
                              className={styles.icon}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectMultipleString;
