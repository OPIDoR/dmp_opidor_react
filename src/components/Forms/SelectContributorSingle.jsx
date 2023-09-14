import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import ImportExternal from "../ExternalImport/ImportExternal";

import BuilderForm from '../Builder/BuilderForm.jsx';
import { createContributorsOptions, createOptions, parsePattern, updateFormState } from '../../utils/GeneratorUtils.js';
import { GlobalContext } from '../context/Global.jsx';
import { service } from '../../services';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect.jsx';
import Swal from 'sweetalert2';

function SelectContributorSingle({
  label,
  propName,
  changeValue,
  templateId,
  level,
  tooltip,
  fragmentId,
  readonly, 
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState(null);
  const {
    formData, setFormData, subData, setSubData, locale, dmpId,
    loadedTemplates, setLoadedTemplates,
    loadedRegistries, setLoadedRegistries,
    isEmail,
  } = useContext(GlobalContext);
  const [index, setIndex] = useState(null);
  const [template, setTemplate] = useState({});
  const [role, setRole] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [contributor, setContributor] = useState({})
  const [roleOptions, setRoleOptions] = useState(null);

  useEffect(() => {
    setContributor(formData?.[fragmentId]?.[propName])
    setRole(formData?.[fragmentId]?.[propName]?.role)
  }, [fragmentId, propName, formData]);

  useEffect(() => {
    const pattern = template.to_string;
    if (pattern && pattern.length > 0) {
      setSelectedValue(parsePattern(contributor.person, pattern));
    }
  }, [contributor, template]);

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    fetchContributors();
    fetchRoles();
  }, []);

  const fetchContributors = () => {
    service.getContributors(dmpId).then((res) => {
      setOptions(createContributorsOptions(res.data.results));
    });
  }

  const fetchRoles = () => {
    service.getRegistryByName('Role').then((res) => {
      setLoadedRegistries({...loadedRegistries, 'Role': res.data});
      const options = createOptions(res.data, locale)
      setRoleOptions(options);
      setRole(formData?.[fragmentId]?.[propName]?.role || options[0]?.value);
    });
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    if(!loadedTemplates[templateId]) {
      service.getSchema(templateId).then((res) => {
        const contributorTemplate = res.data
        setLoadedTemplates({...loadedTemplates, [templateId] : res.data});
        setRole(contributorTemplate.properties.role[`const@${locale}`]);
        const personTemplateId = contributorTemplate.properties.person.schema_id;
        service.getSchema(personTemplateId).then((resSchema) => {
          setTemplate(resSchema.data);
          setLoadedTemplates({...loadedTemplates, [personTemplateId] : res.data});
        });
      });
    } else {
      const contributorTemplate = loadedTemplates[templateId];
      const personTemplateId = contributorTemplate.properties.person.schema_id;
      setTemplate(loadedTemplates[personTemplateId]);
    }
    if (!contributor || !template) return;
    const pattern = template.to_string;
    if (!pattern) {
      return;
    }
    setSelectedValue(parsePattern(contributor.person, pattern));
  }, [templateId]);

  /**
   * It closes the modal and resets the state of the modal.
   */
  const handleClose = () => {
    setShow(false);
    setSubData({});
    setIndex(null);
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
   * This function handles the deletion of an element from a list and displays a confirmation message using the Swal library.
   */
  const handleDeleteList = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: t("Are you sure ?"),
      text: t("Are you sure you want to delete this item?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("Close"),
      confirmButtonText: t("Yes, delete!"),
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedValue(null);
        // changeValue({ target: { name: propName, value: { ...value,  ...e.object } } });
      }
    });
  };

  const handleSelectContributor = (e) => {
    const pattern = template.to_string;
    const { object, value } = options[e.target.value];
    setSelectedValue(parsePattern(object, pattern));
    if (pattern.length > 0) {
      setFormData(updateFormState(
        formData, fragmentId, propName, 
        { ...contributor, person: {...object, action: "update" }, role: role, action: "update" }
      ));
    } else {
      changeValue({ target: { propName, value } });
    }
  };
  
  /**
   * The handleChangeRole function updates the role property of an object in the form state based on the selected value from a dropdown menu.
   */
  const handleSelectRole = (e) => {
    setRole(e.value);
    const dataCopy = { ...formData };
    dataCopy[fragmentId][propName].role = e.value;
    setFormData(dataCopy);
  };

  /**
   * If the index is not null, then delete the item at the index,
   * add the subData item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  const handleAddToList = () => {
    if (!isEmail) return toast.error(t("Invalid email"));
    if (index !== null) {
      setFormData(updateFormState(formData, fragmentId, propName, { person: subData, role: role }));
      setSelectedValue(parsePattern(subData, template.to_string));
    } else {
      // save new
      handleSave();
    }
    toast.success('Enregistrement a été effectué avec succès !');
    setSubData({});
    handleClose();
  };

  /**
   * When the user clicks the save button, the function will take the
   * temporary person object and add it to the form object, then it will parse the
   * temporary person object and add it to the list array, then it will close
   * the modal and set the temporary person object to null.
   */
  const handleSave = () => {
    setFormData(updateFormState(
      formData, fragmentId, propName,
      { ...contributor, person: { ...subData, action: 'create' }, role: role, action: 'update' }
    ));
    handleClose();
    setSelectedValue(parsePattern(subData, template.to_string));
    setSubData({});
  };
  /**
   * It sets the state of the subData variable to the value of the form[propName][idx] variable.
   * @param idx - the index of the item in the array
   */
  const handleEdit = (e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    setSubData(contributor.person);
    setShow(true);
    setIndex(idx);
  };

  return (
    <>
      <div className="form-group">
        <div className={styles.label_form}>
          <strong className={styles.dot_label}></strong>
          <label>{label}</label>
          {tooltip && (
            <span 
              className="fas fa-circle-info" 
              data-toggle="tooltip" data-placement="top" title={tooltip}
            ></span>
          )}
        </div>

        <div className={styles.input_label}>{t("Select a value from the list")}.</div>
        <div className="row">
          <div className={`col-md-11 ${styles.select_wrapper}`}>
            <CustomSelect
              onChange={handleSelectContributor}
              options={options}
              name={propName}
              isDisabled={readonly}
              // async={true}
              // asyncCallback={fetchContributors}
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
        {selectedValue && (
          <table style={{ marginTop: "20px" }} className="table">
            <thead>
              <tr>
                <th scope="col">{t("Selected value")}</th>
                <th scope="col">{t("Role")}</th>
              </tr>
            </thead>
            <tbody>
              {[selectedValue].map((el, idx) => (
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
                              <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleDeleteList(e, idx)}>
                                <i className="fa fa-xmark" />
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
                    {roleOptions && (
                      <CustomSelect
                        onChange={handleSelectRole}
                        options={roleOptions}
                        selectedOption={{label: role, value: role}}
                        name={propName}
                        isDisabled={readonly}
                        // async={true}
                        // asyncCallback={fetchContributors}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <>
        {template && (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title style={{ color: "var(--orange)", fontWeight: "bold" }}>{label}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "20px !important" }}>
              <ImportExternal></ImportExternal>
              <BuilderForm
                shemaObject={template}
                level={level + 1}
                fragmentId={fragmentId}
                readonly={readonly}
              ></BuilderForm>
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
