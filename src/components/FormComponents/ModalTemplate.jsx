import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";

import FormBuilder from '../Forms/FormBuilder.jsx';
import { GlobalContext } from '../context/Global.jsx';
import {
  deleteByIndex,
} from '../../utils/GeneratorUtils';
import { getSchema } from '../../services/DmpServiceApi';
import CustomButton from '../Styled/CustomButton.jsx';
import styles from '../assets/css/form.module.css';
import FragmentList from './FragmentList.jsx';

/**
 * It takes a template name as an argument, loads the template file, and then
 * renders a modal with the template file as a prop.
 * </code>
 * @returns A React component.
 */
function ModalTemplate({
  values,
  handleChangeValue,
  label,
  propName,
  templateId,
  level,
  tooltip,
  header,
  fragmentId,
  readonly,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const {
    loadedTemplates, setLoadedTemplates,
    isEmail,
  } = useContext(GlobalContext);
  const [modalData, setModalData] = useState({});
  const [index, setIndex] = useState(null);
  const [fragmentsList, setFragmentsList] = useState([])

  const [template, setTemplate] = useState(null);
  useEffect(() => {
    if (!loadedTemplates[templateId]) {
      getSchema(templateId).then((res) => {
        setTemplate(res.data);
        setLoadedTemplates({ ...loadedTemplates, [templateId]: res.data });
      });
    } else {
      setTemplate(loadedTemplates[templateId]);
    }
  }, [templateId]);

  useEffect(() => {
    setFragmentsList(values || [])
  }, [values])

  /**
   * The function sets the show state to false
   */
  const handleClose = () => {
    setShow(false);
    setModalData({});
    setIndex(null);
  };

  /**
   * If the modalData variable is not empty, check if the form is valid, if it is,
   * add the modalData variable to the form, if it's not, show an error message.
   */
  const handleSave = () => {
    if (!isEmail) return toast.error(t("Invalid email"));
    if (!modalData) return handleClose();
    if (index !== null) {
      const filterDeleted = fragmentsList.filter((el) => el.action !== 'delete');
      const deleteIndex = deleteByIndex(filterDeleted, index);
      const addedObject = [...deleteIndex, { ...modalData, action: 'update' }];
      // setFormData(updateFormState(formData, fragmentId, propName, concatedObject));
      handleChangeValue(propName, addedObject)
      setModalData({});
    } else {
      handleSaveNew();
    }
    toast.success(t("Save was successful !"));
    handleClose();
  };

  /**
   * When the user clicks the save button, the form is updated with the new data,
   * the modalData is set to null, and the modal is closed.
   */
  const handleSaveNew = () => {
    const newFragmentList = [...fragmentsList, { ...modalData, action: 'create' }];
    setFragmentsList(newFragmentList)
    // setFormData(updateFormState(formData, fragmentId, propName, newFragmentList));
    handleChangeValue(propName, newFragmentList)
    setModalData({});
    handleClose();
  };

  /**
   * It creates a new array, then removes the item at the index specified
   * by the parameter, then sets the state to the new array.
   * @param idx - the index of the item in the array
   */
  const handleDelete = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: t("Are you sure ?"),
      text: t("Are you sure you want to delete this item?"),
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("Close"),
      confirmButtonText: t("Yes, delete!"),
    }).then((result) => {
      if (result.isConfirmed) {
        const filteredList = fragmentsList.filter((el) => el.action !== 'delete');
        filteredList[idx]['action'] = 'delete';
        // setFormData(updateFormState(formData, fragmentId, propName, filterList));
        handleChangeValue(propName, filteredList)
      }
    });
  };

  /**
   * This function handles the edit functionality for a form element in a React component.
   */
  const handleEdit = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setModalData(fragmentsList[idx]);
    setShow(true);
    setIndex(idx);
  };

  const handleModalValueChange = (propName, value) => {
    console.log({ ...modalData, [propName]: value });
    setModalData({ ...modalData, [propName]: value });
  }

  return (
    <>
      <div className={`p-2 mb-2`}>
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
        {!readonly && (
          <CustomButton
            handleClick={() => {
              setShow(true);
              setIndex(null);
            }}
            title={t("Add an element")}
            buttonType="primary"
            position="start"
          ></CustomButton>
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
    </>
  );
}

export default ModalTemplate;
