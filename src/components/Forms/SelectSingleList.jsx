import React, { useContext, useEffect, useState } from 'react';
import { getRegistryById, getRegistryByName, getSchema } from '../../services/DmpServiceApi';
import { createOptions, parsePattern, updateFormState } from '../../utils/GeneratorUtils';
import { GlobalContext } from '../context/Global.jsx';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect';
import { useTranslation } from 'react-i18next';

/* This is a functional component in JavaScript React that renders a select list with options fetched from a registry. It takes in several props such as
label, name, changeValue, tooltip, registry, and schemaId. It uses the useState and useEffect hooks to manage the state of the options and to fetch
the options from the registry when the component mounts. It also defines a handleChangeList function that is called when an option is selected from
the list, and it updates the value of the input field accordingly. Finally, it returns the JSX code that renders the select list with the options. */
function SelectSingleList({
  label, propName, changeValue, tooltip, level, registryName, registries, fragmentId, registryType, templateId, readonly
}) {
  const { t, i18n } = useTranslation();
  const [options, setOptions] = useState([{value:'', label:''}]);
  const { 
    formData, setFormData,
    subData,
    locale,
    loadedTemplates, setLoadedTemplates,
    loadedRegistries, setLoadedRegistries,
  } = useContext(GlobalContext);
  const [error, setError] = useState(null);
  const [template, setTemplate] = useState({});
  const [selectedRegistry, setSelectedRegistry] = useState(registryName);
  const [selectedValue, setSelectedValue] = useState( registryType === 'complex' ? {} : '');
  const [showRor, setShowRor] = useState(false);
  const [showOrcid, setShowOrcid] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  const nullValue  = registryType === 'complex' ? {} : '';
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  useEffect(() => {
    if (level === 1) {
      setSelectedValue(formData?.[fragmentId]?.[propName] || nullValue);
    } else {
      setSelectedValue(subData?.[propName] || nullValue);
    }
  }, [])

  /*
  A hook that is called when the component is mounted.
  It is used to set the options of the select list.
  */
  useEffect(() => {
    setRenderKey((prevKey) => prevKey + 1);
    if(loadedRegistries[selectedRegistry]) {
      setOptions(createOptions(loadedRegistries[selectedRegistry], locale));
    } else {
      getRegistryByName(selectedRegistry)
        .then((res) => {
          setLoadedRegistries({...loadedRegistries, [selectedRegistry]: res.data});
          setOptions(createOptions(res.data, locale));
        })
        .catch((error) => {
          // handle errors
        });
    }
  }, [selectedRegistry]);

  useEffect(() => {
    if(registryType !== 'complex') { return; }
    if (!loadedTemplates[templateId]) {
      getSchema(templateId).then((res) => {
        setTemplate(res.data)
        setLoadedTemplates({ ...loadedTemplates, [templateId]: res.data });
      });
    } else {
      setTemplate(loadedTemplates[templateId]);
    }
  }, [registryType, templateId])

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  const handleSelectRegistryValue = (e) => {
    if (!e) return { target: { name: propName, value: '' } }
    
    // const isRorID = e.value === "ROR ID";
    // const isOrcidID = e.value === "ORCID iD";

    // setShowRor(isRorID);
    // setShowOrcid(isOrcidID);

    // if (!isRorID && !isOrcidID) {
    //   setShowRor(false);
    //   setShowOrcid(false);
    // }

    if (registryType === 'complex') {
      const action = selectedValue.id ? 'update' : 'create';
      const value = {...selectedValue,  ...e.object, action};
      setSelectedValue(value);
      setFormData(updateFormState(formData, fragmentId, propName, value));
    } else {
      changeValue({ target: { name: propName, value: e.value } });
    }
  };

  /**
   * The handleChange function updates the registry name based on the value of the input field.
   */
  const handleSelectRegistry = (e) => {
    setSelectedRegistry(e.value);
  };

  return (
    <div>
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

        {/* ************Select registry************** */}
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
              <div className={styles.input_label}>{t("Then select a value from the list")}.</div>
              <div className="row">
                <div className={`col-md-12 ${styles.select_wrapper}`}>
                  {selectedRegistry && options && (
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
        
        {registryType === 'complex' && selectedValue && (
          <table style={{ marginTop: "20px" }} className="table">
            <thead>
              <tr>
                <th scope="col">{t("Selected value")}</th>
              </tr>
            </thead>
            <tbody>
              {[selectedValue].map((el, idx) => (
                <tr key={idx}>
                  <td scope="row" style={{ width: "50%" }}>
                    {parsePattern(el, template.to_string)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* *************Select registry************* */}
      </div>
    </div>
  );
}

export default SelectSingleList;
