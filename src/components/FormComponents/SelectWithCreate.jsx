import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';
import { FaPlus } from 'react-icons/fa6';

import { GlobalContext } from '../context/Global.jsx';
import {
  createOptions,
  deleteByIndex,
} from '../../utils/GeneratorUtils';
import { service } from '../../services';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect.jsx';
import FragmentList from './FragmentList.jsx';
import { ASYNC_SELECT_OPTION_THRESHOLD } from '../../config.js';
import ModalForm from '../Forms/ModalForm.jsx';
import swalUtils from '../../utils/swalUtils.js';

function SelectWithCreate({
  values,
  label,
  registries,
  handleChangeValue,
  propName,
  templateId,
  tooltip,
  header,
  fragmentId,
  readonly,
}) {
  const { t } = useTranslation();
  const {
    locale,
    loadedRegistries, setLoadedRegistries,
    loadedTemplates, setLoadedTemplates,
  } = useContext(GlobalContext);
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState([]);
  const [fragmentsList, setFragmentsList] = useState([])
  const [index, setIndex] = useState(null);
  const [template, setTemplate] = useState({});
  const [editedFragment, setEditedFragment] = useState({})
  const [selectedRegistry, setSelectedRegistry] = useState(registries[0]);
  const tooltipId = uniqueId('select_with_create_tooltip_id_');

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
    } else {
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
    setFragmentsList(values || []);
  }, [values]);

  const handleClose = () => {
    setShow(false);
    setEditedFragment({});
    setIndex(null);
  };

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  const handleSelectRegistryValue = (e) => {
    const pattern = template.to_string;
    const newItem = { ...e.object, action: 'create' };
    setFragmentsList(
      pattern.length > 0 ? [...fragmentsList, newItem] : fragmentsList,
    );
    // setFormData(updateFormState(formData, fragmentId, propName, [...(fragmentsList || []), newItem]));
    handleChangeValue(propName, [...(fragmentsList || []), newItem])
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
        handleChangeValue(propName, updatedFragmentList)
        // setFormData(updateFormState(formData, fragmentId, propName, concatedObject));
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
    //const checkForm = checkRequiredForm(registerFile, temp);
    if (index !== null) {
      //add in update
      const deleteIndex = deleteByIndex(fragmentsList, index);
      const concatedObject = [...deleteIndex, { ...data, action: 'update' }];
      // setFormData(updateFormState(formData, fragmentId, propName, concatedObject));
      handleChangeValue(propName, concatedObject)

      setEditedFragment({});
      handleClose();
    } else {
      //add in add
      handleSaveNew(data);
    }
    toast.success(t("Save was successful !"));
  };

  /**
   * I'm trying to add a new object to an array of objects, and then add that array to a new object.
   */
  const handleSaveNew = (data) => {
    const newFragmentList = [...fragmentsList, { ...data, action: 'create' }];
    // setFormData(updateFormState(formData, fragmentId, propName, newObject));
    handleChangeValue(propName, newFragmentList)

    handleClose();
    setEditedFragment({});
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
        {/* ************Select ref************** */}
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
                      selectedOption={{ value: selectedRegistry, label: selectedRegistry }}
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
                {registries.length > 1 ? t("Then select a value from the list") : t("Select a value from the list")}
              </div>
              <div className="row">
                <div className={`col-md-11 ${styles.select_wrapper}`}>
                  <CustomSelect
                    onChange={handleSelectRegistryValue}
                    options={options}
                    name={propName}
                    isDisabled={readonly}
                    async={options.length > ASYNC_SELECT_OPTION_THRESHOLD}
                  />
                </div>
                {!readonly && (
                  <div className="col-md-1">
                    <ReactTooltip
                      id="select-with-create-add-button"
                      place="bottom"
                      effect="solid"
                      variant="info"
                      content={t('Add')}
                    />
                    <FaPlus
                      data-tooltip-id="select-contributor-single-add-button"
                      onClick={() => {
                        setShow(true);
                        setIndex(null);
                      }}
                      style={{ margin: '8px', cursor: 'pointer' }}
                    />
                  </div>
                )}
              </div>
            </>
          </div>
        </div>
        {template && (
          <FragmentList
            fragmentsList={fragmentsList}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            templateToString={template.to_string}
            tableHeader={header}
            readonly={readonly}
          ></FragmentList>
        )}
      </div>
      <ModalForm
        fragmentId={fragmentId}
        data={editedFragment}
        template={template}
        label={t('Editing a person')}
        readonly={readonly}
        show={show}
        handleSave={handleSave}
        handleClose={handleClose}
      />
    </div>
  );
}

export default SelectWithCreate;
