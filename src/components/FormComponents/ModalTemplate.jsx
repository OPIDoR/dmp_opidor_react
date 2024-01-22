import React, { useContext, useEffect, useState } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';

import { GlobalContext } from '../context/Global.jsx';
import { service } from '../../services';
import CustomButton from '../Styled/CustomButton.jsx';
import styles from '../assets/css/form.module.css';
import FragmentList from './FragmentList.jsx';
import ModalForm from '../Forms/ModalForm.jsx';
import swalUtils from '../../utils/swalUtils.js';

/**
 * It takes a template name as an argument, loads the template file, and then
 * renders a modal with the template file as a prop.
 * </code>
 * @returns A React component.
 */
function ModalTemplate({
  label,
  formLabel,
  propName,
  tooltip,
  header,
  templateId,
  readonly = false,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const {
    loadedTemplates, setLoadedTemplates,
  } = useContext(GlobalContext);
  const { control } = useFormContext();
  const { field } = useController({ control, name: propName });
  const [editedFragment, setEditedFragment] = useState({})
  const [index, setIndex] = useState(null);
  const [fragmentsList, setFragmentsList] = useState([]);
  const tooltipId = uniqueId('modal_template_tooltip_id_');


  const [template, setTemplate] = useState(null);
  useEffect(() => {
    if (!loadedTemplates[templateId]) {
      service.getSchema(templateId).then((res) => {
        setTemplate(res.data);
        setLoadedTemplates({ ...loadedTemplates, [templateId]: res.data });
      });
    } else {
      setTemplate(loadedTemplates[templateId]);
    }
  }, [templateId]);

  useEffect(() => {
    setFragmentsList(field.value || [])
  }, [field.value])

  /**
   * The function sets the show state to false
   */
  const handleClose = () => {
    setShow(false);
    setEditedFragment(null);
    setIndex(null);
  };

  /**
   * If the modalData variable is not empty, check if the form is valid, if it is,
   * add the modalData variable to the form, if it's not, show an error message.
   */
  const handleSave = (data) => {
    if (!data) return handleClose();
    if (index !== null) {
      const newFragmentList = [...fragmentsList];
      newFragmentList[index] = {
        ...newFragmentList[index],
        ...data,
        action: newFragmentList[index].action || 'update'
      };
      field.onChange(newFragmentList)
    } else {
      handleSaveNew(data);
    }
    toast.success(t("Save was successful !"));
    handleClose();
  };

  /**
   * When the user clicks the save button, the form is updated with the new data,
   * the modalData is set to null, and the modal is closed.
   */
  const handleSaveNew = (data) => {
    const newFragmentList = [...fragmentsList, { ...data, action: 'create' }];
    setFragmentsList(newFragmentList)
    field.onChange(newFragmentList)
    handleClose();
  };

  /**
   * It creates a new array, then removes the item at the index specified
   * by the parameter, then sets the state to the new array.
   * @param idx - the index of the item in the array
   */
  const handleDelete = (idx) => {
    Swal.fire(swalUtils.defaultConfirmConfig(t)).then((result) => {
      if (result.isConfirmed) {
        const filteredList = fragmentsList.filter((el) => el.action !== 'delete');
        filteredList[idx]['action'] = 'delete';
        field.onChange(filteredList)
      }
    });
  };

  /**
   * This function handles the edit functionality for a form element in a React component.
   */
  const handleEdit = (idx) => {
    setEditedFragment(fragmentsList[idx]);
    setShow(true);
    setIndex(idx);
  };

  return (
    <>
      <div className={`p-2 mb-2`}>
        <div className={styles.label_form}>
          <strong className={styles.dot_label}></strong>
          <label data-tooltip-id={tooltipId}>{formLabel}</label>
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
        {template && (
          <FragmentList
            fragmentsList={fragmentsList}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            templateToString={template?.schema?.to_string}
            tableHeader={header}
            readonly={readonly}
          ></FragmentList>
        )}
        {!readonly && (
          <CustomButton
            handleClick={() => {
              setEditedFragment(null);
              setShow(true);
              setIndex(null);
            }}
            title={t("Add an element")}
            buttonColor="rust"
            position="start"
          ></CustomButton>
        )}
      </div>
      {template && show && (
        <ModalForm
          data={editedFragment}
          template={template}
          label={index !== null ? `${t('Edit')} (${label})` : `${t('Add')} (${label})` }
          readonly={readonly}
          show={show}
          handleSave={handleSave}
          handleClose={handleClose}
        />)}
    </>
  );
}

export default ModalTemplate;
