import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';

import { GlobalContext } from '../context/Global.jsx';
import { service } from '../../services';
import { createOptions } from '../../utils/GeneratorUtils';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect.jsx';
import { ASYNC_SELECT_OPTION_THRESHOLD } from '../../config.js';

function SelectMultipleList({
  values,
  label,
  registries,
  propName,
  handleChangeValue,
  tooltip,
  header,
  readonly,
}) {
  const { t } = useTranslation();
  const [selectedValues, setSelectedValues] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedRegistry, setSelectedRegistry] = useState(registries[0]);
  const tooltipId = uniqueId('select_multiple_list_tooltip_id_');
  const { 
    locale, loadedRegistries, setLoadedRegistries 
  } = useContext(GlobalContext);


  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(() => {
    if(loadedRegistries[selectedRegistry]) {
      setOptions(createOptions(loadedRegistries[selectedRegistry], locale));
    } else {
      service.getRegistryByName(selectedRegistry)
        .then((res) => {
          setLoadedRegistries({...loadedRegistries, [selectedRegistry]: res.data});
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
    setSelectedValues(values || []);
  }, [values]);

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  const handleSelectRegistryValue = (e) => {
    const newList = [...(selectedValues || []), e.value];
    handleChangeValue(propName, newList);
    setSelectedValues(newList);
  };

  /**
   * This function handles the deletion of an element from a list and displays a confirmation message using the Swal library.
   */
  const handleDeleteList = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: t("Are you sure ?"),
      text: t("Are you sure you want to delete this item?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("Close"),
      confirmButtonText: t("Yes, delete!"),
    }).then((result) => {
      if (result.isConfirmed) {
        const newList = [...selectedValues];
        // only splice array when item is found
        if (idx > -1) {
          newList.splice(idx, 1); // 2nd parameter means remove one item only
        }
        setSelectedValues(newList);
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
                variant="info"style={{ width: '300px', textAlign: 'center' }}
                content={tooltip}
              />
            )
          }
        </div>

        {/* ************Select registry************** */}
        <div className="row"><div className="row">
          {registries && registries.length > 1 && (
            <div className="col-md-6">
              <>
                <div className={styles.input_label}>{t("Select a registry")}.</div>
                <div className="row">
                  <div className={`col-md-11 ${styles.select_wrapper}`}>
                    <CustomSelect
                      onChange={handleSelectRegistry}
                      options={registries.map((registry) => ({
                        value: registry,
                        label: registry,
                      }))}
                      name={propName}
                      selectedOption={{value: selectedRegistry, label: selectedRegistry}}
                      isDisabled={readonly}
                    />
                  </div>
                </div>
              </>
            </div>
          )}

          <div className={registries && registries.length > 1 ? "col-md-6" : "col-md-12"}>
            <>
              <div className={styles.input_label}>
                { registries.length > 1 ? t("Then select a value from the list") :t("Select a value from the list") }
              </div>
              <div className="row">
                <div className={`col-md-12 ${styles.select_wrapper}`}>
                  {selectedRegistry && options && (
                    <>
                      <CustomSelect
                        onChange={handleSelectRegistryValue}
                        options={options}
                        name={propName}
                        isDisabled={readonly}
                        async={options.length > ASYNC_SELECT_OPTION_THRESHOLD}
                      />
                    </>
                  )}
                </div>
              </div>
            </>
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
                    <td scope="row" style={{ width: "100%" }}>
                      <div className={styles.border}>
                        <div>{el} </div>
                        <div className={styles.table_container}>
                          {!readonly && (
                            <div className="col-md-1">
                              <span style={{ marginRight: "10px" }}>
                                <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleDeleteList(e, idx)}>
                                  <i className="fa fa-xmark" />
                                </a>
                              </span>
                            </div>
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
