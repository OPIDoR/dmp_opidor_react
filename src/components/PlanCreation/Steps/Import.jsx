import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from 'react-hot-toast';
import styled from 'styled-components';
import prettyBytes from 'pretty-bytes';
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa6";

import { CustomButton } from "../../Styled";
import { CustomSpinner, CustomSelect } from "../../Shared";
import { clearLocalStorage } from '../../../utils/utils';
import getTemplates from "./data";
import { planCreation } from "../../../services";

const Dropzone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px dashed var(--rust);
  background-color: transparent;
  border-radius: 3px;
  height: 200px;
  cursor: pointer;
  position: relative;
  color: var(--rust);

  input[type='file'] {
    position: absolute;
    cursor: pointer;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 2;
  }

  section {
    position: absolute;
    text-align: center;
    pointer-events: none;
    z-index: 1;
  }

  &.overlay {
    background-color: rgba(62, 62, 62, 0.3);
    border-color: #787878;
  }
`;

function Import({ prevStep, params, setUrlParams }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const dropZoneRef = useRef();

  useEffect(() => {
    const fetchTemplates = async (opts) => {
      setLoading(true);

      let templatesData;
      try {
        templatesData = await getTemplates(opts, true);
      } catch (error) {
        return setLoading(false);
      }

      setTemplates([
        ...templatesData.default,
        ...templatesData.myOrg,
        ...templatesData.others.map(({ templates }) => templates).flat(),
      ].map(({ id, title }) => ({
        value: id,
        label: title,
      })));

      setLoading(false);
    };

    fetchTemplates(params);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
    return dropZoneRef.current.classList.remove('overlay');
  };

  const handleImport = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('import[template_id]', selectedTemplate.value);
    formData.append('import[format]', params.format);
    formData.append('import[json_file]', file);
    formData.append('commit', 'Importer');

    let res;
    try {
      res = await planCreation.importPlan(formData);
    } catch(error) {
      setLoading(false);
      return toast.error(error?.response?.data?.message || t('An error has occurred while import plan.'));
    }

    setUrlParams({ step: undefined });

    clearLocalStorage();
    toast.success(t('Import was successful !'));

    setLoading(false);

    return window.location = `/plans/${res?.data?.data?.planId}`;
  }

  const onDragHandler = (e, action) => {
    e.preventDefault();

    if (action === 'over') {
      return dropZoneRef.current.classList.add('overlay');
    }

    return dropZoneRef.current.classList.remove('overlay');
  }

  return (
    <div>
      {loading && <CustomSpinner />}
      {!loading && templates.length === 0 && (
        <h2>{t('There don\'t seem to be any templates that meet these criteria.')}</h2>
      )}
      {!loading && templates.length >= 0 && (
        <>
          <h2>{t('Select the model into which the plan will be imported')}</h2>

          <CustomSelect
            key={`select-target-template`}
            options={templates}
            placeholder={t('Select a template')}
            selectedOption={selectedTemplate}
            onSelectChange={(e) => setSelectedTemplate(e)}
          />

          {selectedTemplate && (
            <>
              <h2>{t('File')}</h2>
              <Dropzone
                ref={dropZoneRef}
                onDragOver={(e) => onDragHandler(e, 'over')}
                onDragLeave={(e) => onDragHandler(e, 'leave')}
              >
                <section>
                  <IoCloudUploadOutline size={64} />
                  <h2>{t('Choose a file or drag it')}</h2>
                </section>
                <input
                  type="file"
                  placeholder="DMP File"
                  aria-describedby="upload-dmp"
                  onChange={handleFileUpload}
                  disabled={!selectedTemplate}
                />
              </Dropzone>
              {file && (
                <h2>
                  {file.name} ({prettyBytes(Number.parseInt(file.size, 10))})
                </h2>
              )}
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            {prevStep}
            <div className="row" style={{ margin: '0 0 0 25px' }}>
              <CustomButton
                handleClick={handleImport}
                title={t("Import")}
                position="end"
                disabled={!(selectedTemplate !== null && file !== null)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Import;
