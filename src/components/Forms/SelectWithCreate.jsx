import React, { useContext, useEffect, useState } from "react";
import BuilderForm from "../Builder/BuilderForm";
import Select from "react-select";
import { checkRequiredForm, deleteByIndex, getLabelName, parsePatern, updateFormState } from "../../utils/GeneratorUtils";
import { Modal, Button } from "react-bootstrap";
import { GlobalContext } from "../context/Global";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { getRegistry, getRegistryValue, loadForm } from "../../services/DmpServiceApi";
import styles from "../assets/css/form.module.css";

/* The above code is a React component that renders a select input field with the ability to add new options to the select list. It also displays a table
of the selected options and allows for editing and deleting of those options. The component uses hooks to manage state and makes use of external
libraries such as React Bootstrap and SweetAlert for styling and displaying confirmation messages. */
function SelectWithCreate({ label, registry, name, changeValue, template, keyValue, level, tooltip, header, schemaId }) {
  const [list, setlist] = useState([]);
  const [show, setShow] = useState(false);
  const [options, setoptions] = useState(null);
  const [selectObject, setselectObject] = useState([]);
  const { form, setForm, temp, setTemp, lng } = useContext(GlobalContext);
  const [index, setindex] = useState(null);
  const [registerFile, setregisterFile] = useState(null);

  /* A hook that is called when the component is mounted. It is used to set the options of the select list. */
  useEffect(() => {
    loadForm(template, "token").then((el) => {
      setregisterFile(el);
      if (form?.[schemaId]?.[keyValue]) {
        const patern = el.to_string;
        if (patern.length > 0) {
          Promise.all(form?.[schemaId]?.[keyValue].filter((el) => el.updateType !== "delete").map((el) => parsePatern(el, patern))).then(
            (listParsed) => {
              setlist(listParsed);
            }
          );
        }
      }
    });
  }, [template, form?.[schemaId]?.[keyValue]]);

  /* A hook that is called when the component is mounted. It is used to set the options of the select list. */
  useEffect(() => {
    let isMounted = true;
    const createOptions = (data) => {
      return data.map((option) => ({
        value: lng === "fr" ? option?.fr_FR || option?.label?.fr_FR : option?.en_GB || option?.label?.en_GB,
        label: lng === "fr" ? option?.fr_FR || option?.label?.fr_FR : option?.en_GB || option?.label?.en_GB,
        object: option,
      }));
    };
    const setOptions = (data) => {
      if (isMounted) {
        setoptions(data);
      }
    };
    getRegistryValue(registry, "token")
      .then((res) => {
        if (res) {
          setOptions(createOptions(res));
        } else {
          return getRegistry(registry, "token").then((resRegistry) => {
            setOptions(createOptions(resRegistry));
          });
        }
      })
      .catch((error) => {
        // handle errors
      });
    return () => {
      isMounted = false;
    };
  }, [registry, lng]);

  /**
   * It closes the modal and resets the state of the modal.
   */
  const handleClose = () => {
    setShow(false);
    setTemp(null);
    setindex(null);
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
    const patern = registerFile.to_string;
    const parsedPatern = patern.length > 0 ? parsePatern(e.object, patern) : null;
    const updatedList = patern.length > 0 ? [...list, parsedPatern] : [...list, e.value];
    setlist(updatedList);
    setselectObject(patern.length > 0 ? [...selectObject, e.object] : selectObject);
    setForm(updateFormState(form, schemaId, keyValue, [...(form[schemaId]?.[keyValue] || []), e.object]));
  };

  /**
   * The function handles the deletion of an element from a list and displays a confirmation message using the Swal library.
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
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimer !",
    }).then((result) => {
      if (result.isConfirmed) {
        const newList = [...list];
        setlist(deleteByIndex(newList, idx));
        const concatedObject = [...form[schemaId][keyValue]];
        concatedObject[idx]["updateType"] = "delete";
        setForm(updateFormState(form, schemaId, keyValue, concatedObject));
        Swal.fire("Supprimé!", "Opération effectuée avec succès!.", "success");
      }
    });
  };

  /**
   * If the index is not null, then delete the item at the index, add the temp item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  const handleAddToList = () => {
    if (!temp) {
      handleClose();
      return;
    }
    const checkForm = checkRequiredForm(registerFile, temp);
    if (checkForm) {
      toast.error("Veuiller remplire le champs " + getLabelName(checkForm, registerFile));
    } else {
      if (index !== null) {
        //add in update
        const filterDeleted = form?.[schemaId]?.[keyValue].filter((el) => el.updateType !== "delete");
        const deleteIndex = deleteByIndex(filterDeleted, index);
        const concatedObject = [...deleteIndex, { ...temp, updateType: "update" }];
        setForm(updateFormState(form, schemaId, keyValue, concatedObject));

        const newList = deleteByIndex([...list], index);
        const parsedPatern = parsePatern(temp, registerFile.to_string);
        const copieList = [...newList, parsedPatern];
        setlist(copieList);
        setTemp(null);
        handleClose();
      } else {
        //add in add
        handleSave();
      }
      toast.success("Enregistrement a été effectué avec succès !");
    }
  };

  /**
   * I'm trying to add a new object to an array of objects, and then add that array to a new object.
   */
  const handleSave = () => {
    let newObject = form[schemaId][keyValue] ? [...form[schemaId][keyValue], temp] : [temp];
    setForm(updateFormState(form, schemaId, keyValue, newObject));
    setlist([...list, parsePatern(temp, registerFile.to_string)]);
    handleClose();
    setTemp(null);
  };

  /**
   * This function handles the edit functionality for a specific item in a form.
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
              <a className="text-primary" href="#" onClick={(e) => handleShow(e)}>
                <i className="fas fa-plus-square" />
              </a>
            </span>
          </div>
        </div>
        {list && (
          <table style={{ marginTop: "20px" }} className="table table-bordered">
            <thead>
              {form?.[schemaId]?.[keyValue]?.length > 0 && header && (
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
                    <p className={`m-2 ${styles.border}`}> {el} </p>
                  </td>
                  <td style={{ width: "10%" }}>
                    <div className="col-md-1" style={{ marginTop: "8px" }}>
                      {level === 1 && (
                        <span>
                          <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleEdit(e, idx)}>
                            <i className="fa fa-edit" />
                          </a>
                        </span>
                      )}
                    </div>
                    <div className="col-md-1" style={{ marginTop: "8px" }}>
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
      </>
    </>
  );
}

export default SelectWithCreate;
