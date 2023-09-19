import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import ImportExternal from "../ExternalImport/ImportExternal";

import FormBuilder from '../Forms/FormBuilder.jsx';
import { createContributorsOptions, createOptions, parsePattern } from '../../utils/GeneratorUtils.js';
import { GlobalContext } from '../context/Global.jsx';
import { service } from '../../services';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect.jsx';
import Swal from 'sweetalert2';
import ContributorList from './ContributorList';

function SelectContributorSingle({
  value,
  propName,
  label,
  handleChangeValue,
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
    locale,
    dmpId,
    loadedTemplates, setLoadedTemplates,
    loadedRegistries, setLoadedRegistries,
    isEmail,
  } = useContext(GlobalContext);
  const [index, setIndex] = useState(null);
  const [template, setTemplate] = useState({});
  const [modalData, setModalData] = useState({})
  const [defaultRole, setDefaultRole] = useState(null);
  const [contributor, setContributor] = useState({})
  const [roleOptions, setRoleOptions] = useState(null);

  useEffect(() => {
    setContributor(value)
    setDefaultRole(value?.role)
  }, [value]);


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
      setDefaultRole(value?.role || options[0]?.value);
    });
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    if(!loadedTemplates[templateId]) {
      service.getSchema(templateId).then((res) => {
        const contributorTemplate = res.data
        setLoadedTemplates({ ...loadedTemplates, [templateId]: res.data });
        setDefaultRole(contributorTemplate.properties.role[`const@${locale}`]);
        const personTemplateId = contributorTemplate.properties.person.schema_id;
        service.getSchema(personTemplateId).then((resSchema) => {
          setTemplate(resSchema.data);
          setLoadedTemplates({ ...loadedTemplates, [personTemplateId]: res.data });
        });
      });
    } else {
      const contributorTemplate = loadedTemplates[templateId];
      const personTemplateId = contributorTemplate.properties.person.schema_id;
      setTemplate(loadedTemplates[personTemplateId]);
    }
  }, [templateId]);

  /**
   * It closes the modal and resets the state of the modal.
   */
  const handleClose = () => {
    setShow(false);
    setModalData({});
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
  const handleDelete = (e, idx) => {
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
        // changeValue({ target: { name: propName, value: { ...value,  ...e.object } } });
      }
    });
  };

  const handleSelectContributor = (e) => {
    const { object } = e;
    // setFormData(updateFormState(
    //   formData, fragmentId, propName, 
    //   { ...contributor, person: {...object, action: "update" }, role: role, action: "update" }
    // ));
    handleChangeValue(propName, { ...contributor, person: { ...object, action: "update" }, role: defaultRole, action: "update" })
  };

  /**
   * The handleChangeRole function updates the role property of an object in the form state based on the selected value from a dropdown menu.
   */
  const handleSelectRole = (e) => {
    setDefaultRole(e.value);
    // setFormData(dataCopy);
    handleChangeValue(propName, { ...value, role: e.value })
  };

  /**
   * If the index is not null, then delete the item at the index,
   * add the modalData item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  const handleSave = () => {
    if (!isEmail) return toast.error(t("Invalid email"));
    if (index !== null) {
      // setFormData(updateFormState(value, fragmentId, propName, { person: modalData, role: role }));
      handleChangeValue(propName, { ...contributor, person: { ...modalData, action: modalData.action || 'update' } })
    } else {
      // save new
      handleSaveNew();
    }
    toast.success('Enregistrement a été effectué avec succès !');
    setModalData({});
    handleClose();
  };

  /**
   * When the user clicks the save button, the function will take the
   * temporary person object and add it to the form object, then it will parse the
   * temporary person object and add it to the list array, then it will close
   * the modal and set the temporary person object to null.
   */
  const handleSaveNew = () => {
    // setFormData(updateFormState(
    //   value, fragmentId, propName,
    //   { ...contributor, person: { ...modalData, action: 'create' }, role: role, action: 'update' }
    // ));
    handleChangeValue(propName, { ...contributor, person: { ...modalData, action: 'create' }, role: defaultRole, action: 'update' })

    handleClose();
    setModalData({});
  };
  /**
   * It sets the state of the modalData variable to the value of the form[propName][idx] variable.
   * @param idx - the index of the item in the array
   */
  const handleEdit = (e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    setModalData(contributor.person);
    setShow(true);
    setIndex(idx);
  };


  const handleModalValueChange = (propName, value) => {
    setModalData({ ...modalData, [propName]: value });
  }

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
              onChange={(e) => handleSelectContributor(e)}
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
        {template && (
          <ContributorList
            contributorList={[contributor]}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            roleOptions={roleOptions}
            handleSelectRole={handleSelectRole}
            defaultRole={defaultRole}
            templateToString={template.to_string}
            tableHeader={t('Selected value')}
            readonly={readonly}
          ></ContributorList>
        )}
      </div>
      <>
        {template && (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title style={{ color: "var(--orange)", fontWeight: "bold" }}>{label}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "20px !important" }}>
              <ImportExternal fragment={modalData} setFragment={setModalData}></ImportExternal>
              <FormBuilder
                fragment={modalData}
                handleChangeValue={handleModalValueChange}
                fragmentId={fragmentId}
                template={template}
                level={level + 1}
                readonly={readonly}
              ></FormBuilder>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                {t("Close")}
              </Button>
              {!readonly && (
                <Button variant="primary" onClick={handleSave}>
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
