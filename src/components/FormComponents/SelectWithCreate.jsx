import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";

import { GlobalContext } from '../context/Global.jsx';
import {
  createOptions,
  deleteByIndex,
} from '../../utils/GeneratorUtils';
import FormBuilder from '../Forms/FormBuilder.jsx';
import { service } from '../../services';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect.jsx';
import FragmentList from './FragmentList.jsx';

function SelectWithCreate({
  values,
  label,
  registries,
  handleChangeValue,
  propName,
  templateId,
  level,
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
    isEmail,
  } = useContext(GlobalContext);
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState(null);
  const [fragmentsList, setFragmentsList] = useState([])
  const [index, setIndex] = useState(null);
  const [template, setTemplate] = useState({});
  const [modalData, setModalData] = useState({})
  const [selectedRegistry, setSelectedRegistry] = useState(registries[0]);
  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(() => {
    if(!loadedTemplates[templateId]) {
      service.getSchema(templateId).then((res) => {
        setTemplate(res.data);
        setLoadedTemplates({...loadedTemplates, [templateId] : res.data});
      });
    } else {
      setTemplate(loadedTemplates[templateId]);
    }
  }, [templateId]);

  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
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
  }, [selectedRegistry, locale]);

  useEffect(() => {
    setFragmentsList(values || []);
  }, [values]);

  const handleClose = () => {
    setShow(false);
    setModalData({});
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
  const handleDelete = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: t("Are you sure ?"),
      text: t("Are you sure you want to delete this item?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("Close"),
      confirmButtonText: t("Yes, delete!"),
    }).then((result) => {
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
  const handleSave = () => {
    if (!isEmail) return toast.error(t("Invalid email"));
    if (!modalData) return handleClose();
    //const checkForm = checkRequiredForm(registerFile, temp);
    if (index !== null) {
      //add in update
      const deleteIndex = deleteByIndex(fragmentsList, index);
      const concatedObject = [...deleteIndex, { ...modalData, action: 'update' }];
      // setFormData(updateFormState(formData, fragmentId, propName, concatedObject));
      handleChangeValue(propName, concatedObject)

      setModalData({});
      handleClose();
    } else {
      //add in add
      handleSaveNew();
    }
    toast.success(t("Save was successful !"));
  };

  /**
   * I'm trying to add a new object to an array of objects, and then add that array to a new object.
   */
  const handleSaveNew = () => {
    const newFragmentList = [...fragmentsList, { ...modalData, action: 'create' }];
    // setFormData(updateFormState(formData, fragmentId, propName, newObject));
    handleChangeValue(propName, newFragmentList)

    handleClose();
    setModalData({});
  };

  /**
   * It sets the state of the modalData variable to the value of the formData[propName][idx] variable.
   * @param idx - the index of the item in the array
   */
  const handleEdit = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setModalData(fragmentsList[idx]);
    setShow(true);
    setIndex(idx);
  };

  /**
   * The handleChange function updates the registry name based on the value of the input field.
   */
  const handleSelectRegistry = (e) => {
    setSelectedRegistry(e.value);
  };

  const handleModalValueChange = (propName, value) => {
    setModalData({ ...modalData,  [propName]: value});
  }

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
                <div className={`col-md-11 ${styles.select_wrapper}`}>
                  <CustomSelect
                    onChange={handleSelectRegistryValue}
                    options={options}
                    name={propName}
                    defaultValue={{
                      label: modalData ? modalData[propName] : '',
                      value: modalData ? modalData[propName] : '',
                    }}
                    isDisabled={readonly}
                  />
                </div>
                {!readonly && (
                  <div className="col-md-1" style={{ marginTop: "8px" }}>
                    <span>
                      <a className="text-primary" href="#" onClick={() => {
                          setShow(true);
                          setIndex(null);
                        }}>
                        <i className="fas fa-plus" />
                      </a>
                    </span>
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title style={{ color: "var(--orange)", fontWeight: "bold" }}>{label}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px !important" }}>
          <FormBuilder
            fragment={modalData}
            handleChangeValue={handleModalValueChange}
            template={template}
            level={level + 1}
            fragmentId={fragmentId}
            readonly={readonly}
          ></FormBuilder>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("Close")}
          </Button>
          {!readonly && (
            <Button variant="primary" onClick={handleSave}>
              {t("Save")}
          </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SelectWithCreate;
