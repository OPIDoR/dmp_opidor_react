import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import BuilderForm from "../Builder/BuilderForm";
import Select from "react-select";
import { deleteByIndex, parsePatern, updateFormState } from "../../utils/GeneratorUtils";
import { GlobalContext } from "../context/Global";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { getContributor, loadForm } from "../../services/DmpServiceApi";
import styles from "../assets/css/form.module.css";

/* The above code is a React component that renders a form input field for selecting contributors. It uses the useState and useEffect hooks to manage
state and make API calls to retrieve data. It also uses the react-bootstrap Modal component to display a form for adding new contributors. The
component allows users to select contributors from a list or add new contributors by filling out a form. It also displays a table of selected
contributors and allows users to edit or delete them. */
function SelectContributor({ label, name, changeValue, registry, keyValue, level, tooltip, header, schemaId }) {
  const [list, setlist] = useState([]);
  const [show, setShow] = useState(false);
  const [options, setoptions] = useState(null);
  const [selectObject, setselectObject] = useState([]);
  const { form, setform, temp, settemp } = useContext(GlobalContext);
  const [index, setindex] = useState(null);
  const [registerFile, setregisterFile] = useState(null);
  const [role, setrole] = useState(null);

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getContributor("token").then((res) => {
      const options = res.data.map((option) => ({
        value: option.firstName + " " + option.lastName,
        label: option.firstName + " " + option.lastName,
        object: option,
      }));
      setoptions(options);
    });
  }, []);

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    loadForm(registry, "token").then((res) => {
      setrole(res.properties.role["const@fr_FR"]);
      setregisterFile(res.properties.person.template_name);
      const template = res.properties.person["template_name"];
      loadForm(template, "token").then((res) => {
        setregisterFile(res);
      });
      if (!form?.[schemaId]?.[keyValue]) {
        return;
      }
      const patern = res.to_string;
      if (!patern.length) {
        return;
      }
      setlist(form?.[schemaId]?.[keyValue].filter((el) => el.updateType !== "delete").map((el) => parsePatern(el, patern)));
    });
  }, [form?.[schemaId]?.[keyValue], registry]);

  /**
   * It closes the modal and resets the state of the modal.
   */
  const handleClose = () => {
    setShow(false);
    settemp(null);
    setindex(null);
  };

  /**
   * The function handles showing a component by setting its state to true.
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
    const patern = registerFile.to_string;
    const { object, value } = e;
    if (patern.length > 0) {
      setselectObject([...selectObject, object]);
      const parsedPatern = parsePatern(object, registerFile.to_string);
      setlist([...list, parsedPatern]);
      const newObject = { person: object, role: role };
      const mergedList = form?.[schemaId]?.[keyValue] ? [...form[schemaId][keyValue], newObject] : [newObject];
      setform(updateFormState(form, schemaId, keyValue, mergedList));
    } else {
      changeValue({ target: { name, value } });
      setlist([...list, value]);
    }
  };

  /**
   * If the index is not null, then delete the item at the index, add the temp item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  const handleAddToList = () => {
    if (index !== null) {
      //update
      const objectPerson = { person: temp, role: role, updateType: "update" };
      const filterDeleted = form?.[schemaId]?.[keyValue].filter((el) => el.updateType !== "delete");
      const deleteIndex = deleteByIndex(filterDeleted, index);
      const concatedObject = [...deleteIndex, objectPerson];
      setform(updateFormState(form, schemaId, keyValue, concatedObject));
      const parsedPatern = parsePatern(temp, registerFile.to_string);
      setlist([...deleteByIndex([...list], index), parsedPatern]);
    } else {
      handleSave();
    }
    toast.success("Enregistrement a été effectué avec succès !");
    settemp(null);
    handleClose();
  };

  /**
   * When the user clicks the save button, the function will take the temporary person object and add it to the form object, then it will parse the
   * temporary person object and add it to the list array, then it will close the modal and set the temporary person object to null.
   */
  const handleSave = () => {
    const objectPerson = { person: temp, role: role };
    setform(updateFormState(form, schemaId, keyValue, [...(form[schemaId][keyValue] || []), objectPerson]));
    const parsedPatern = parsePatern(temp, registerFile.to_string);
    setlist([...list, parsedPatern]);
    handleClose();
    settemp(null);
  };

  /**
   * This function handles the deletion of an element from a list and displays a confirmation message using the Swal library.
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
      confirmButtonText: "Oui, supprimer !",
    }).then((result) => {
      if (result.isConfirmed) {
        const newList = [...list];
        setlist(deleteByIndex(newList, idx));
        const filterDeleted = form?.[schemaId]?.[keyValue].filter((el) => el.updateType !== "delete");
        filterDeleted[idx]["updateType"] = "delete";
        setform(updateFormState(form, schemaId, keyValue, filterDeleted));
        Swal.fire("Supprimé!", "Opération effectuée avec succès!.", "success");
      }
    });
  };

  /**
   * This function handles the edit functionality for a specific item in a form.
   */
  const handleEdit = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    const filterDeleted = form?.[schemaId]?.[keyValue].filter((el) => el.updateType !== "delete");
    settemp(filterDeleted[idx]["person"]);
    setShow(true);
    setindex(idx);
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
        <div className={styles.input_label}>Sélectionnez une valeur de la liste.</div>
        <div className="row">
          <div className={`col-md-11 ${styles.select_wrapper}`}>
            <Select
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              onChange={handleChangeList}
              options={options}
              name={name}
              defaultValue={{
                label: temp ? temp[name] : "",
                value: temp ? temp[name] : "",
              }}
            />
          </div>
          <div className="col-md-1" style={{ marginTop: "8px" }}>
            <span>
              <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleShow(e)}>
                <i className="fas fa-plus-square" />
              </a>
            </span>
          </div>
        </div>
        {form?.[schemaId]?.[keyValue] && list && (
          <table style={{ marginTop: "20px" }} className="table table-bordered">
            <thead>
              {form?.[schemaId]?.[keyValue].length > 0 && header && form?.[schemaId]?.[keyValue].some((el) => el.updateType !== "delete") && (
                <tr>
                  <th scope="col">{header}</th>
                  <th scope="col"></th>
                </tr>
              )}
            </thead>
            <tbody>
              {list.map((el, idx) => (
                <tr key={idx}>
                  <td scope="row">
                    <p className={`m2 ${styles.border}`}> {el} </p>
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
                        <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleDeleteListe(e, idx)}>
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
      </div>
      <>
        {registerFile && (
          <Modal show={show} onHide={handleClose}>
            <Modal.Body>
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
        )}
      </>
    </>
  );
}

export default SelectContributor;
