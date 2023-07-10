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
import { useTranslation } from "react-i18next";

/* The above code is a React component that renders a select input field with the ability to add new options to the select list. It also displays a table
of the selected options and allows for editing and deleting of those options. The component uses hooks to manage state and makes use of external
libraries such as React Bootstrap and SweetAlert for styling and displaying confirmation messages. */
function SelectWithCreate({ label, registry, name, template, keyValue, level, tooltip, header, schemaId, readonly, registries }) {
  const { t, i18n } = useTranslation();
  const [lng] = useState(i18n.language.split("-")[0]);
  const [list, setlist] = useState([]);
  const [show, setShow] = useState(false);
  const [options, setoptions] = useState(null);
  const [selectObject, setselectObject] = useState([]);
  const { form, setForm, temp, setTemp } = useContext(GlobalContext);
  const [index, setindex] = useState(null);
  const [registerFile, setregisterFile] = useState(null);
  const shouldShowRef = registries && registries.length > 1;
  const [showRef, setShowRef] = useState(shouldShowRef);
  const [registryName, setRegistryName] = useState(registry);

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

    getRegistryValue(registryName, "token")
      .then((res) => {
        if (res) {
          setOptions(createOptions(res));
        } else {
          return getRegistry(registryName, "token").then((resRegistry) => {
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
  }, [registryName, lng]);

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
      title: t("Are you sure ?"),
      text: t("Are you sure you want to delete this item?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("Close"),
      confirmButtonText: t("Yes, delete!"),
      confirmButtonText: "Oui, supprimer !",
    }).then((result) => {
      if (result.isConfirmed) {
        const newList = [...list];
        setlist(deleteByIndex(newList, idx));
        const concatedObject = [...form[schemaId][keyValue]];
        concatedObject[idx]["updateType"] = "delete";
        setForm(updateFormState(form, schemaId, keyValue, concatedObject));
        Swal.fire(t("Deleted!"), t("Operation completed successfully!."), "success");
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
    //const checkForm = checkRequiredForm(registerFile, temp);
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
    toast.success(t("Registration was successful !"));
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

  const handleChange = (e) => {
    setShowRef(false);
    setRegistryName(e.target.value);
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

        {showRef ? (
          <>
            <div className={styles.input_label}>{t("Select a reference from the list")}.</div>
            <div className="row">
              <div className={`col-md-11 ${styles.select_wrapper}`}>
                <select className="form-control" aria-label="Default select example" onChange={handleChange}>
                  <option selected>{t("Select a reference from the list")}</option>
                  {registries.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.input_label}>{t("Select a value from the list")}.</div>
            {/* {JSON.stringify(registries)} */}
            {registries && registries.length > 1 && (
              <div style={{ margin: "0px 0px 15px 0px" }}>
                <span className={styles.input_label}>{t("Selected reference")} :</span>
                <span className={styles.input_text}>{registryName}</span>
                <span style={{ marginLeft: "10px" }}>
                  <a
                    className="text-primary"
                    href="#"
                    aria-hidden="true"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowRef(true);
                    }}
                  >
                    <i className="fas fa-edit" />
                  </a>
                </span>
              </div>
            )}

            <div className="row">
              <div className={`col-md-11 ${styles.select_wrapper}`}>
                <Select
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    singleValue: (base) => ({ ...base, color: "var(--primary)" }),
                    control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--primary)" }),
                  }}
                  onChange={handleChangeList}
                  options={options}
                  name={name}
                  defaultValue={{
                    label: temp ? temp[name] : "",
                    value: temp ? temp[name] : "",
                  }}
                  isDisabled={readonly}
                />
              </div>
              {!readonly && (
                <div className="col-md-1" style={{ marginTop: "8px" }}>
                  <span>
                    <a className="text-primary" href="#" onClick={(e) => handleShow(e)}>
                      <i className="fas fa-plus" />
                    </a>
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {list && (
          <table style={{ marginTop: "20px" }} className="table">
            <thead>
              {form?.[schemaId]?.[keyValue]?.length > 0 && header && (
                <tr>
                  <th scope="col">{header}</th>
                </tr>
              )}
            </thead>
            <tbody>
              {list.map((el, idx) => (
                <tr key={idx}>
                  <td scope="row" style={{ width: "100%" }}>
                    <div className={styles.border}>
                      <div>{el} </div>

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
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title style={{ color: "var(--orange)", fontWeight: "bold" }}>{label}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "20px !important" }}>
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
    </>
  );
}

export default SelectWithCreate;
