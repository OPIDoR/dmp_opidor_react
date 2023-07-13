import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import BuilderForm from "../Builder/BuilderForm";
import { parsePatern, updateFormState } from "../../utils/GeneratorUtils";
import { GlobalContext } from "../context/Global";
import toast from "react-hot-toast";
import { getContributor, loadForm } from "../../services/DmpServiceApi";
import styles from "../assets/css/form.module.css";
import { useTranslation } from "react-i18next";

/* The above code is a React component that renders a select input field with options fetched from an API. It also allows the user to add new options to
the select field by opening a modal form and saving the new option to the API. The component also handles editing and deleting existing options in the
select field. The selected option is displayed below the select field. */
function SelectContributorSingle({ label, name, changeValue, registry, keyValue, level, tooltip, schemaId, readonly }) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [options, setoptions] = useState(null);
  const { form, setForm, temp, setTemp } = useContext(GlobalContext);
  const [index, setindex] = useState(null);
  const [registerFile, setregisterFile] = useState(null);
  const [role, setrole] = useState(null);
  const [selectedValue, setselectedValue] = useState(null);

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
    loadForm(registry, "token").then((resRegistry) => {
      setrole(resRegistry.properties.role["const@fr_FR"]);
      setregisterFile(resRegistry.properties.person.template_name);
      const template = resRegistry.properties.person["template_name"];
      setrole(resRegistry.properties.role["const@fr_FR"]);
      loadForm(template, "token").then((res) => {
        setregisterFile(res);
        if (!form?.[schemaId]?.[keyValue]) {
          return;
        }
        const patern = res.to_string;
        if (!patern.length) {
          return;
        }
        setselectedValue(parsePatern(form?.[schemaId]?.[keyValue].person, patern));
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
   * The function `handleShow` sets the state of `show` to true and prevents the default behavior of an event.
   */
  const handleShow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShow(true);
  };

  /**
   * This function handles a change in a select input and updates the state accordingly.
   */
  const handleChangeList = (e) => {
    const patern = registerFile.to_string;
    const { object, value } = options[e.target.value];
    setselectedValue(options[e.target.value].value);
    if (patern.length > 0) {
      setForm(updateFormState(form, schemaId, keyValue, { person: object, role: role }));
    } else {
      changeValue({ target: { name, value } });
    }
  };

  /**
   * If the index is not null, then delete the item at the index, add the temp item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  const handleAddToList = () => {
    if (index !== null) {
      setForm(updateFormState(form, schemaId, keyValue, { person: temp, role: role }));
      setselectedValue(parsePatern(temp, registerFile.to_string));
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
    setForm(updateFormState(form, schemaId, keyValue, { person: temp, role: role }));
    handleClose();
    setTemp(null);
    setselectedValue(parsePatern(temp, registerFile.to_string));
  };

  /**
   * This function handles the edit functionality for a specific item in a form.
   */
  const handleEdit = (e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    setTemp(form?.[schemaId]?.[keyValue]["person"]);
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

        <div className={styles.input_label}>{t("Select a value from the list")}.</div>
        <div className="row">
          <div className={`col-md-11 ${styles.select_wrapper}`}>
            {options && (
              <select id="company" className="form-control" onChange={handleChangeList} disabled={readonly}>
                <option></option>
                {options.map((o, idx) => (
                  <option key={o.value} value={idx}>
                    {o.label}
                  </option>
                ))}
                ;
              </select>
            )}
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
        {selectedValue && (
          <div style={{ margin: "10px" }}>
            <span className={styles.input_label}>{t("Selected value")} :</span>
            <span className={styles.input_text}>{selectedValue}</span>

            {!readonly && (
              <span style={{ marginLeft: "10px" }}>
                <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleEdit(e, 0)}>
                  <i className="fas fa-edit" />
                </a>
              </span>
            )}
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
