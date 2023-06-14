import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import BuilderForm from "../Builder/BuilderForm";
import { GlobalContext } from "../context/Global";
import { checkRequiredForm, createMarkup, deleteByIndex, getLabelName, parsePatern, updateFormState } from "../../utils/GeneratorUtils";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { loadForm } from "../../services/DmpServiceApi";
import styles from "../assets/css/form.module.css";
import CustomButton from "../Styled/CustomButton";
import { useTranslation } from "react-i18next";

/**
 * It takes a template name as an argument, loads the template file, and then renders a modal with the template file as a prop.
 * </code>
 * @returns A React component.
 */
function ModalTemplate({ label, value, template, keyValue, level, tooltip, header, schemaId, readonly }) {
  const { t, i18n } = useTranslation();
  const [lng] = useState(i18n.language.split("-")[0]);
  const [show, setShow] = useState(false);
  const { form, setForm, temp, setTemp } = useContext(GlobalContext);
  const [index, setindex] = useState(null);
  const [registerFile, setregisterFile] = useState(null);

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    loadForm(template, "token").then((el) => {
      setregisterFile(el);
    });
  }, [template]);

  /**
   * The function sets the show state to false
   */
  const handleClose = () => {
    setShow(false);
    setTemp(null);
    setindex(null);
  };

  /**
   * If the temp variable is not empty, check if the form is valid, if it is, add the temp variable to the form, if it's not, show an error message.
   */
  const handleAddToList = () => {
    if (!temp) return handleClose();
    //const checkForm = checkRequiredForm(registerFile, temp);
    //if (checkForm) return toast.error(`Veuiller remplire le champs ${getLabelName(checkForm, registerFile)}`);
    if (index !== null) {
      //update
      const filterDeleted = form?.[schemaId]?.[keyValue].filter((el) => el.updateType !== "delete");
      const deleteIndex = deleteByIndex(filterDeleted, index);
      const concatedObject = [...deleteIndex, { ...temp, updateType: "update" }];
      setForm(updateFormState(form, schemaId, keyValue, concatedObject));
      setTemp(null);
    } else {
      handleSave();
      toast.success(t("Registration was successful !"));
    }
    handleClose();
  };

  /**
   * When the user clicks the save button, the form is updated with the new data, the temp is set to null, and the modal is closed.
   */
  const handleSave = () => {
    const newObject = [...(form[schemaId][keyValue] || []), temp];
    setForm(updateFormState(form, schemaId, keyValue, newObject));
    setForm(updateFormState(form, schemaId, keyValue, newObject));
    setTemp(null);
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
   * This function handles the deletion of an element from a form and displays a confirmation message using the Swal library.
   */
  const handleDeleteListe = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: t("Are you sure ?"),
      text: t("Are you sure you want to delete this item?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("Close"),
      confirmButtonText: t("Yes, delete!"),
    }).then((result) => {
      if (result.isConfirmed) {
        //delete
        const filterDeleted = form?.[schemaId]?.[keyValue].filter((el) => el.updateType !== "delete");
        filterDeleted[idx]["updateType"] = "delete";
        setForm(updateFormState(form, schemaId, keyValue, filterDeleted));
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
    const filterDeleted = form?.[schemaId]?.[keyValue].filter((el) => el.updateType !== "delete");
    setTemp(filterDeleted[idx]);
    setShow(true);
    setindex(idx);
  };

  return (
    <>
      <div className={`p-2 mb-2`}>
        <div className={styles.label_form}>
          <strong className={styles.dot_label}></strong>
          <label>{lng === "fr" ? value["form_label@fr_FR"] : value["form_label@en_GB"]}</label>
          {tooltip && (
            <span className="m-4" data-toggle="tooltip" data-placement="top" title={tooltip}>
              ?
            </span>
          )}
        </div>
        {!readonly && (
          <CustomButton
            handleClick={() => {
              handleShow(true);
            }}
            title={t("Add an element")}
            type="primary"
            position="start"
          ></CustomButton>
        )}

        {form?.[schemaId]?.[keyValue] && registerFile && (
          <table style={{ marginTop: "20px" }} className="table">
            <thead>
              {form?.[schemaId]?.[keyValue].length > 0 &&
                registerFile &&
                header &&
                form?.[schemaId]?.[keyValue].some((el) => el.updateType !== "delete") && (
                  <tr>
                    <th scope="col">{header}</th>
                  </tr>
                )}
            </thead>
            <tbody>
              {form?.[schemaId]?.[keyValue]
                .filter((el) => el.updateType !== "delete")
                .map((el, idx) => (
                  <tr key={idx}>
                    <td scope="row" style={{ width: "100%" }}>
                      <div className={styles.border}>
                        <div className={styles.panel_title} dangerouslySetInnerHTML={createMarkup(parsePatern(el, registerFile.to_string))}></div>

                        {!readonly && (
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
                                <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleDeleteListe(e, idx)}>
                                  <i className="fa fa-times" />
                                </a>
                              </span>
                            </div>
                          </div>
                        )}

                        {readonly && (
                          <div className={styles.table_container}>
                            <div className="col-md-1">
                              {level === 1 && (
                                <span style={{ marginRight: "10px" }}>
                                  <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleEdit(e, idx)}>
                                    <i className="fa fa-eye" />
                                  </a>
                                </span>
                              )}
                            </div>
                          </div>
                        )}
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
          {keyValue === "funding" && index !== null && temp && (
            <div className={`col-md-12 ${styles.funder}`}>
              <fieldset className="sub-fragment registry">
                <legend className={`sub-fragment registry ${styles.legend}`}>
                  Financeurs
                  <a href="#" style={{ marginLeft: "10px" }}>
                    <span className="registry-info fas fa-info-circle" />
                  </a>
                </legend>
                <div className="col-md-12 fragment-display">
                  <div className="fragment-property">
                    <span className="property-label">Nom du financeur : </span>
                    <span className="property-value">{temp?.funder?.name}</span>
                  </div>
                  <div className="fragment-property">
                    <span className="property-label">Identifiant : </span>
                    <span className="property-value">{temp?.funder?.funderId}</span>
                  </div>
                  <div className="fragment-property">
                    <span className="property-label">Type d'identifiant : </span>
                    <span className="property-value">{temp?.funder?.idType}</span>
                  </div>
                </div>
              </fieldset>
              <br></br>
              <fieldset className="fragment-display sub-fragment">
                <legend className={styles.legend}>Politique de données</legend>
                <div className="fragment-property">
                  <span className="property-label">Titre : </span>
                  <span className="property-value">{temp?.funder?.dataPolicy?.title}</span>
                </div>
                <div className="fragment-property">
                  <span className="property-label">Identifiant : </span>
                  <span className="property-value">{temp?.funder?.dataPolicy?.docIdentifier}</span>
                </div>
                <div className="fragment-property">
                  <span className="property-label">Type d'identifiant : </span>
                  <span className="property-value">{temp?.funder?.dataPolicy?.idType}</span>
                </div>
              </fieldset>
            </div>
          )}
          <BuilderForm shemaObject={registerFile} level={level + 1} readonly={readonly}></BuilderForm>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("Close")}
          </Button>
          {!readonly && (
            <Button variant="primary" onClick={handleAddToList}>
              {t("Save")}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalTemplate;
