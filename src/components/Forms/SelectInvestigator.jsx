import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import BuilderForm from "../Builder/BuilderForm";
import { parsePatern, updateFormState } from "../../utils/GeneratorUtils";
import { GlobalContext } from "../context/Global";
import toast from "react-hot-toast";
import { getContributor, getSchema } from "../../services/DmpServiceApi";
import styles from "../assets/css/form.module.css";

function SelectInvestigator({ label, name, changeValue, registry, keyValue, level, tooltip, schemaId }) {
  const [show, setShow] = useState(false);
  const [options, setoptions] = useState(null);
  const { form, setform, temp, settemp } = useContext(GlobalContext);
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
    getSchema(registry, "token").then((resRegistry) => {
      setrole(resRegistry.properties.role["const@fr_FR"]);
      setregisterFile(resRegistry.properties.person.template_name);
      const template = resRegistry.properties.person["template_name"];
      setrole(resRegistry.properties.role["const@fr_FR"]);
      getSchema(template, "token").then((res) => {
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
    settemp(null);
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
   * It takes an event object, and then it sets the selectedValue state to the value of the event object.
   * It then checks if the registerFile.to_string is greater than 0. If it is, it sets the form state to the result of the updateFormState function. If it
   * isn't, it sets the value of the target name to the value of the event object.
   * I
   */
  const handleChangeList = (e) => {
    const patern = registerFile.to_string;
    const { object, value } = options[e.target.value];
    setselectedValue(options[e.target.value].value);
    if (patern.length > 0) {
      setform(updateFormState(form, schemaId, keyValue, { person: object, role: role }));
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
      setform(updateFormState(form, schemaId, keyValue, { person: temp, role: role }));
      setselectedValue(parsePatern(temp, registerFile.to_string));
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
    setform(updateFormState(form, schemaId, keyValue, { person: temp, role: role }));
    handleClose();
    settemp(null);
    setselectedValue(parsePatern(temp, registerFile.to_string));
  };
  /**
   * It sets the state of the temp variable to the value of the form[keyValue][idx] variable.
   * @param idx - the index of the item in the array
   */
  const handleEdit = (e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    settemp(form?.[schemaId]?.[keyValue]["person"]);
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
            {options && (
              <select id="company" className="form-control" onChange={handleChangeList}>
                <option>Sélectionnez une valeur de la liste ou saisissez une nouvelle.</option>
                {options.map((o, idx) => (
                  <option key={o.value} value={idx}>
                    {o.label}
                  </option>
                ))}
                ;
              </select>
            )}
          </div>
          <div className="col-md-2" style={{ marginTop: "8px" }}>
            <span>
              <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleShow(e)}>
                <i className="fas fa-plus-square" />
              </a>
            </span>
          </div>
        </div>
        {selectedValue && (
          <div style={{ margin: "10px" }}>
            <strong>Valeur sélectionnée :</strong> {selectedValue}
            <a href="#" onClick={(e) => handleEdit(e, 0)}>
              {" "}
              (modifié)
            </a>
          </div>
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

export default SelectInvestigator;
