import React from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { filterOptions } from "../../utils/GeneratorUtils";


function CustomSelect({
    propName = null,
    options,
    selectedOption = null,
    onChange,
    async = false, 
    asyncCallback = null,
    defaultValue,
    isDisabled = false,
}) {
  const SelectComponent = async ? AsyncSelect : Select;
  return(
    <SelectComponent
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999, color: "grey" }),
        singleValue: (base) => ({ ...base, color: "var(--primary)" }),
        control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--primary)" }),
      }}
      name={propName}
      options={options}
      onChange={onChange}
      value={selectedOption}
      // defaultValue={defaultValue}
      loadOptions={async ? (value) => filterOptions(options, value) : undefined}
      defaultOptions={async ? options.slice(0, 100) : undefined}
      cacheOptions
      isDisabled={isDisabled}
    />
  );
}

export default CustomSelect;
