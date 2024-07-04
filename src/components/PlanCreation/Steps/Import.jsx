import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from 'react-hot-toast';

import { CustomButton } from "../../Styled";
import { CustomSpinner, CustomSelect } from "../../Shared";
import { clearLocalStorage, getErrorMessage } from '../../../utils/utils';
import getTemplates from "./data";
import { planCreation } from "../../../services";

function Import({ prevStep, params, setUrlParams }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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
      return toast.error(t('An error has occurred while import plan.'));
    }

    setUrlParams({ step: undefined });

    clearLocalStorage();
    toast.success(t('Import was successful !'));

    setLoading(false);

    return window.location = res?.request?.responseURL;
  }

  return (
    <div>
      {loading && <CustomSpinner />}
      {!loading && templates.length === 0 && (
        <h2>{t('There don\'t seem to be any templates that meet these criteria.')}</h2>
      )}
      {!loading && templates.length >= 0 && (
        <>
          <h2>{t('Select the model into which the DMP will be imported.')}</h2>

          <h2>{t('Templace choice')}</h2>
          <CustomSelect
            key={`select-target-template`}
            options={templates}
            placeholder={t('Select a template')}
            selectedOption={selectedTemplate}
            onSelectChange={(e) => setSelectedTemplate(e)}
          />

          <h2>{t('File')}</h2>
          <input
            type="file"
            placeholder="DMP File"
            aria-describedby="upload-dmp"
            onChange={handleFileUpload}
            disabled={!selectedTemplate}
          />

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
