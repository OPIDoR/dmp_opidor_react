import React, { useContext, useEffect, useState } from 'react';
import { getRegistryById, getRegistryByName } from '../../services/DmpServiceApi';
import { createOptions } from '../../utils/GeneratorUtils';
import { GlobalContext } from '../context/Global.jsx';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect';
import RorList from '../ROR/RorList';
import OrcidList from '../ORCID/OrcidList';
import { useTranslation } from 'react-i18next';

/* This is a functional component in JavaScript React that renders a select list with options fetched from a registry. It takes in several props such as
label, name, changeValue, tooltip, registry, and schemaId. It uses the useState and useEffect hooks to manage the state of the options and to fetch
the options from the registry when the component mounts. It also defines a handleChangeList function that is called when an option is selected from
the list, and it updates the value of the input field accordingly. Finally, it returns the JSX code that renders the select list with the options. */
function SelectSingleList({
  label, propName, changeValue, tooltip, level, registryName, registries, fragmentId, registryType, readonly
}) {
  const { t, i18n } = useTranslation();
  const [options, setOptions] = useState([{value:'', label:''}]);
  const { 
    formData, subData, locale, loadedRegistries, setLoadedRegistries 
  } = useContext(GlobalContext);
  const [error, setError] = useState(null);
  const [selectedRegistry, setRegistryName] = useState(registryName);
  const [selectMonted, setSelectMonted] = useState(true);
  const [showRor, setShowRor] = useState(false);
  const [showOrcid, setShowOrcid] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  let value;
  const nullValue  = registryType === 'complex' ? {} : '';
  if (level === 1) {
    value = formData?.[fragmentId]?.[propName] || nullValue;
  } else {
    value = subData?.[propName] || nullValue;
  }
  const selectedOption = options.find((opt) => opt.value === value);
  /*
  A hook that is called when the component is mounted.
  It is used to set the options of the select list.
  */
  useEffect(() => {
    setRenderKey((prevKey) => prevKey + 1);
    if(loadedRegistries[registryName]) {
      setOptions(createOptions(loadedRegistries[registryName], locale));
      setSelectMonted(true);
    } else {
      getRegistryByName(registryName)
        .then((res) => {
          setLoadedRegistries({...loadedRegistries, [registryName]: res.data});
          setOptions(createOptions(res.data, locale));
          setSelectMonted(true);
        })
        .catch((error) => {
          // handle errors
        });
    }
  }, [registryName, locale]);

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  const handleSelectRegistryValue = (e) => {
    if (!e) return { target: { name: propName, value: '' } }
    
    const isRorID = e.value === "ROR ID";
    const isOrcidID = e.value === "ORCID iD";

    setShowRor(isRorID);
    setShowOrcid(isOrcidID);

    if (!isRorID && !isOrcidID) {
      setShowRor(false);
      setShowOrcid(false);
    }

    if (registryType === 'complex') {
      value = value.id ? {...value, action: "update"} : {...value, action: "create"};
      changeValue({ target: { name: propName, value: { ...value,  ...e.object } } });
    } else {
      changeValue({ target: { name: propName, value: e.value } });
    }

    const targetValue = propName === "funder" ? e.object : e.value;
    changeValue({ target: { propName, value: targetValue } });
  };

  /**
   * The handleChange function updates the registry name based on the value of the input field.
   */
  const handleSelectRegistry = (e) => {
    setRegistryName(e.value);
  };

  return (
    <>
      <div className="form-group">
        <div className={styles.label_form}>
          <strong className={styles.dot_label}></strong>
          <label>{label}</label>
          {tooltip && (
            <span 
              className="fas fa-circle-info" 
              data-toggle="tooltip" data-placement="top" title={tooltip}
            ></span>
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
                    <CustomSelect
                      onChange={handleSelectRegistry}
                      options={registries.map((registry) => ({
                        value: registry,
                        label: registry,
                      }))}
                      name={propName}
                      selectedOption={selectedRegistry}
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
                    <>
                      <CustomSelect
                        onChange={handleSelectRegistryValue}
                        options={options}
                        name={propName}
                        selectedOption={selectedOption}
                        isDisabled={readonly}
                      />
                    </>
                  )}
                </div>
              </div>
            </>
          </div>
        </div>
        {/* *************Select ref************* */}
      </div>
      <React.Fragment key={renderKey + 1}>
        {showOrcid && (
          <>
            <OrcidList></OrcidList>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {/* <Button variant="secondary" onClick={handleClose}>
              {t("Close")}
            </Button> */}
            </div>
          </>
        )}
        {showRor && (
          <>
            <RorList></RorList>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {/* <Button variant="secondary" onClick={handleClose}>
              {t("Close")}
            </Button> */}
            </div>
          </>
        )}
      </React.Fragment>
    </>
  );
}

export default SelectSingleList;
