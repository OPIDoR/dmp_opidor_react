import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";

import { GlobalContext } from '../context/Global.jsx';
import { getRegistryById } from '../../services/DmpServiceApi';
import { createOptions } from '../../utils/GeneratorUtils';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect.jsx';

function SelectMultipleList({
  label,
  registryId,
  propName,
  changeValue,
  tooltip,
  header,
  fragmentId,
  readonly,
}) {
  const { t, i18n } = useTranslation();
  const [list, setList] = useState([]);
  const [options, setOptions] = useState(null);
  const { 
    formData, subData, setSubData, locale, loadedRegistries, setLoadedRegistries 
  } = useContext(GlobalContext);

  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(() => {
    if(loadedRegistries[registryId]) {
      setOptions(createOptions(loadedRegistries[registryId], locale));
    } else {
      getRegistryById(registryId)
        .then((res) => {
          setLoadedRegistries({...loadedRegistries, [registryId]: res.data});
          setOptions(createOptions(res.data, locale));
        })
        .catch((error) => {
          // handle errors
        });
    }
  }, [registryId, locale]);

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  const handleChangeList = (e) => {
    const copyList = [...(list || []), e.value];
    changeValue({ target: { propName, value: [...copyList] } });
    setList(copyList);
  };

  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(() => {
    if (subData) {
      setList(subData[propName]);
    } else {
      setList(formData?.[fragmentId]?.[propName]);
    }
  }, [fragmentId, propName]);

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
        const newList = [...list];
        // only splice array when item is found
        if (idx > -1) {
          newList.splice(idx, 1); // 2nd parameter means remove one item only
        }
        setList(newList);
        setSubData({ ...subData, [propName]: newList });
        Swal.fire(t("Deleted!"), t("Operation completed successfully!."), "success");
      }
    });
  };

  return (
    <>
      <div className="form-group">
        <div className={styles.label_form}>
          <strong className={styles.dot_label}></strong>
          <label>{label}</label>
          {tooltip && (
            <span 
              className="fas fa-info-circle" 
              data-toggle="tooltip" data-placement="top" title={tooltip}
            ></span>
          )}
        </div>
        <div className={styles.input_label}>{t("Select a value from the list")}.</div>
        <div className="row">
          <div className={`col-md-12 ${styles.select_wrapper}`}>
            <CustomSelect
              onChange={handleChangeList}
              options={options}
              name={propName}
              defaultValue={{
                label: subData ? subData[propName] : '',
                value: subData ? subData[propName] : '',
              }}
              isDisabled={readonly}
            />
          </div>
        </div>
        <div style={{ margin: "20px 2px 20px 2px" }}>
          {list && (
            <table style={{ marginTop: "0px" }} className="table">
              {header && <thead>{header}</thead>}
              <tbody>
                {list.map((el, idx) => (
                  <tr key={idx}>
                    <td scope="row" style={{ width: "100%" }}>
                      <div className={styles.border}>
                        <div>{el} </div>
                        <div className={styles.table_container}>
                          {!readonly && (
                            <div className="col-md-1">
                              <span style={{ marginRight: "10px" }}>
                                <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleDeleteList(e, idx)}>
                                  <i className="fa fa-times" />
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
    </>
  );
}

export default SelectMultipleList;
