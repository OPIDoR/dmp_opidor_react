import React, { useContext, useEffect, useState } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';
import { FaPenToSquare, FaPlus, FaEye } from 'react-icons/fa6';

import { service } from '../../services';
import { createOptions, createRegistryPlaceholder, parsePattern } from '../../utils/GeneratorUtils';
import { GlobalContext } from '../context/Global.jsx';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect';
import { ASYNC_SELECT_OPTION_THRESHOLD } from '../../config';
import NestedForm from '../Forms/NestedForm.jsx';

/* This is a functional component in JavaScript React that renders a select list with options fetched from a registry. It takes in several props such as
label, name, changeValue, tooltip, registry, and schemaId. It uses the useState and useEffect hooks to manage the state of the options and to fetch
the options from the registry when the component mounts. It also defines a handleChangeList function that is called when an option is selected from
the list, and it updates the value of the input field accordingly. Finally, it returns the JSX code that renders the select list with the options. */
function SelectSingleList({
  label,
  propName,
  tooltip,
  registries,
  registryType,
  templateId,
  overridable = false,
  readonly = false,
}) {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { field } = useController({ control, name: propName });
  const [options, setOptions] = useState([{ value: '', label: '' }]);
  const {
    locale,
    loadedTemplates, setLoadedTemplates,
    loadedRegistries, setLoadedRegistries,
  } = useContext(GlobalContext);
  const [error, setError] = useState(null);
  const [editedFragment, setEditedFragment] = useState({})
  const [template, setTemplate] = useState({});
  const [selectedRegistry, setSelectedRegistry] = useState(null);
  const [selectedValue, setSelectedValue] = useState(registryType === 'complex' ? {} : null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showNestedForm, setShowNestedForm] = useState(false);
  const tooltipId = uniqueId('select_single_list_tooltip_id_');

  const nullValue = registryType === 'complex' ? {} : null;
  const ViewEditComponent = readonly ? FaEye : FaPenToSquare;

  useEffect(() => {
    setSelectedValue(field.value || nullValue);
    if (registries.length === 1) {
      setSelectedRegistry(registries[0]);
    }
  }, [field.value, registries])

  useEffect(() => {
    if (registryType !== 'complex') {
      setSelectedOption(selectedValue ? { value: selectedValue, label: selectedValue } : nullValue)
    }
  }, [selectedValue])

  /*
  A hook that is called when the component is mounted.
  It is used to set the options of the select list.
  */
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

  useEffect(() => {
    if (registryType !== 'complex') { return; }
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
      const value = { ...selectedValue, ...e.object, action };
      field.onChange(value);
    } else {
      return field.onChange(e.value);
    }
  };

  /**
   * The handleChange function updates the registry name based on the value of the input field.
   */
  const handleSelectRegistry = (e) => {
    setSelectedRegistry(e.value);
  };


  const handleSaveNestedForm = (data) => {
    if (!data) return setShowNestedForm(false);

    const newFragment = { ...field.value, ...data, action: 'update' };
    field.onChange(newFragment);

    setEditedFragment({});
    setShowNestedForm(false);
  }

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
                    selectedOption={selectedOption}
                    isDisabled={showNestedForm || readonly || !selectedRegistry}
                    async={options.length > ASYNC_SELECT_OPTION_THRESHOLD}
                    placeholder={createRegistryPlaceholder(registries, overridable, registryType, t)}
                    overridable={registryType === 'complex' ? false : overridable}
                  />
                )}
              </div>
              {!readonly && overridable && registryType === 'complex' && !showNestedForm && (
                <div className="col-md-1">
                  <ReactTooltip
                    id="select-single-list-add-button"
                    place="bottom"
                    effect="solid"
                    variant="info"
                    content={t('Add')}
                  />
                  <FaPlus
                    data-tooltip-id="select-single-list-add-button"
                    onClick={() => {
                      setShowNestedForm(true);
                      setEditedFragment({});
                    }}
                    style={{ margin: '8px', cursor: 'pointer' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {registryType === 'complex' && (
          <div
            id={`nested-form-${propName}`}
            className={styles.nestedForm}
            style={{ display: showNestedForm ? 'block' : 'none' }}
          ></div>
        )}
        {showNestedForm && (
          <NestedForm
            propName={propName}
            data={editedFragment}
            template={template}
            readonly={readonly}
            handleSave={handleSaveNestedForm}
            handleClose={() => {
              setShowNestedForm(false);
              setEditedFragment({});
            }}
          />
        )}

        {registryType === 'complex' && selectedValue && !showNestedForm && (
          <table style={{ marginTop: "20px" }} className="table">
            <thead>
              <tr>
                <th colSpan="2" scope="col">{t("Selected value")}</th>
              </tr>
            </thead>
            <tbody>
              {[selectedValue].map((el, idx) => (
                <tr key={idx}>
                  <td style={{ width: "90%" }}>
                    {parsePattern(el, template.to_string)}
                  </td>
                  <td style={{ width: "10%" }}>
                    <ViewEditComponent
                      onClick={() => {
                        setShowNestedForm(true);
                        setEditedFragment(field.value);
                      }}
                      style={{ margin: '8px', cursor: 'pointer' }}
                    />
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
