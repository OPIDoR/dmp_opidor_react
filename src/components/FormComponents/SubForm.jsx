import React, { useContext, useEffect, useState } from 'react';
import uniqueId from 'lodash.uniqueid';
import { FaPenToSquare, FaEye } from 'react-icons/fa6';

import { service } from '../../services';
import styles from '../assets/css/form.module.css';
import NestedForm from '../Forms/NestedForm.jsx';
import { useTranslation } from 'react-i18next';
import { useController, useFormContext } from 'react-hook-form';
import { fragmentEmpty } from '../../utils/utils.js';
import { parsePattern } from '../../utils/GeneratorUtils.js';
import { GlobalContext } from '../context/Global.jsx';
import CustomButton from '../Styled/CustomButton.jsx';

function SubForm({
  label,
  propName,
  tooltip,
  templateId,
  readonly = false,
}) {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { field } = useController({ control, name: propName });
  const {
    loadedTemplates, setLoadedTemplates,
  } = useContext(GlobalContext);
  const [showNestedForm, setShowNestedForm] = useState(false);
  const [editedFragment, setEditedFragment] = useState({});
  const [template, setTemplate] = useState({});

  const tooltipId = uniqueId('sub_form_tooltip_id_');
  const ViewEditComponent = readonly ? FaEye : FaPenToSquare;

  
  useEffect(() => {
    setEditedFragment(field.value || {});
  }, [field.value])

  useEffect(() => {
    if (!loadedTemplates[templateId]) {
      service.getSchema(templateId).then((res) => {
        setTemplate(res.data)
        setLoadedTemplates({ ...loadedTemplates, [templateId]: res.data });
      });
    } else {
      setTemplate(loadedTemplates[templateId]);
    }
  }, [templateId])


  const handleSaveNestedForm = (data) => {
    if (!data) return setShowNestedForm(false);

    const newFragment = { ...field.value, ...data, action: data.action || 'update'};
    field.onChange(newFragment);

    setEditedFragment({});
    setShowNestedForm(false);
  }

  return (
    <div>
      <div className="form-group">
        <div className={styles.label_form}>
          <strong className={styles.dot_label}></strong>
          <label data-tooltip-id={tooltipId}>{label}</label>
        </div>
        <div
          id={`nested-form-${propName}`}
          className={styles.nestedForm}
          style={{ display: showNestedForm ? 'block' : 'none' }}
        ></div>
        {showNestedForm && (
          <NestedForm
            propName={propName}
            data={editedFragment}
            template={template}
            readonly={readonly}
            handleSave={handleSaveNestedForm}
            handleClose={() => {
              setShowNestedForm(false);
              setEditedFragment(field.value);
            }}
          />
        )}

        {!fragmentEmpty(editedFragment) && !showNestedForm && (
          <table style={{ marginTop: "20px" }} className="table">
            <tbody>
              {[editedFragment].map((el, idx) => (
                <tr key={idx}>
                  <td style={{ width: "90%" }}>
                    {parsePattern(el, template?.schema?.to_string)}
                  </td>
                  <td style={{ width: "10%" }}>
                    <ViewEditComponent
                      onClick={() => {
                        setShowNestedForm(true);
                        setEditedFragment(field.value);
                      }}
                      style={{ margin: '8px', cursor: 'pointer' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!readonly && (
          <CustomButton
            handleClick={() => {
              setEditedFragment({ action: 'create' });
              setShowNestedForm(true);
            }}
            title={t("Add an element")}
            buttonColor="rust"
            position="start"
          ></CustomButton>
        )}
      </div>
    </div>
  )
}


export default SubForm;
