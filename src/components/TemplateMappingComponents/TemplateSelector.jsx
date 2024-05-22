import React, { useEffect, useState } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import CustomSelect from '../Shared/CustomSelect.jsx';
import { writePlan } from "../../services";

function TemplateSelector({
  label,
  propName,
  tooltip,
  defaultValue = null,
  readonly = false,
  requestParams = '',
  onTemplateChange,
}) {
  const { control } = useFormContext();
  const { field } = useController({ control, name: propName });
  const [options, setOptions] = useState([]);

  const handleSelectChange = (selectedOption) => {
    field.onChange(selectedOption.value);
    onTemplateChange(selectedOption.value);
  };

  // Find the selected option based on the field value
  const selectedOption = options.find(option => option.id === field.value) || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await writePlan.getSectionsData(requestParams);
        console.log('data:', res.data);
        // const options = res.data.map(template => ({
        //   value: template.id,
        //   label: template.title
        // }));
        // console.log('options: ',options);
        // setTemplates(options);
        setOptions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // --- RENDER ---
  return (
    <div className="form-group">
      <label>{label}</label>
      {tooltip && <p>{tooltip}</p>}
      <CustomSelect
        propName={propName}
        onSelectChange={handleSelectChange}
        options={options.map(option => ({
          value: option.id,
          label: option.title
        }))}
        selectedOption={selectedOption ? { value: selectedOption.id, label: selectedOption.title } : null}
        isDisabled={readonly}
        disableMappingBtn
      />
    </div>
  );
}

export default TemplateSelector;