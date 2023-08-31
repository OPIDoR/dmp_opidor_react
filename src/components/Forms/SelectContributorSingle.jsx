import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import BuilderForm from "../Builder/BuilderForm";
import Select from "react-select";
import { deleteByIndex, parsePatern, updateFormState } from "../../utils/GeneratorUtils";
import { GlobalContext } from "../context/Global";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { getContributor, getRegistryValue, loadForm } from "../../services/DmpServiceApi";
import styles from "../assets/css/form.module.css";
import { useTranslation } from "react-i18next";
import ImportExternal from "../ExternalImport/ImportExternal";

/* The above code is a React component that renders a form input field for selecting contributors. It uses the useState and useEffect hooks to manage
state and make API calls to retrieve data. It also uses the react-bootstrap Modal component to display a form for adding new contributors. The
component allows users to select contributors from a list or add new contributors by filling out a form. It also displays a table of selected
contributors and allows users to edit or delete them. */
function SelectContributorSingle({ label, name, changeValue, registry, keyValue, level, tooltip, schemaId, readonly }) {
  const { t, i18n } = useTranslation();
  const [lng] = useState(i18n.language.split("-")[0]);
  const [list, setlist] = useState([]);
  const [show, setShow] = useState(false);
  const [options, setoptions] = useState(null);
  const [selectObject, setselectObject] = useState([]);
  const { form, setForm, temp, setTemp, isEmail } = useContext(GlobalContext);
  const [index, setindex] = useState(null);
  const [registerFile, setregisterFile] = useState(null);
  const [role, setrole] = useState(null);
  const [optionsRole, setOptionsRole] = useState(null);

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
  }, [temp]);

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    loadForm(registry, "token").then((resRegistry) => {
      //load role
      getRegistryValue("Role").then((resRole) => {
        const options = resRole.map((option) => ({
          value: lng === "fr" ? option?.fr_FR : option?.en_GB,
          label: lng === "fr" ? option?.fr_FR : option?.en_GB,
        }));
        setOptionsRole(options);
        setrole(form?.[schemaId]?.[keyValue]?.role || options[0]?.value);
      });
      setregisterFile(resRegistry.properties.person.template_name);
      const template = resRegistry.properties.person["template_name"];
      loadForm(template, "token").then((res) => {
        setregisterFile(res);
        if (!form?.[schemaId]?.[keyValue]) {
          return;
        }
        const patern = res.to_string;
        if (!patern.length) {
          return;
        }
        if (!form?.[schemaId]?.[keyValue].updateType || !form?.[schemaId]?.[keyValue].updateType === "delete") {
          setlist([parsePatern(form?.[schemaId]?.[keyValue].person, patern)]);
        }
      });
    });
  }, [registry]);

  /**
   * It closes the modal and resets the state of the modal.
   */
  const handleClose = () => {
    setShow(false);
    setTemp(null);
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
      setlist([parsedPatern]);
      setForm(updateFormState(form, schemaId, keyValue, { person: object, role: role }));
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
    if (!isEmail) return toast.error(t("Invalid email"));
    if (index !== null) {
      //update
      const objectPerson = { person: temp, role: role, updateType: "update" };
      setForm(updateFormState(form, schemaId, keyValue, objectPerson));
      const parsedPatern = parsePatern(temp, registerFile.to_string);
      setlist([parsedPatern]);
    } else {
      handleSave();
    }
    toast.success(t("Registration was successful !"));
    setTemp(null);
    handleClose();
  };

  /**
   * When the user clicks the save button, the function will take the temporary person object and add it to the form object, then it will parse the
   * temporary person object and add it to the list array, then it will close the modal and set the temporary person object to null.
   */
  const handleSave = () => {
    const objectPerson = { person: temp, role: role };
    setForm(updateFormState(form, schemaId, keyValue, objectPerson));
    const parsedPatern = parsePatern(temp, registerFile.to_string);
    setlist([parsedPatern]);
    handleClose();
    setTemp(null);
  };

  /**
   * This function handles the deletion of an element from a list and displays a confirmation message using the Swal library.
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
        const newList = [...list];
        setlist(deleteByIndex(newList, idx));
        const filterDeleted = form?.[schemaId]?.[keyValue];
        filterDeleted["updateType"] = "delete";
        setForm(updateFormState(form, schemaId, keyValue, filterDeleted));
        Swal.fire(t("Deleted!"), t("Operation completed successfully!."), "success");
      }
    });
  };

  /**
   * This function handles the edit functionality for a specific item in a form.
   */
  const handleEdit = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setTemp(form?.[schemaId]?.[keyValue]["person"]);
    setShow(true);
    setindex(idx);
  };

  /**
   * The handleChangeRole function updates the role property of an object in the form state based on the selected value from a dropdown menu.
   */
  const handleChangeRole = (e) => {
    setrole(e.value);
    const dataCopy = { ...form };
    dataCopy[schemaId][keyValue].role = e.value;
    setForm(dataCopy);
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
        <div className="row">
          <div className={`col-md-11 ${styles.select_wrapper}`}>
            {/* {JSON.stringify(options)} */}

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
                <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleShow(e)}>
                  <i className="fas fa-plus" />
                </a>
              </span>
            </div>
          )}
        </div>
        {form?.[schemaId]?.[keyValue] && list && (
          <div style={{ padding: "0px 70px 0px 0px" }}>
            <table style={{ marginTop: "20px" }} className="table">
              <thead>
                <tr>
                  <th scope="col">{t("Selected value")}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((el, idx) => (
                  <tr key={idx}>
                    <td scope="row" style={{ width: "50%" }}>
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
                    <td>
                      {optionsRole && (
                        <Select
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            singleValue: (base) => ({ ...base, color: "var(--primary)" }),
                            control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--primary)", height: "43px" }),
                          }}
                          onChange={(e) => handleChangeRole(e, idx)}
                          defaultValue={{
                            label: role || optionsRole[0]?.label,
                            value: role || optionsRole[0]?.value,
                          }}
                          options={optionsRole}
                          name={name}
                          isDisabled={readonly}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <>
        {registerFile && (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title style={{ color: "var(--orange)", fontWeight: "bold" }}>{label}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "20px !important" }}>
              <ImportExternal></ImportExternal>
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
        )}
      </>
    </>
  );
}

export default SelectContributorSingle;
