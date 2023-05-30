import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";

import BuilderForm from '../Builder/BuilderForm.jsx';
import { GlobalContext } from '../context/Global.jsx';
import {
  checkRequiredForm,
  createMarkup,
  deleteByIndex,
  getLabelName,
  updateFormState,
  parsePattern,
} from '../../utils/GeneratorUtils';
import { getSchema } from '../../services/DmpServiceApi';
import CustomButton from '../Styled/CustomButton.jsx';
import styles from '../assets/css/form.module.css';

/**
 * It takes a template name as an argument, loads the template file, and then
 * renders a modal with the template file as a prop.
 * </code>
 * @returns A React component.
 */
function ModalTemplate({
  label,
  propName,
  value,
  templateId,
  level,
  tooltip,
  header,
  fragmentId,
}) {
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);
  const { formData, setFormData, subData, setSubData, locale } = useContext(GlobalContext);
  const [index, setIndex] = useState(null);
  const [fragmentsList, setFragmentsList] = useState([])

  const [template, setTemplate] = useState(null);
  useEffect(() => {
    getSchema(templateId).then((res) => {
      setTemplate(res.data);
    });
  }, [templateId]);

  useEffect(() => {
    setFragmentsList(formData?.[fragmentId]?.[propName] || [])
  }, [fragmentId, propName])

  /**
   * The function sets the show state to false
   */
  const handleClose = () => {
    setShow(false);
    setSubData({});
    setIndex(null);
  };

  /**
   * If the subData variable is not empty, check if the form is valid, if it is,
   * add the subData variable to the form, if it's not, show an error message.
   */
  const handleAddToList = () => {
    if (!subData) return handleClose();
    //const checkForm = checkRequiredForm(template, temp);
    //if (checkForm) return toast.error(`Veuiller remplire le champs ${getLabelName(checkForm, template)}`);
    if (index !== null) {
      const filterDeleted = fragmentsList.filter((el) => el.action !== 'delete');
      const deleteIndex = deleteByIndex(filterDeleted, index);
      const concatedObject = [...deleteIndex, { ...subData, action: 'update' }];
      setFormData(updateFormState(formData, fragmentId, propName, concatedObject));
      setSubData({});
    } else {
      handleSave();
      toast.success('Enregistrement a été effectué avec succès !');
    }
    handleClose();
  };

  /**
   * When the user clicks the save button, the form is updated with the new data,
   * the subData is set to null, and the modal is closed.
   */
  const handleSave = () => {
    const newObject = [...fragmentsList, { ...subData, action: 'create' }];
    setFormData(updateFormState(formData, fragmentId, propName, newObject));
    setSubData({});
    handleClose();
  };

  /**
   * The function takes a boolean value as an argument and sets the state
   * of the show variable to the value of the argument.
   * @param isOpen - boolean
   */
  const handleShow = (isOpen) => {
    setShow(isOpen);
  };

  /**
   * It creates a new array, then removes the item at the index specified
   * by the parameter, then sets the state to the new array.
   * @param idx - the index of the item in the array
   */
  const handleDeleteList = (e, idx) => {
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
        const filterDeleted = fragmentsList.filter((el) => el.action !== 'delete');
        filterDeleted[idx]['action'] = 'delete';
        setFormData(updateFormState(formData, fragmentId, propName, filterDeleted));
        Swal.fire(t("Deleted!"), t("Operation completed successfully!."), "success");
      }
    });
  };

  /**
   * This function handles the edit functionality for a form element in a React component.
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
      <div className={`p-2 mb-2`}>
        <div className={styles.label_form}>
          <strong className={styles.dot_label}></strong>
          <label>{value[`form_label@${locale}`]}</label>
          {tooltip && (
            <span className="m-4" data-toggle="tooltip" data-placement="top" title={tooltip}>
              ?
            </span>
          )}
        </div>
        <CustomButton
          handleClick={() => {
            handleShow(true);
          }}
          title={t("Add an element")}
          type="primary"
          position="start"
        ></CustomButton>
        {fragmentsList && template && (
          <table style={{ marginTop: "20px" }} className="table">
            <thead>
              {fragmentsList.length > 0 &&
                template &&
                header &&
                fragmentsList.some((el) => el.action !== "delete") && (
                  <tr>
                    <th scope="col">{header}</th>
                  </tr>
                )}
            </thead>
            <tbody>
              {fragmentsList
                .filter((el) => el.action !== "delete")
                .map((el, idx) => (
                  <tr key={idx}>
                    <td scope="row" style={{ width: "100%" }}>
                      <div className={styles.border}>
                        <div className={styles.panel_title} dangerouslySetInnerHTML={createMarkup(parsePattern(el, template.to_string))}></div>
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
  );
}

export default ModalTemplate;
