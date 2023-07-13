import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { getRegistry, getRegistryValue } from "../../services/DmpServiceApi";
import { getDefaultLabel } from "../../utils/GeneratorUtils";
import { GlobalContext } from "../context/Global";
import styles from "../assets/css/form.module.css";
import { useTranslation } from "react-i18next";

/* This is a functional component in JavaScript React that renders a select list with options fetched from a registry. It takes in several props such as
label, name, changeValue, tooltip, registry, and schemaId. It uses the useState and useEffect hooks to manage the state of the options and to fetch
the options from the registry when the component mounts. It also defines a handleChangeList function that is called when an option is selected from
the list, and it updates the value of the input field accordingly. Finally, it returns the JSX code that renders the select list with the options. */
function SelectSingleList({ label, name, changeValue, tooltip, registry, schemaId, readonly, registries }) {
  const { t, i18n } = useTranslation();
  const [lng] = useState(i18n.language.split("-")[0]);
  const [options, setoptions] = useState(null);
  const { form, temp } = useContext(GlobalContext);
  const shouldShowRef = registries && registries.length > 1;
  const [showRef, setShowRef] = useState(shouldShowRef);
  const [registryName, setRegistryName] = useState(registry);
  const [selectMonted, setSelectMonted] = useState(false);

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
        const listOptions = createOptions(res);
        if (!temp && !form?.[schemaId]) {
          if (name === "funder") {
            changeValue({ target: { name: name, value: listOptions[0]?.object } });
          } else {
            changeValue({ target: { name: name, value: listOptions[0]?.value } });
          }
        }
        setSelectMonted(true);
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

  useEffect(() => {}, []);

  const handleChange = (e) => {
    setShowRef(false);
    setRegistryName(e.target.value);
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

        {showRef ? (
          <>
            <div className={styles.input_label}>{t("Select a reference from the list")}.</div>
            <div className="row">
              <div className={`col-md-11 ${styles.select_wrapper}`}>
                <select className="form-control" aria-label="Default select example" onChange={handleChange}>
                  <option selected>{t("Select a reference from the list")}</option>
                  {registries.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        ) : (
          <>
            {registries && registries.length > 1 && (
              <div style={{ margin: "0px 0px 15px 0px" }}>
                <span className={styles.input_label}>{t("Selected registry")} :</span>
                <span className={styles.input_text}>{registryName}</span>
                <span style={{ marginLeft: "10px" }}>
                  <a
                    className="text-primary"
                    href="#"
                    aria-hidden="true"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowRef(true);
                    }}
                  >
                    <i className="fas fa-edit" />
                  </a>
                </span>
              </div>
            )}
            <div className="row">
              <div className={`col-md-12 ${styles.select_wrapper}`}>
                {selectMonted && (
                  <Select
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999, color: "grey" }),
                      singleValue: (base) => ({ ...base, color: "var(--primary)" }),
                      control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--primary)" }),
                    }}
                    onChange={handleChangeList}
                    options={options}
                    name={name}
                    style={{ color: "red" }}
                    defaultValue={{
                      label: getDefaultLabel(temp, form?.[schemaId], name),
                      value: getDefaultLabel(temp, form?.[schemaId], name),
                    }}
                    isDisabled={readonly}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SelectSingleList;
