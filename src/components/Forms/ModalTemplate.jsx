import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import BuilderForm from "../Builder/BuilderForm";
import { GlobalContext } from "../context/Global";
import { checkRequiredForm, createMarkup, deleteByIndex, getLabelName, parsePatern, updateFormState } from "../../utils/GeneratorUtils";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { getSchema } from "../../services/DmpServiceApi";
import styles from "../assets/css/form.module.css";
import CustumButton from "../Styled/CustumButton";

/**
 * It takes a template name as an argument, loads the template file, and then renders a modal with the template file as a prop.
 * </code>
 * @returns A React component.
 */
function ModalTemplate({ value, template, keyValue, level, tooltip, header, schemaId }) {
  const [show, setShow] = useState(false);
  const { form, setform, temp, settemp, lng } = useContext(GlobalContext);
  const [index, setindex] = useState(null);
  const [registerFile, setregisterFile] = useState(null);

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getSchema(template, "token").then((el) => {
      setregisterFile(el);
    });
  }, [template]);

  /**
   * The function sets the show state to false
   */
  const handleClose = () => {
    setShow(false);
    settemp(null);
    setindex(null);
  };

  /**
   * If the temp variable is not empty, check if the form is valid, if it is, add the temp variable to the form, if it's not, show an error message.
   */
  const handleAddToList = () => {
    if (!temp) return handleClose();

    const checkForm = checkRequiredForm(registerFile, temp);
    if (checkForm) return toast.error(`Veuiller remplire le champs ${getLabelName(checkForm, registerFile)}`);

    if (index !== null) {
      const deleteIndex = deleteByIndex(form[schemaId][keyValue], index);
      const concatedObject = [...deleteIndex, temp];
      setform(updateFormState(form, schemaId, keyValue, concatedObject));
      settemp(null);
    } else {
      handleSave();
      toast.success("Enregistrement a été effectué avec succès !");
    }
    handleClose();
  };

  /**
   * When the user clicks the save button, the form is updated with the new data, the temp is set to null, and the modal is closed.
   */
  const handleSave = () => {
    const newObject = [...(form[schemaId][keyValue] || []), temp];
    setform(updateFormState(form, schemaId, keyValue, newObject));
    setform(updateFormState(form, schemaId, keyValue, newObject));
    settemp(null);
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
   * It creates a new array, then removes the item at the index specified by the parameter, then sets the state to the new array.
   * @param idx - the index of the item in the array
   */
  const handleDeleteListe = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: "Ëtes-vous sûr ?",
      text: "Voulez-vous vraiment supprimer cet élément ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimer!",
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteIndex = deleteByIndex(form[schemaId][keyValue], idx);
        setform(updateFormState(form, schemaId, keyValue, deleteIndex));
        Swal.fire("Supprimé!", "Opération effectuée avec succès!.", "success");
      }
    });
  };

  /**
   * When the user clicks the edit button, the form is populated with the data from the row that was clicked.
   * @param idx - the index of the item in the array
   */
  const handleEdit = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    settemp(form?.[schemaId]?.[keyValue][idx]);
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
        {form?.[schemaId]?.[keyValue] && registerFile && (
          <table style={{ marginTop: "20px" }} className="table table-bordered">
            <thead>
              {form?.[schemaId]?.[keyValue].length > 0 && registerFile && header && (
                <tr>
                  <th scope="col">{header}</th>
                  <th scope="col"></th>
                </tr>
              )}
            </thead>
            <tbody>
              {form?.[schemaId]?.[keyValue].map((el, idx) => (
                <tr key={idx}>
                  <td scope="row">
                    <div className="preview" dangerouslySetInnerHTML={createMarkup(parsePatern(el, registerFile.to_string))}></div>
                  </td>
                  <td style={{ width: "10%" }}>
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
                        <a className="text-danger" href="#" aria-hidden="true" onClick={(e) => handleDeleteListe(e, idx)}>
                          <i className="fa fa-times" />
                        </a>
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <CustumButton
          handleNextStep={() => {
            handleShow(true);
          }}
          title="Ajouter un élément"
          type="primary"
          position="start"
        ></CustumButton>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          {keyValue === "funding" && index !== null && temp && (
            <div className={`col-md-12 ${styles.funder}`}>
              <fieldset className="sub-fragment registry">
                <legend className={`sub-fragment registry ${styles.legend}`}>
                  Financeurs
                  <a href="#">
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
              </fieldset>
            </div>
          )}
          <BuilderForm shemaObject={registerFile} level={level + 1}></BuilderForm>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleAddToList}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalTemplate;
