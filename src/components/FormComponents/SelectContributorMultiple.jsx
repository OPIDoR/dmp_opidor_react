import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';
import { FaPlus } from 'react-icons/fa6';

import FormBuilder from '../Forms/FormBuilder.jsx';
import { createContributorsOptions, createOptions, deleteByIndex } from '../../utils/GeneratorUtils.js';
import { GlobalContext } from '../context/Global.jsx';
import { service } from '../../services';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect.jsx';
import ContributorList from './ContributorList';
import ImportExternal from '../ExternalImport/ImportExternal';

function SelectContributorMultiple({
  values,
  handleChangeValue,
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
    locale, dmpId,
    loadedTemplates, setLoadedTemplates,
    loadedRegistries, setLoadedRegistries,
  } = useContext(GlobalContext);
  const [index, setIndex] = useState(null);
  const [template, setTemplate] = useState(null);
  const [modalData, setModalData] = useState({});
  const [defaultRole, setDefaultRole] = useState(null);
  const [contributorList, setContributorList] = useState([]);
  const [roleOptions, setRoleOptions] = useState(null);
  const tooltipId = uniqueId('select_contributor_multiple_tooltip_id_');

  useEffect(() => {
    setContributorList(values || [])
  }, [values]);


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
      setDefaultRole(options[0]?.value);
    });
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    if (!loadedTemplates[templateId]) {
      service.getSchema(templateId).then((res) => {
        const contributorTemplate = res.data;
        setLoadedTemplates({ ...loadedTemplates, [templateId]: contributorTemplate });
        setDefaultRole(contributorTemplate.properties.role[`const@${locale}`]);
        const personTemplateId = contributorTemplate.properties.person.schema_id;
        service.getSchema(personTemplateId).then((resSchema) => {
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
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  const handleSelectContributor = (e) => {
    const { object } = e;
    const addedContributor = { person: { ...object, action: "update" }, role: defaultRole, action: "create" };
    const newContributorList = [...contributorList, addedContributor];
    setContributorList(newContributorList)
    handleChangeValue(propName, newContributorList)
  };

  /**
   * The handleSelectRole function updates the role property of an object in the form state based on the selected value from a dropdown menu.
   */
  const handleSelectRole = (e, index) => {
    const updatedContributorList = contributorList;
    updatedContributorList[index]= {
      ...updatedContributorList[index],
      role: e.value,
      action: updatedContributorList[index].action || 'update'
    };
    handleChangeValue(propName, updatedContributorList)

  };

  /**
   * If the index is not null, then delete the item at the index,
   * add the modalData item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  const handleSave = () => {
    if (index !== null) {
      const newContributorList = [...values];
      newContributorList[index]= {
        ...newContributorList[index],
        person: modalData,
        role: defaultRole,
        action: newContributorList[index].action || 'update'
      };
      handleChangeValue(propName, newContributorList)

      setContributorList([...contributorList, modalData]);
    } else {
      handleSaveNew();
    }
    toast.success('Enregistrement a été effectué avec succès !');
    setModalData({});
    handleClose();
  };

  /**
   * When the user clicks the save button, the function will take the
   * temporary person object and add it to the form object, then it will parse the
   * temporary person object and add it to the list array, then it will close the
   * modal and set the temporary person object to null.
   */
  const handleSaveNew = () => {
    const objectPerson = { person: { ...modalData, action: 'create' }, role: defaultRole, action: 'create' };
    // setFormData(updateFormState(formData, fragmentId, propName, [...(contributorList || []), objectPerson]));
    handleChangeValue(propName, [...(contributorList || []), objectPerson])

    setContributorList([...contributorList, objectPerson]);
    handleClose();
    setModalData({});
  };

  /**
   * I want to delete an item from a list and then update the state of the list.
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
        const updatedList = [ ...contributorList ];
        updatedList[idx]['action'] = 'delete';
        setContributorList(deleteByIndex(contributorList, idx));
        // setFormData(updateFormState(formData, fragmentId, propName, filterDeleted));
        handleChangeValue(propName, updatedList)
      }
    });
  };

  /**
   * It sets the state of the modalData variable to the value of the form[propName][idx] variable.
   * @param idx - the index of the item in the array
   */
  const handleEdit = (e, idx) => {
    console.log('index', idx);
    e.preventDefault();
    e.stopPropagation();
    setIndex(idx);
    setModalData(contributorList[idx]['person']);
    setShow(true);
  };


  const handleModalValueChange = (propName, value) => {
    setModalData({ ...modalData, [propName]: value });
  }

  return (
    <>
      <div className="form-group">
        <div className={styles.label_form}>
          <strong className={styles.dot_label}></strong>
          <label data-tooltip-id={tooltipId}>{label}</label>
          {
            tooltip && (
              <ReactTooltip
                id={tooltipId}
                place="bottom"
                effect="solid"
                variant="info"style={{ width: '300px', textAlign: 'center' }}
                content={tooltip}
              />
            )
          }
        </div>
        <div className={styles.input_label}>{t("Select a value from the list")}.</div>
        <div className="row">
          <div className={`col-md-11 ${styles.select_wrapper}`}>
            <CustomSelect
              onChange={handleSelectContributor}
              options={options}
              name={propName}
              defaultValue={{
                label: modalData ? modalData[propName] : '',
                value: modalData ? modalData[propName] : '',
              }}
              isDisabled={readonly}
            />
          </div>
          {!readonly && (
            <div className="col-md-1">
              <ReactTooltip
                id="select-contributor-multiple-add-button"
                place="bottom"
                effect="solid"
                variant="info"
                content={t('Add')}
              />
              <FaPlus
                data-tooltip-id="select-contributor-multiple-add-button"
                onClick={() => setShow(true)}
                style={{ margin: '8px', cursor: 'pointer' }}
              />
            </div>
          )}
        </div>
        {template && (
          <ContributorList
            contributorList={contributorList}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            roleOptions={roleOptions}
            handleSelectRole={handleSelectRole}
            defaultRole={defaultRole}
            templateToString={template.to_string}
            tableHeader={header}
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

export default SelectContributorMultiple;
