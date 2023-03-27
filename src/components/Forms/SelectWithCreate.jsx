import React, { useContext, useEffect, useState } from "react";
import BuilderForm from "../Builder/BuilderForm";
import Select from "react-select";
import { checkRequiredForm, deleteByIndex, getLabelName, parsePatern, updateFormState } from "../../utils/GeneratorUtils";
import { Modal, Button } from "react-bootstrap";
import { GlobalContext } from "../context/Global";
import swal from "sweetalert";
import toast from "react-hot-toast";
import { getRegistry, getRegistryValue, getSchema } from "../../services/DmpServiceApi";
import styles from "../assets/css/form.module.css";

function SelectWithCreate({ label, registry, name, changeValue, template, keyValue, level, tooltip, header, schemaId }) {
  const [list, setlist] = useState([]);
  const [show, setShow] = useState(false);
  const [options, setoptions] = useState(null);
  const [selectObject, setselectObject] = useState([]);
  const { form, setform, temp, settemp, lng } = useContext(GlobalContext);
  const [index, setindex] = useState(null);
  const [registerFile, setregisterFile] = useState(null);

  /* A hook that is called when the component is mounted. It is used to set the options of the select list. */
  useEffect(() => {
    getSchema(template, "token").then((el) => {
      setregisterFile(el);
      if (form?.[schemaId]?.[keyValue]) {
        const patern = el.to_string;
        if (patern.length > 0) {
          Promise.all(form?.[schemaId]?.[keyValue].map((el) => parsePatern(el, patern))).then((listParsed) => {
            setlist(listParsed);
          });
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
    settemp(null);
    setindex(null);
  };
  /**
   * The function takes a boolean value as an argument and sets the state of the show variable to the value of the argument.
   * @param isOpen - boolean
   */
  const handleShow = (isOpen) => {
    setShow(isOpen);
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
    setform(updateFormState(form, schemaId, keyValue, [...(form[schemaId]?.[keyValue] || []), e.object]));
  };

  /**
   * It creates a new array, then removes the item at the index specified by the parameter, then sets the state to the new array.
   * @param idx - the index of the item in the array
   */
  const handleDeleteListe = (idx) => {
    swal({
      title: "Ëtes-vous sûr ?",
      text: "Voulez-vous vraiment supprimer cet élément ?",
      icon: "info",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const newList = [...list];
        setlist(deleteByIndex(newList, idx));
        const deleteIndex = deleteByIndex(form[schemaId][keyValue], idx);
        setform(updateFormState(form, schemaId, keyValue, deleteIndex));
        swal("Opération effectuée avec succès!", {
          icon: "success",
        });
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
        const deleteIndex = deleteByIndex(form[schemaId][keyValue], index);
        const concatedObject = [...deleteIndex, temp];
        setform(updateFormState(form, schemaId, keyValue, concatedObject));
        const newList = deleteByIndex([...list], index);
        const parsedPatern = parsePatern(temp, registerFile.to_string);
        const copieList = [...newList, parsedPatern];
        setlist(copieList);
        settemp(null);
        handleClose();
      } else {
        //add in add
        console.log("add in add");
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
    setform(updateFormState(form, schemaId, keyValue, newObject));
    setlist([...list, parsePatern(temp, registerFile.to_string)]);
    handleClose();
    settemp(null);
  };

  /**
   * It sets the state of the temp variable to the value of the form[keyValue][idx] variable.
   * @param idx - the index of the item in the array
   */
  const handleEdit = (idx) => {
    settemp(form?.[schemaId]?.[keyValue][idx]);
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
        <div className="row">
          <div className={`col-md-10 ${styles.select_wrapper}`}>
            <Select
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              onChange={handleChangeList}
              options={options}
              name={name}
              //defaultValue={isEdit ? isEdit[name] : "Sélectionnez une valeur de la liste ou saisissez une nouvelle."}
              defaultValue={{
                label: temp ? temp[name] : "Sélectionnez une valeur de la liste ou saisissez une nouvelle.",
                value: temp ? temp[name] : "Sélectionnez une valeur de la liste ou saisissez une nouvelle.",
              }}
            />
          </div>
          <div className="col-md-2" style={{ marginTop: "8px" }}>
            <span>
              <a className="text-primary" href="#" onClick={handleShow}>
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
                          <a className="text-primary" href="#" aria-hidden="true" onClick={() => handleEdit(idx)}>
                            <i className="fa fa-edit" />
                          </a>
                        </span>
                      )}
                    </div>
                    <div className="col-md-1" style={{ marginTop: "8px" }}>
                      <span>
                        <a className="text-danger" href="#" aria-hidden="true" onClick={() => handleDeleteListe(idx)}>
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
