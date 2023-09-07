import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import ImportExternal from "../ExternalImport/ImportExternal";

import BuilderForm from '../Builder/BuilderForm.jsx';
import { createContributorsOptions, createOptions, deleteByIndex, parsePattern, updateFormState } from '../../utils/GeneratorUtils.js';
import { GlobalContext } from '../context/Global.jsx';
import { getContributors, getRegistryByName, getSchema } from '../../services/DmpServiceApi.js';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect.jsx';

function SelectContributorMultiple({
  label,
  propName,
  templateId,
  level,
  tooltip,
  header,
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
  const [template, setTemplate] = useState(null);
  const [role, setRole] = useState(null);
  const [contributorList, setContributorList] = useState([])
  const [roleOptions, setRoleOptions] = useState(null);

  useEffect(() => {
    setContributorList(formData?.[fragmentId]?.[propName] || {})
  }, [fragmentId, propName, formData]);


  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    fetchContributors();
    fetchRoles();
  }, []);

  const fetchContributors = () => {
    getContributors(dmpId).then((res) => {
      setOptions(createContributorsOptions(res.data.results));
    });
  }

  const fetchRoles = () => {
    getRegistryByName('Role').then((res) => {
      setLoadedRegistries({...loadedRegistries, 'Role': res.data});
      const options = createOptions(res.data, locale)
      setRoleOptions(options);
      setRole(formData?.[fragmentId]?.[propName]?.role || options[0]?.value);
    });
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    if (!loadedTemplates[templateId]) {
      getSchema(templateId).then((res) => {
        const contributorTemplate = res.data;
        setLoadedTemplates({ ...loadedTemplates, [templateId]: contributorTemplate });
        setRole(contributorTemplate.properties.role[`const@${locale}`]);
        const personTemplateId = contributorTemplate.properties.person.schema_id;
        getSchema(personTemplateId).then((resSchema) => {
          const personTemplate = resSchema.data;
          setTemplate(personTemplate);
          setLoadedTemplates({ ...loadedTemplates, [personTemplateId]: personTemplate });
        });
      });
    } else {
      const contributorTemplate = loadedTemplates[templateId];
      const personTemplateId = contributorTemplate.properties.person.schema_id;
      setTemplate(loadedTemplates[personTemplateId]);
    }

    if (!contributorList || !template) return;
    const pattern = template.to_string;
    if (!pattern) {
      return;
    }

    setContributorList(contributorList.filter((el) => el.action !== 'delete').map((el) => parsePattern(el, pattern)));
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
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  const handleSelectContributor = (e) => {
    const { object } = e;
    const currentList = formData?.[fragmentId]?.[propName] || [];
    const newObject = { person: { ...object, action: "update" }, role: role, action: "create" };
    const mergedList = [...currentList, newObject];
    setContributorList([...contributorList, newObject])
    setFormData(updateFormState(formData, fragmentId, propName, mergedList));
  };
  
  /**
   * The handleChangeRole function updates the role property of an object in the form state based on the selected value from a dropdown menu.
   */
  const handleSelectRole = (e, index) => {
    const dataCopy = { ...formData };
    dataCopy[fragmentId][propName][index].role = e.value;
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
      const objectPerson = { person: subData, role: role, action: 'update' };
      const filterDeleted = contributorList.filter((el) => el.action !== 'delete');
      const deleteIndex = deleteByIndex(filterDeleted, index);
      const concatedObject = [...deleteIndex, objectPerson];
      setFormData(updateFormState(formData, fragmentId, propName, concatedObject));
      setContributorList([...deleteByIndex([...contributorList], index), subData]);
    } else {
      handleSave();
    }
    toast.success('Enregistrement a été effectué avec succès !');
    setSubData({});
    handleClose();
  };

  /**
   * When the user clicks the save button, the function will take the
   * temporary person object and add it to the form object, then it will parse the
   * temporary person object and add it to the list array, then it will close the
   * modal and set the temporary person object to null.
   */
  const handleSave = () => {
    const objectPerson = { person: subData, role };
    setFormData(updateFormState(formData, fragmentId, propName, [...(contributorList || []), objectPerson]));
    setContributorList([...contributorList, objectPerson]);
    handleClose();
    setSubData({});
  };

  /**
   * I want to delete an item from a list and then update the state of the list.
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
        const newList = [...contributorList];
        setContributorList(deleteByIndex(newList, idx));
        const filterDeleted = contributorList.filter((el) => el.action !== 'delete');
        filterDeleted[idx]['action'] = 'delete';
        setFormData(updateFormState(formData, fragmentId, propName, filterDeleted));
      }
    });
  };

  /**
   * It sets the state of the subData variable to the value of the form[propName][idx] variable.
   * @param idx - the index of the item in the array
   */
  const handleEdit = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    const filterDeleted = contributorList.filter((el) => el.action !== 'delete');
    setSubData(filterDeleted[idx]['person']);
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
            <span className="m-4" data-toggle="tooltip" data-placement="top" title={tooltip}>
              ?
            </span>
          )}
        </div>
        <div className={styles.input_label}>{t("Select a value from the list")}.</div>
        <div className="row">
          <div className={`col-md-11 ${styles.select_wrapper}`}>
            <CustomSelect
              onChange={handleSelectContributor}
              options={options}
              name={propName}
              defaultValue={{
                label: subData ? subData[propName] : '',
                value: subData ? subData[propName] : '',
              }}
              isDisabled={readonly}
            />
          </div>
          {!readonly && (
            <div className="col-md-1" style={{ marginTop: "8px" }}>
              <span>
                <a className="text-primary" href="#" aria-hidden="true" onClick={() => setShow(true)}>
                  <i className="fas fa-plus" />
                </a>
              </span>
            </div>
          )}
        </div>
        {template && contributorList && (
          <table style={{ marginTop: "20px" }} className="table">
            <thead>
              {contributorList.length > 0 && header && contributorList.some((el) => el.action !== "delete") && (
                <tr>
                  <th scope="col">{header}</th>
                  <th scope="col">{t("Role")}</th>
                </tr>
              )}
            </thead>
            <tbody>
              {contributorList.map((el, idx) => (
                <tr key={idx}>
                  <td scope="row" style={{ width: "50%" }}>
                    <div className={styles.border}>
                      <div>{parsePattern(el.person, template.to_string)} </div>
                        {!readonly && (
                          <div className={styles.table_container}>
                            <div className="col-md-1">
                              {level === 1 && (
                                <span>
                                  <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleEdit(e, idx)}>
                                    <i className="fa fa-pen-to-square" />
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
                      </div>
                    </td>
                  <td>
                    {roleOptions && (
                      <CustomSelect
                        onChange={(e) => handleSelectRole(e, idx)}
                        options={roleOptions}
                        selectedOption={{label: el.role, value: el.role}}
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

export default SelectContributorMultiple;
