import React, { useContext, useEffect, useState } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';
import { FaPlus } from 'react-icons/fa6';

import { createOptions } from '../../utils/GeneratorUtils.js';
import { checkFragmentExists, createPersonsOptions } from '../../utils/JsonFragmentsUtils.js';
import { GlobalContext } from '../context/Global.jsx';
import { service } from '../../services';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect.jsx';
import PersonsList from './PersonsList.jsx';
import ModalForm from '../Forms/ModalForm.jsx';
import swalUtils from '../../utils/swalUtils.js';

function SelectContributorMultiple({
  label,
  propName,
  tooltip,
  header,
  templateId,
  readonly,
}) {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { field } = useController({ control, name: propName });
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState(null);
  const {
    locale, dmpId,
    loadedTemplates, setLoadedTemplates,
    loadedRegistries, setLoadedRegistries,
  } = useContext(GlobalContext);
  const [index, setIndex] = useState(null);
  const [template, setTemplate] = useState(null);
  const [editedPerson, setEditedPerson] = useState({});
  const [defaultRole, setDefaultRole] = useState(null);
  const [contributorList, setContributorList] = useState([]);
  const [persons, setPersons] = useState([]);
  const [roleOptions, setRoleOptions] = useState(null);
  const tooltipId = uniqueId('select_contributor_multiple_tooltip_id_');

  useEffect(() => {
    setContributorList(field.value || [])
  }, [field.value]);


  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    fetchPersons();
    fetchRoles();
  }, []);

  useEffect(() => {
    if (persons) {
      setOptions(createPersonsOptions(persons));
    } else {
      setOptions(null)
    }
  }, [persons])

  const fetchPersons = () => {
    service.getPersons(dmpId).then((res) => {
      setPersons(res.data.results);
    });
  }

  const fetchRoles = () => {
    service.getRegistryByName('Role').then((res) => {
      setLoadedRegistries({ ...loadedRegistries, 'Role': res.data });
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
    setEditedPerson(null);
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
    setContributorList(newContributorList);
    field.onChange(newContributorList)
    setError(null);
  };

  /**
   * The handleSelectRole function updates the role property of an object in the form state based on the selected value from a dropdown menu.
   */
  const handleSelectRole = (e, index) => {
    const updatedContributorList = contributorList;
    updatedContributorList[index] = {
      ...updatedContributorList[index],
      role: e.value,
      action: updatedContributorList[index].action || 'update'
    };
    field.onChange(updatedContributorList)

  };

  /**
   * If the index is not null, then delete the item at the index,
   * add the modalData item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  const handleSave = (data) => {
    if (checkFragmentExists(persons, data, template['unicity'])) {
      setError(t('This record already exists.'));
    } else {
      if (index !== null) {
        const newContributorList = [...contributorList];
        newContributorList[index] = {
          ...newContributorList[index],
          person: data,
          role: defaultRole,
          action: newContributorList[index].action || 'update'
        };
        field.onChange(newContributorList)

        setContributorList([...contributorList, data]);
      } else {
        handleSaveNew(data);
      }
      toast.success('Save was successful !');
    }
    setEditedPerson({});
    handleClose();
  };

  /**
   * When the user clicks the save button, the function will take the
   * temporary person object and add it to the form object, then it will parse the
   * temporary person object and add it to the list array, then it will close the
   * modal and set the temporary person object to null.
   */
  const handleSaveNew = (data) => {
    const newContributor = { person: { ...data, action: 'create' }, role: defaultRole, action: 'create' };
    field.onChange([...(contributorList || []), newContributor])

    setContributorList([...contributorList, newContributor]);
    handleClose();
    setEditedPerson({});
  };

  /**
   * I want to delete an item from a list and then update the state of the list.
   */
  const handleDelete = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire(swalUtils.defaultConfirmConfig(t)).then((result) => {
      if (result.isConfirmed) {
        const updatedList = [...contributorList];
        updatedList[idx]['action'] = 'delete';
        field.onChange(updatedList)
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
    setEditedPerson(contributorList[idx]['person']);
    setShow(true);
  };

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
                variant="info" style={{ width: '300px', textAlign: 'center' }}
                content={tooltip}
              />
            )
          }
        </div>
        <div className="row">
          <div className={`col-md-11 ${styles.select_wrapper}`}>
            <CustomSelect
              onSelectChange={handleSelectContributor}
              options={options}
              name={propName}
              isDisabled={readonly}
              placeholder={t("Select a value from the list or create a new one by clicking on +")}
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
        <span className='error-message'>{error}</span>
        {template && (
          <PersonsList
            personsList={contributorList}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            roleOptions={roleOptions}
            handleSelectRole={handleSelectRole}
            defaultRole={defaultRole}
            templateToString={template.to_string}
            tableHeader={header}
            readonly={readonly}
          ></PersonsList>
        )}
      </div>
      <>
        {template && show && (
          <ModalForm
            data={editedPerson}
            template={template}
            label={t('Editing a person')}
            readonly={readonly}
            show={show}
            handleSave={handleSave}
            handleClose={handleClose}
            withImport={true}
          />
        )}
      </>
    </>
  );
}

export default SelectContributorMultiple;
