import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";

import { GlobalContext } from '../context/Global.jsx';
import {
  createOptions,
  deleteByIndex,
  parsePattern,
  updateFormState,
} from '../../utils/GeneratorUtils';
import BuilderForm from '../Builder/BuilderForm.jsx';
import { getRegistry, getSchema } from '../../services/DmpServiceApi';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect.jsx';

function SelectWithCreate({
  label,
  registryId,
  propName,
  templateId,
  level,
  tooltip,
  header,
  fragmentId,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState(null);
  const [fragmentsList, setFragmentsList] = useState([])
  const [filteredList, setFilteredList] = useState([]);
  const {
    formData, setFormData, subData, setSubData, locale,
    loadedRegistries, setLoadedRegistries, loadedTemplates, setLoadedTemplates,
  } = useContext(GlobalContext);
  const [index, setIndex] = useState(null);
  const [template, setTemplate] = useState({});
  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(() => {
    if(!loadedTemplates[templateId]) {
      getSchema(templateId).then((res) => {
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

  useEffect(() => {
    setFragmentsList(formData?.[fragmentId]?.[propName] || []);
  }, [fragmentId, propName]);

  useEffect(() => {
    const pattern = template.to_string;
    if (pattern && pattern.length > 0) {
      setFilteredList(
        fragmentsList.filter((el) => el.action !== 'delete').map((el) => parsePattern(el, pattern)) || []
      )
    }
  }, [fragmentsList, template])

  /**
   * It closes the modal and resets the state of the modal.
   */
  const handleClose = () => {
    setShow(false);
    setSubData({});
    setIndex(null);
  };
  /**
   * The function takes a boolean value as an argument and sets the state of the show variable to the value of the argument.
   * @param isOpen - boolean
   */
  const handleShow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShow(true);
  };

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  const handleChangeList = (e) => {
    const pattern = template.to_string;
    const newItem = { ...e.object, action: 'create' };
    const parsedPattern = pattern.length > 0 ? parsePattern(newItem, pattern) : null;
    const updatedList = pattern.length > 0 ? [...filteredList, parsedPattern] : [...filteredList, e.value];
    setFilteredList(updatedList);
    setFragmentsList(
      pattern.length > 0 ? [...fragmentsList, newItem] : fragmentsList,
    );
    setFormData(updateFormState(formData, fragmentId, propName, [...(fragmentsList || []), newItem]));
  };

  /**
   * It creates a new array, then removes the item at the index specified by the parameter,
   * then sets the state to the new array.
   * @param idx - the index of the item in the array
   */
  const handleDeleteList = (e, idx) => {
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
        const newList = [...filteredList];
        setFilteredList(deleteByIndex(newList, idx));
        const concatedObject = [...formData[fragmentId][propName]];
        concatedObject[idx]['action'] = 'delete';
        setFormData(updateFormState(formData, fragmentId, propName, concatedObject));
        Swal.fire(t("Deleted!"), t("Operation completed successfully!."), "success");
      }
    });
  };

  /**
   * If the index is not null, then delete the item at the index,
   * add the subData item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  const handleAddToList = () => {
    if (!subData) return handleClose();
    //const checkForm = checkRequiredForm(registerFile, temp);
    if (index !== null) {
      //add in update
      const filterDeleted = fragmentsList.filter((el) => el.action !== 'delete');
      const deleteIndex = deleteByIndex(filterDeleted, index);
      const concatedObject = [...deleteIndex, { ...subData, action: 'update' }];
      setFormData(updateFormState(formData, fragmentId, propName, concatedObject));

      const newList = deleteByIndex([...filteredList], index);
      const parsedPattern = parsePattern(subData, template.to_string);
      const copieList = [...newList, parsedPattern];
      setFilteredList(copieList);
      setSubData({});
      handleClose();
    } else {
      //add in add
      handleSave();
    }
    toast.success("Enregistrement a été effectué avec succès !");
  };

  /**
   * I'm trying to add a new object to an array of objects, and then add that array to a new object.
   */
  const handleSave = () => {
    const newObject = [...(formData[fragmentId][propName] || []), { ...subData, action: 'create' }];
    setFormData(updateFormState(formData, fragmentId, propName, newObject));
    setFilteredList([...filteredList, parsePattern(subData, template.to_string)]);
    handleClose();
    setSubData({});
  };

  /**
   * It sets the state of the subData variable to the value of the formData[propName][idx] variable.
   * @param idx - the index of the item in the array
   */
  const handleEdit = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    const filterDeleted = fragmentsList.filter((el) => el.action !== 'delete');
    setSubData(filterDeleted[idx]);
    setShow(true);
    setIndex(idx);
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
        <div className={styles.input_label}>{t("Select a value from the list")}.</div>
        <div className="row col-md-12">
          <div className={`col-md-11 ${styles.select_wrapper}`}>
            <CustomSelect
              onChange={handleChangeList}
              options={options}
              name={propName}
              defaultValue={{
                label: subData ? subData[propName] : '',
                value: subData ? subData[propName] : '',
              }}
            />
          </div>
          <div className="col-md-1" style={{ marginTop: "8px" }}>
            <span>
              <a className="text-primary" href="#" onClick={(e) => handleShow(e)}>
                <i className="fas fa-plus" />
              </a>
            </span>
          </div>
        </div>
        {filteredList && (
          <table style={{ marginTop: "20px" }} className="table table-bordered">
            <thead>
              {fragmentsList?.length > 0 && header && (
                <tr>
                  <th scope="col">{header}</th>
                </tr>
              )}
            </thead>
            <tbody>
              {filteredList.map((el, idx) => (
                <tr key={idx}>
                  <td scope="row" style={{ width: "100%" }}>
                    <div className={styles.border}>
                      <div>{el} </div>
                      <div className={styles.table_container}>
                        <div className="col-md-1">
                          {level === 1 && (
                            <span>
                              <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleEdit(e, idx)}>
                                <i className="fa fa-edit" />
                              </a>
                            </span>
                          )}
                        </div>
                        <div className="col-md-1">
                          <span>
                            <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleDeleteList(e, idx)}>
                              <i className="fa fa-times" />
                            </a>
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title style={{ color: "var(--orange)", fontWeight: "bold" }}>{label}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "20px !important" }}>
            <BuilderForm
              shemaObject={template}
              level={level + 1}
              fragmentId={fragmentId}
            ></BuilderForm>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t("Close")}
            </Button>
            <Button variant="primary" onClick={handleAddToList}>
              {t("Save")}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
}

export default SelectWithCreate;
