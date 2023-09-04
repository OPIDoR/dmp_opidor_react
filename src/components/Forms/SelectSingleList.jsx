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
  const { form, temp } = useContext(GlobalContext);
  const [registryName, setRegistryName] = useState(registry);
  const [selectMonted, setSelectMonted] = useState(true);
  const [options, setoptions] = useState([]); // Initialized to an empty array
  const [currentValue, setCurrentValue] = useState({ label: "", value: "" }); // Initialized to an empty object with label and value

  /* The `useEffect` hook is used to perform side effects in functional components. In this case, the effect is triggered when the `temp` variable
 changes. */
  useEffect(() => {
    const newDefaultValue = {
      label: getDefaultLabel(temp, form?.[schemaId], name) || "", // Use default value if undefined
      value: getDefaultLabel(temp, form?.[schemaId], name) || "", // Use default value if undefined
    };
    setCurrentValue(newDefaultValue);
  }, [temp]);

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
    getRegistryValue(registryName, "token").then((res) => {
      if (res) {
        setOptions(createOptions(res));
        setSelectMonted(true);
      } else {
        return getRegistry(registryName, "token").then((resRegistry) => {
          setOptions(createOptions(resRegistry));
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, [registryName, lng, temp]);

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  const handleChangeList = (e) => {
    const targetValue = name === "funder" ? e.object : e.value;
    changeValue({ target: { name, value: targetValue } });
    setCurrentValue({ label: e.label, value: e.value });
  };

  /**
   * The handleChange function updates the registry name based on the value of the input field.
   */
  const handleChange = (e) => {
    setRegistryName(e.value);
  };

  return (
    <div>
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

        {/* ************Select ref************** */}
        <div className="row">
          {registries && registries.length > 1 && (
            <div className="col-md-6">
              <>
                <div className={styles.input_label}>{t("Select a reference from the list")}.</div>
                <div className="row">
                  <div className={`col-md-11 ${styles.select_wrapper}`}>
                    <Select
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        singleValue: (base) => ({ ...base, color: "var(--primary)" }),
                        control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--primary)" }),
                      }}
                      onChange={handleChange}
                      options={registries.map((registry) => ({
                        value: registry,
                        label: registry,
                      }))}
                      name={name}
                      isDisabled={readonly}
                    />
                  </div>
                </div>
              </>
            </div>
          )}

          <div className={registries && registries.length > 1 ? "col-md-6" : "col-md-12"}>
            <>
              <div className={styles.input_label}>{t("Then select a value from the list")}.</div>
              <div className="row">
                <div className={`col-md-12 ${styles.select_wrapper}`}>
                  {selectMonted && options && (
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
                      value={currentValue}
                      isDisabled={readonly}
                    />
                  )}
                </div>
              </div>
            </>
          </div>
        </div>
        {/* *************Select ref************* */}
      </div>
    </div>
  );
}

export default SelectSingleList;
