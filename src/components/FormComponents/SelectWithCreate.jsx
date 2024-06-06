import React, { useContext, useEffect, useState } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';
import { FaPlus } from 'react-icons/fa6';

import { GlobalContext } from '../context/Global.jsx';
import {
  createOptions,
  createRegistryPlaceholder,
} from '../../utils/GeneratorUtils';
import { service } from '../../services';
import * as styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect.jsx';
import FragmentList from './FragmentList.jsx';
import { ASYNC_SELECT_OPTION_THRESHOLD } from '../../config.js';
import ModalForm from '../Forms/ModalForm.jsx';
import swalUtils from '../../utils/swalUtils.js';
import { checkFragmentExists } from '../../utils/JsonFragmentsUtils.js';

function SelectWithCreate({
  label,
  formLabel,
  propName,
  tooltip,
  header,
  templateId,
  registries,
  overridable = false,
  readonly = false,
  isConst = false,
}) {
  const { t } = useTranslation();
  const {
    locale,
    loadedRegistries, setLoadedRegistries,
    loadedTemplates, setLoadedTemplates,
  } = useContext(GlobalContext);
  const { control } = useFormContext();
  const { field } = useController({ control, name: propName });
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState([]);
  const [fragmentsList, setFragmentsList] = useState(field.value)
  const [index, setIndex] = useState(null);
  const [error, setError] = useState(null);
  const [template, setTemplate] = useState(null);
  const [editedFragment, setEditedFragment] = useState({})
  const [selectedRegistry, setSelectedRegistry] = useState(null);
  const tooltipId = uniqueId('select_with_create_tooltip_id_');

  useEffect(() => {
    setFragmentsList(field.value || [])
  }, [field.value])

  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(() => {
    if (!loadedTemplates[templateId]) {
      service.getSchema(templateId).then((res) => {
        setTemplate(res.data);
        setLoadedTemplates({ ...loadedTemplates, [templateId]: res.data });
      });
    } else {
      setTemplate(loadedTemplates[templateId]);
    }
  }, [templateId]);

  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
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
  }, [selectedRegistry, locale]);

  useEffect(() => {
    const registriesData = Array?.isArray(registries) ? registries : [registries];

    if (registriesData.length === 1) {
      setSelectedRegistry(registriesData[0]);
    }
  }, [registries]);

  const handleClose = () => {
    setShow(false);
    setEditedFragment(null);
    setIndex(null);
  };

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  const handleSelectRegistryValue = (e) => {
    const pattern = template?.schema?.to_string || [];
    const newItem = { ...e.object, action: 'create' };
    setFragmentsList(
      pattern.length > 0 ? [...fragmentsList, newItem] : fragmentsList,
    );
    const newFragmentList = [...(fragmentsList || []), newItem]
    field.onChange(newFragmentList);
    setFragmentsList(newFragmentList);
  };

  /**
   * It creates a new array, then removes the item at the index specified by the parameter,
   * then sets the state to the new array.
   * @param idx - the index of the item in the array
   */
  const handleDelete = (idx) => {
    Swal.fire(swalUtils.defaultConfirmConfig(t)).then((result) => {
      if (result.isConfirmed) {
        const updatedFragmentList = fragmentsList;
        updatedFragmentList[idx]['action'] = 'delete';
        field.onChange(updatedFragmentList);
        setFragmentsList(updatedFragmentList);
      }
    });
  };

  /**
   * If the index is not null, then delete the item at the index,
   * add the modalData item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  const handleSave = (data) => {
    if (!data) return handleClose();

    if (checkFragmentExists(fragmentsList, data, template.schema['unicity'])) {
      setError(t('This record already exists.'));
    } else {
      if (index !== null) {
        const newFragmentList = [...fragmentsList];
        newFragmentList[index] = {
          ...newFragmentList[index],
          ...data,
          action: newFragmentList[index].action || 'update'
        };
        field.onChange(newFragmentList);
        setFragmentsList(newFragmentList);
      } else {
        //add in add
        handleSaveNew(data);
      }
      toast.success(t("Save was successful !"));
    }
    handleClose();
  };

  /**
   * I'm trying to add a new object to an array of objects, and then add that array to a new object.
   */
  const handleSaveNew = (data) => {
    const newFragmentList = [...fragmentsList, { ...data, action: 'create' }];
    field.onChange(newFragmentList);
    setFragmentsList(newFragmentList);
  };

  /**
   * It sets the state of the modalData variable to the value of the formData[propName][idx] variable.
   * @param idx - the index of the item in the array
   */
  const handleEdit = (idx) => {
    setEditedFragment(fragmentsList[idx]);
    setShow(true);
    setIndex(idx);
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
          <label data-tooltip-id={tooltipId}>{formLabel}</label>
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
        {/* ************Select ref************** */}
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
                    name={propName}
                    isDisabled={readonly || !selectedRegistry}
                    async={options.length > ASYNC_SELECT_OPTION_THRESHOLD}
                    placeholder={createRegistryPlaceholder(registries, overridable, 'complex', t)}
                    overridable={false}
                  />
                )}
              </div>
              {!readonly && overridable && (
                <div className="col-md-1">
                  <ReactTooltip
                    id="select-with-create-add-button"
                    place="bottom"
                    effect="solid"
                    variant="info"
                    content={t('Add')}
                  />
                  <FaPlus
                    data-tooltip-id="select-with-create-add-button"
                    onClick={() => {
                      setShow(true);
                      setIndex(null);
                    }}
                    className={styles.icon}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <span className={styles.errorMessage}>{error}</span>
        {template && (
          <FragmentList
            fragmentsList={fragmentsList}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            templateToString={template?.schema?.to_string}
            tableHeader={header}
            readonly={readonly}
            isConst={isConst}
          />
        )}
      </div>

      {template && show && (
        <ModalForm
          data={editedFragment}
          template={template}
          label={index !== null ? `${t('Edit')} : ${label}` : `${t('Add')} : ${label}`}
          readonly={readonly}
          show={show}
          handleSave={handleSave}
          handleClose={handleClose}
        />
      )}
    </div>
  );
}

export default SelectWithCreate;
