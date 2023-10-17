import React, { useContext, useEffect, useState } from 'react';
import { service } from '../../services';
import { createOptions, parsePattern } from '../../utils/GeneratorUtils';
import { GlobalContext } from '../context/Global.jsx';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect';
import { useTranslation } from 'react-i18next';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';
import { ASYNC_SELECT_OPTION_THRESHOLD } from '../../config';

/* This is a functional component in JavaScript React that renders a select list with options fetched from a registry. It takes in several props such as
label, name, changeValue, tooltip, registry, and schemaId. It uses the useState and useEffect hooks to manage the state of the options and to fetch
the options from the registry when the component mounts. It also defines a handleChangeList function that is called when an option is selected from
the list, and it updates the value of the input field accordingly. Finally, it returns the JSX code that renders the select list with the options. */
function SelectSingleList({
  value, label, propName, handleChangeValue, tooltip, registries, fragmentId, fragment = {}, registryType, templateId, readonly
}) {
  const { t } = useTranslation();
  const [options, setOptions] = useState([{value:'', label:''}]);
  const { 
    locale,
    loadedTemplates, setLoadedTemplates,
    loadedRegistries, setLoadedRegistries,
  } = useContext(GlobalContext);
  const [error, setError] = useState(null);
  const [template, setTemplate] = useState({});
  const [selectedRegistry, setSelectedRegistry] = useState(registries[0]);
  const [selectedValue, setSelectedValue] = useState( registryType === 'complex' ? {} : '');
  const [selectedOption, setSelectedOption] = useState(registryType === 'complex' ? {} : '');
  const tooltipId = uniqueId('select_single_list_tooltip_id_');

  const nullValue  = registryType === 'complex' ? {} : '';

  useEffect(() => {
    setSelectedValue(value || nullValue);
  }, [value])

  useEffect(() => {
    if(registryType !== 'complex') {
      setSelectedOption({value: selectedValue, label: selectedValue})
    }
  }, [selectedValue])

  /*
  A hook that is called when the component is mounted.
  It is used to set the options of the select list.
  */
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

  useEffect(() => {
    if(registryType !== 'complex') { return; }
    if (!loadedTemplates[templateId]) {
      service.getSchema(templateId).then((res) => {
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

    if (registryType === 'complex') {
      const action = selectedValue.id ? 'update' : 'create';
      const value = {...selectedValue,  ...e.object, action};
      setSelectedValue(value);
      // setFormData(updateFormState(fragment, fragmentId, propName, value));
      handleChangeValue(propName, value)
    } else {
      handleChangeValue(propName, e.value);
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
        <div className="row">
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
                        selectedOption={selectedOption}
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
                  <td style={{ width: "50%" }}>
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
