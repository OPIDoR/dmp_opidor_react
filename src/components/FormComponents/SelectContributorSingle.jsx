import React, { useContext, useEffect, useState } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';
import { FaPlus } from 'react-icons/fa6';
import Swal from 'sweetalert2';

import { createOptions } from '../../utils/GeneratorUtils.js';
import { checkFragmentExists, createPersonsOptions } from '../../utils/JsonFragmentsUtils.js';
import { GlobalContext } from '../context/Global.jsx';
import { service } from '../../services';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect.jsx';
import PersonsList from './PersonsList.jsx';
import ModalForm from '../Forms/ModalForm.jsx';
import swalUtils from '../../utils/swalUtils.js';
import { parsePattern } from "../../utils/GeneratorUtils";

function SelectContributorSingle({
  propName,
  label,
  tooltip,
  templateId,
  defaultValue = null,
  readonly = false,
}) {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { field } = useController({ control, name: propName });
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState(null);
  const {
    locale,
    dmpId,
    persons, setPersons,
    loadedTemplates, setLoadedTemplates,
    loadedRegistries, setLoadedRegistries,
  } = useContext(GlobalContext);
  const [index, setIndex] = useState(null);
  const [template, setTemplate] = useState(null);
  const [editedPerson, setEditedPerson] = useState({});
  const [defaultRole] = useState(defaultValue?.role || null);
  const [contributor, setContributor] = useState({});
  const [roleOptions, setRoleOptions] = useState(null);
  const tooltipId = uniqueId('select_contributor_single_tooltip_id_');

  useEffect(() => {
    setContributor(field.value)
  }, [field.value]);


  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    fetchPersons();
    fetchRoles();
  }, []);

  useEffect(() => {
    if (persons.length > 0) {
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
    });
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    if (!loadedTemplates[templateId]) {
      service.getSchema(templateId).then((res) => {
        const contributorTemplate = res.data
        setLoadedTemplates({ ...loadedTemplates, [templateId]: res.data });
        const contributorProps = contributorTemplate?.schema?.properties || {}
        const personTemplateId = contributorProps.person.schema_id;
        service.getSchema(personTemplateId).then((resSchema) => {
          setTemplate(resSchema.data);
          setLoadedTemplates({ ...loadedTemplates, [personTemplateId]: res.data });
        });
      });
    } else {
      const contributorTemplate = loadedTemplates[templateId];
      const personTemplateId = contributorTemplate?.schema?.properties.person.schema_id;
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
   * This function handles the deletion of an element from a list and displays a confirmation message using the Swal library.
   */
  const handleDelete = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire(swalUtils.defaultConfirmConfig(t)).then((result) => {
      if (result.isConfirmed) {
        // changeValue({ target: { name: propName, value: { ...value,  ...e.object } } });
      }
    });
  };

  const handleSelectContributor = (e) => {
    const { object } = e;
    const contributorAction = contributor?.id ? 'update': 'create';
    field.onChange({ ...contributor, person: { ...object, action: "update" }, role: defaultRole, action: contributorAction })
  };

  /**
   * The handleChangeRole function updates the role property of an object in the form state based on the selected value from a dropdown menu.
   */
  const handleSelectRole = (e) => {
    field.onChange({ ...field.value, role: e.value, action: 'update' })
  };

  /**
   * If the index is not null, then delete the item at the index,
   * add the modalData item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  const handleSave = (data) => {
    if (checkFragmentExists(persons, data, template.schema['unicity'])) {
      setError(t('This record already exists.'));
    } else {
      if (index !== null) {
        service.saveFragment(data.id, data, templateId).then((res) => {
          const savedFragment = res.data.fragment;
          const updatedPersons = [...persons];
          field.onChange({
            ...contributor,
            person: savedFragment,
            action: contributor.action || 'update'
          });
          updatedPersons[updatedPersons.findIndex(el => el.id === savedFragment.id)] = {
            ...savedFragment,
            to_string: parsePattern(data, template?.schema?.to_string)
          }
          setPersons(updatedPersons);

        }).catch(error => setError(error))
      } else {
        // save new
        handleSaveNew(data);
      }
      toast.success('Save was successful !');
      setError(null);
    }
    setEditedPerson({});
    handleClose();
  };

  /**
   * When the user clicks the save button, the function will take the
   * temporary person object and add it to the form object, then it will parse the
   * temporary person object and add it to the list array, then it will close
   * the modal and set the temporary person object to null.
   */
  const handleSaveNew = (data) => {
    service.createFragment(data, template.id, dmpId).then(res => {
      const savedFragment = res.data.fragment;
      field.onChange({ ...contributor, person: savedFragment, role: defaultRole, action: 'update' })
      setPersons([...persons, { savedFragment , to_string: parsePattern(savedFragment, template?.schema?.to_string) }]);
    }).catch(error => setError(error));
    handleClose();
    setEditedPerson({});
  };
  /**
   * It sets the state of the modalData variable to the value of the form[propName][idx] variable.
   * @param idx - the index of the item in the array
   */
  const handleEdit = (e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    setIndex(idx);
    setEditedPerson(contributor.person);
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
              onSelectChange={(e) => handleSelectContributor(e)}
              options={options}
              name={propName}
              isDisabled={readonly}
              placeholder={t("Select a value from the list or create a new one by clicking on +")}
            />
          </div>
          {!readonly && (
            <div className="col-md-1">
              <ReactTooltip
                id="select-contributor-single-add-button"
                place="bottom"
                effect="solid"
                variant="info"
                content={t('Add')}
              />
              <FaPlus
                data-tooltip-id="select-contributor-single-add-button"
                onClick={() => setShow(true)}
                style={{ margin: '8px', cursor: 'pointer' }}
              />
            </div>
          )}
        </div>
        <span className='error-message'>{error}</span>
        {template && (
          <PersonsList
            personsList={contributor ? [contributor] : []}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            roleOptions={roleOptions}
            handleSelectRole={handleSelectRole}
            defaultRole={defaultRole}
            templateToString={template?.schema?.to_string}
            tableHeader={t('Selected value')}
            readonly={readonly}
          ></PersonsList>
        )}
      </div>
      <>
        {template && show && (
          <ModalForm
            data={editedPerson}
            template={template}
            label={index !== null ? t('Editing a person') : t('Adding a person')}
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

export default SelectContributorSingle;
