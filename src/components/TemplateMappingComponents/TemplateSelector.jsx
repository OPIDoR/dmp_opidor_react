import React, { useEffect, useState } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import CustomSelect from '../Shared/CustomSelect.jsx';
import { sectionsContent } from "../../services";

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
  const { field } = useController({ control, name: propName, defaultValue });
  const [options, setOptions] = useState([]);

  const handleSelectChange = (selectedOption) => {
    field.onChange(selectedOption.value);
    onTemplateChange(selectedOption.value);
  };

  useEffect(() => {
    if (data) {
      setOptions(data);
    }
    else {
      const fetchData = async () => {
        try {
          const res = await sectionsContent.getSectionsData(requestParams);
          const mappedOptions = res.data.map(option => ({
            value: option.id,
            label: option.title
          }));
          setOptions(mappedOptions);
          if (defaultValue) {
            const defaultOption = mappedOptions.find(option => option.value === defaultValue);
            if (defaultOption) {
              field.onChange(defaultOption.value);
            }
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }
  }, [requestParams, defaultValue]); // Ajout de requestParams pour réagir aux changements de mappingType

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
