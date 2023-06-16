import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";

import BuilderForm from '../Builder/BuilderForm.jsx';
import { parsePattern, updateFormState } from '../../utils/GeneratorUtils.js';
import { GlobalContext } from '../context/Global.jsx';
import { getContributors, getSchema } from '../../services/DmpServiceApi.js';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect.jsx';

function SelectContributorSingle({
  label,
  propName,
  changeValue,
  templateId,
  level,
  tooltip,
  fragmentId,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState(null);
  const {
    formData, setFormData, subData, setSubData, locale, dmpId,
    loadedTemplates, setLoadedTemplates,
  } = useContext(GlobalContext);
  const [index, setIndex] = useState(null);
  const [template, setTemplate] = useState({});
  const [role, setRole] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [investigator, setInvestigator] = useState({})

  useEffect(() => {
    setInvestigator(formData?.[fragmentId]?.[propName])
  }, [fragmentId, propName]);

  useEffect(() => {
    const pattern = template.to_string;
    if (pattern && pattern.length > 0) {
      setSelectedValue(parsePattern(investigator.person, pattern));
    }
  }, [investigator, template]);

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getContributors(dmpId).then((res) => {
      const builtOptions = res.data.results.map((option) => ({
        value: option.id,
        label: option.text,
        object: option.object,
      }));
      setOptions(builtOptions);
    });
  }, []);

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    if(!loadedTemplates[templateId]) {
      getSchema(templateId).then((res) => {
        const contributorTemplate = res.data
        setLoadedTemplates({...loadedTemplates, [templateId] : res.data});
        setRole(contributorTemplate.properties.role[`const@${locale}`]);
        const personTemplateId = contributorTemplate.properties.person.schema_id;
        getSchema(personTemplateId).then((resSchema) => {
          setTemplate(resSchema.data);
          setLoadedTemplates({...loadedTemplates, [personTemplateId] : res.data});
        });
      });
    } else {
      const contributorTemplate = loadedTemplates[templateId];
      const personTemplateId = contributorTemplate.properties.person.schema_id;
      setTemplate(loadedTemplates[personTemplateId]);
    }
    if (!investigator || !template) return;
    const pattern = template.to_string;
    console.log(template);
    if (!pattern) {
      return;
    }
    setSelectedValue(parsePattern(investigator.person, pattern));
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

  const handleChangeList = (e) => {
    const pattern = template.to_string;
    const { object, value } = options[e.target.value];
    setSelectedValue(parsePattern(object, pattern));
    if (pattern.length > 0) {
      setFormData(updateFormState(
        formData, fragmentId, propName, 
        { ...investigator, person: {...object, action: "update" }, role: role, action: "update" }
      ));
    } else {
      changeValue({ target: { propName, value } });
    }
  };

  /**
   * If the index is not null, then delete the item at the index,
   * add the subData item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  const handleAddToList = () => {
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
      { ...investigator, person: { ...subData, action: 'create' }, role: role, action: 'update' }
    ));
    handleClose();
    setSubData({});
    setSelectedValue(parsePattern(subData, template.to_string));
  };
  /**
   * It sets the state of the subData variable to the value of the form[propName][idx] variable.
   * @param idx - the index of the item in the array
   */
  const handleEdit = (e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    setSubData(investigator.person);
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
              className="fas fa-info-circle" 
              data-toggle="tooltip" data-placement="top" title={tooltip}
            ></span>
          )}
        </div>

        <div className={styles.input_label}>{t("Select a value from the list")}.</div>
        <div className="row">
          <div className={`col-md-11 ${styles.select_wrapper}`}>
            <CustomSelect
              onChange={handleChangeList}
              options={options}
              name={propName}
            />
          </div>
          <div className="col-md-1" style={{ marginTop: "8px" }}>
            <span>
              <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleShow(e)}>
                <i className="fas fa-plus" />
              </a>
            </span>
          </div>
        </div>
        {selectedValue && (
          <div style={{ margin: "10px" }}>
            <span className={styles.input_label}>{t("Selected value")} :</span>
            <span className={styles.input_text}>{selectedValue}</span>
            <span style={{ marginLeft: "10px" }}>
              <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleEdit(e, 0)}>
                <i className="fas fa-edit" />
              </a>
            </span>
          </div>
        )}
      </div>
      <>
        {template && (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title style={{ color: "var(--orange)", fontWeight: "bold" }}>{label}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "20px !important" }}>
              <BuilderForm
                shemaObject={template}
                level={level + 1}
                fragmentId={fragmentId}
              ></BuilderForm>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                {t("Close")}
              </Button>
              <Button variant="primary" onClick={handleAddToList}>
                {t("Save")}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    </>
  );
}

export default SelectContributorSingle;
