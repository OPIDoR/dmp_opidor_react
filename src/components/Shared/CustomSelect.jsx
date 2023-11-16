import React from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { filterOptions } from "../../utils/GeneratorUtils";

function CustomSelect({
  propName = null,
  options,
  selectedOption = null,
  onSelectChange,
  async = false,
  isDisabled = false,
  placeholder = null,
}) {
  const SelectComponent = async ? AsyncSelect : Select;
  return (
    <SelectComponent
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999, color: "var(--dark-blue)" }),
        singleValue: (base) => ({ ...base, color: "var(--dark-blue)" }),
        control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--dark-blue)", marginRight: "2px" }),
      }}
      name={propName}
      options={options}
      onChange={onSelectChange}
      value={selectedOption}
      placeholder={placeholder}
      loadOptions={async ? (value) => filterOptions(options, value) : undefined}
      defaultOptions={async ? options.slice(0, 100) : undefined}
      cacheOptions
      isDisabled={isDisabled}
    />
  );
}

export default CustomSelect;
