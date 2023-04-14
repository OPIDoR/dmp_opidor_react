import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { getRegistry, getRegistryValue } from "../../services/DmpServiceApi";
import { getDefaultLabel } from "../../utils/GeneratorUtils";
import { GlobalContext } from "../context/Global";
import styles from "../assets/css/form.module.css";

/* This is a functional component in JavaScript React that renders a select list with options fetched from a registry. It takes in several props such as
label, name, changeValue, tooltip, registry, and schemaId. It uses the useState and useEffect hooks to manage the state of the options and to fetch
the options from the registry when the component mounts. It also defines a handleChangeList function that is called when an option is selected from
the list, and it updates the value of the input field accordingly. Finally, it returns the JSX code that renders the select list with the options. */
function SelectSingleList({ label, name, changeValue, tooltip, registry, schemaId }) {
  const [options, setoptions] = useState(null);
  const { form, temp, lng } = useContext(GlobalContext);

  /* A hook that is called when the component is mounted. It is used to set the options of the select list. */
  useEffect(() => {
    let isMounted = true;
    const createOptions = (data) => {
      return data.map((option) => ({
        value: lng === "fr" ? option?.fr_FR || option?.label?.fr_FR : option?.en_GB || option?.label?.en_GB,
        label: lng === "fr" ? option?.fr_FR || option?.label?.fr_FR : option?.en_GB || option?.label?.en_GB,
        object: option,
      }));
    };
    const setOptions = (data) => {
      if (isMounted) {
        setoptions(data);
      }
    };
    getRegistryValue(registry, "token").then((res) => {
      if (res) {
        setOptions(createOptions(res));
      } else {
        return getRegistry(registry, "token").then((resRegistry) => {
          setOptions(createOptions(resRegistry));
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, [registry, lng]);

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  const handleChangeList = (e) => {
    if (name === "funder") {
      changeValue({ target: { name: name, value: e.object } });
    } else {
      changeValue({ target: { name: name, value: e.value } });
    }
  };

  return (
    <>
      <div className="form-group">
        <div className={styles.label_form}>
          <strong className={styles.dot_label}></strong>
          <label>{label}</label>
          {tooltip && (
            <span className="m-4" data-toggle="tooltip" data-placement="top" title={tooltip}>
              ?
            </span>
          )}
        </div>
        <div className="row">
          <div className={`col-md-12 ${styles.select_wrapper}`}>
            <Select
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999, color: "grey" }) }}
              onChange={handleChangeList}
              options={options}
              name={name}
              style={{ color: "red" }}
              defaultValue={{
                label: getDefaultLabel(temp, form?.[schemaId], name),
                value: getDefaultLabel(temp, form?.[schemaId], name),
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SelectSingleList;
