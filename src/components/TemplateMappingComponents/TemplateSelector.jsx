import React, { useEffect, useState } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import CustomSelect from '../Shared/CustomSelect.jsx';
import useTemplate from '../../hooks/useTemplate.js';

function TemplateSelector({
  label,
  propName,
  tooltip,
  defaultValue = null,
  readonly = false,
  requestParams = '',
  data,
  onTemplateChange,
}) {
  const { control } = useFormContext();
  const { getSectionsData } = useTemplate();
  const { field } = useController({ control, name: propName, defaultValue });
  const [options, setOptions] = useState([]);

  const handleSelectChange = (selectedOption) => {
    field.onChange(selectedOption.value);
    onTemplateChange(selectedOption.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      let fetchedOptions = [];
      if (data) {
        fetchedOptions = data;
      } else {
        try {
          const res = await getSectionsData(requestParams);
          fetchedOptions = res.data.map(option => ({
            value: option.id,
            label: option.title
          }));
        } catch (err) {
          console.error(err);
        }
        const defaultOption = defaultValue ? fetchedOptions.find(option => option.value === defaultValue) : fetchedOptions[0];
        const value = defaultOption ? defaultOption.value : fetchedOptions[0].value;

        field.onChange(value);
        onTemplateChange(value);
      }
      setOptions(fetchedOptions);
    };

    fetchData();
  }, [requestParams, data]);

  const selectedOption = options.find(option => option.value === field.value) || null;

  return (
    <div className="form-group">
      <label>{label}</label>
      {tooltip && <p>{tooltip}</p>}
      <CustomSelect
        propName={propName}
        onSelectChange={handleSelectChange}
        options={options}
        selectedOption={selectedOption}
        isDisabled={readonly}
        disableMappingBtn
      />
    </div>
  );
}

export default TemplateSelector;
