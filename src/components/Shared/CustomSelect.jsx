import React from "react";
import Select, { components } from "react-select";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";
import CreatableSelect from "react-select/creatable";
import { filterOptions } from "../../utils/GeneratorUtils";
import { useTranslation } from 'react-i18next';
import useSectionsMapping from "../../hooks/useSectionsMapping";

function CustomSelect({
  propName = null,
  options,
  selectedOption = null,
  onSelectChange,
  async = false,
  isDisabled = false,
  placeholder = null,
  overridable = false,
  disableMappingBtn = false
}) {
  const { mapping } = useSectionsMapping();
  const { t } = useTranslation();
  const SelectComponent = getSelectComponent();
  const { Option } = components;

  function getSelectComponent() {
    if (async) {
      return overridable ? AsyncCreatableSelect : AsyncSelect;
    }
    return overridable ? CreatableSelect : Select;
  }

  const CustomOption = (props) => (
    <Option {...props}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {props?.data?.prependIcon}
          {props?.data?.label}
        </div>
        {props?.data?.appendIcon}
      </div>
    </Option>
  );

  return (
    <>
      {(disableMappingBtn || !mapping) &&
        <SelectComponent
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999, color: "var(--dark-blue)" }),
            singleValue: (base) => ({ ...base, color: "var(--dark-blue)" }),
            control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--dark-blue)", marginRight: "2px" }),
          }}
          name={propName}
          components={{ Option: CustomOption }}
          options={options}
          onChange={onSelectChange}
          value={selectedOption}
          placeholder={placeholder}
          loadOptions={async ? (value) => filterOptions(options, value) : undefined}
          defaultOptions={async ? options.slice(0, 100) : undefined}
          cacheOptions
          isDisabled={isDisabled}
          noOptionsMessage={() => t('No results found.')}
        />
      }
      {/* {!disableMappingBtn && <MappingButton path={jsonPath} label={label}/>} */}
    </>
  );
}

export default CustomSelect;
