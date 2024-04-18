import React, { useContext, useEffect, useState } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';
import { FaXmark } from 'react-icons/fa6';

import { GlobalContext } from '../context/Global.jsx';
import { service } from '../../services';
import { createOptions, createRegistryPlaceholder } from '../../utils/GeneratorUtils';
import * as styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect.jsx';
import { ASYNC_SELECT_OPTION_THRESHOLD } from '../../config.js';
import swalUtils from '../../utils/swalUtils.js';

function SelectMultipleList({
  label,
  propName,
  tooltip,
  header,
  registries,
  overridable = false,
  readonly = false,
}) {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { field } = useController({ control, name: propName });
  const [selectedValues, setSelectedValues] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedRegistry, setSelectedRegistry] = useState(null);
  const tooltipId = uniqueId('select_multiple_list_tooltip_id_');
  const {
    locale, loadedRegistries, setLoadedRegistries
  } = useContext(GlobalContext);


  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(() => {
    if (loadedRegistries[selectedRegistry]) {
      setOptions(createOptions(loadedRegistries[selectedRegistry], locale));
    } else if (selectedRegistry) {
      service.getRegistryByName(selectedRegistry)
        .then((res) => {
          setLoadedRegistries({ ...loadedRegistries, [selectedRegistry]: res.data });
          setOptions(createOptions(res.data, locale));
        })
        .catch((error) => {
          // handle errors
        });
    }
  }, [selectedRegistry]);

  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(() => {
    if(field.value) {
      const value = Array.isArray(field.value) ? field.value : [field.value]
      setSelectedValues(value);
    } else {
      setSelectedValues([]);
    }
  }, [field.value]);

  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(() => {
    const registriesData = Array?.isArray(registries) ? registries : [registries];

    if (registriesData.length === 1) {
      setSelectedRegistry(registriesData[0]);
    }
  }, [registries]);

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
          <strong className={styles.dot_label}></strong>
          <label data-tooltip-id={tooltipId}>{label}</label>
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

        {/* ************Select registry************** */}
        <div className="row">
          {registries && registries.length > 1 && (
            <div className="col-md-6">
              <div className="row">
                <div className={`col-md-11 ${styles.select_wrapper}`}>
                  <CustomSelect
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

          <div className={registries && registries.length > 1 ? "col-md-6" : "col-md-12"}>
            <div className="row">
              <div className={`col-md-11 ${styles.select_wrapper}`}>
                {options && (
                  <CustomSelect
                    onSelectChange={handleSelectRegistryValue}
                    options={options}
                    name={propName}
                    isDisabled={readonly || !selectedRegistry}
                    async={options.length > ASYNC_SELECT_OPTION_THRESHOLD}
                    placeholder={createRegistryPlaceholder(registries, overridable, 'simple', t)}
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
              {header && <thead>{header}</thead>}
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

export default SelectMultipleList;
