import React, { useContext, useEffect, useState } from 'react';
import { getRegistry } from '../../services/DmpServiceApi';
import { createOptions } from '../../utils/GeneratorUtils';
import { GlobalContext } from '../context/Global.jsx';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect';

/* This is a functional component in JavaScript React that renders a select list with options fetched from a registry. It takes in several props such as
label, name, changeValue, tooltip, registry, and schemaId. It uses the useState and useEffect hooks to manage the state of the options and to fetch
the options from the registry when the component mounts. It also defines a handleChangeList function that is called when an option is selected from
the list, and it updates the value of the input field accordingly. Finally, it returns the JSX code that renders the select list with the options. */
function SelectSingleList({
  label, propName, changeValue, tooltip, level, registryId, fragmentId, registryType
}) {
  const [options, setOptions] = useState([{value:'', label:''}]);
  const { 
    formData, subData, locale, loadedRegistries, setLoadedRegistries 
  } = useContext(GlobalContext);
  const [error, setError] = useState(null);

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
    console.log(registryId, loadedRegistries);
    if(loadedRegistries[registryId]) {
      setOptions(createOptions(loadedRegistries[registryId], locale));
    } else {
      getRegistry(registryId)
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
    if (!e) return { target: { name: propName, value: '' } }

    if (registryType === 'complex') {
      value = value.id ? {...value, action: "update"} : {...value, action: "create"};
      changeValue({ target: { name: propName, value: { ...value,  ...e.object } } });
    } else {
      changeValue({ target: { name: propName, value: e.value } });
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
          <div className="col-md-10">
            <CustomSelect
              onChange={handleChangeList}
              options={options}
              name={propName}
              selectedOption={selectedOption}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SelectSingleList;
