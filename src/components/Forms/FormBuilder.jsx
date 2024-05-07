import React, { useContext } from 'react';
import { GlobalContext } from '../context/Global.jsx';
import InputText from '../FormComponents/InputText.jsx';
import InputTextList from '../FormComponents/InputTextList.jsx';
import ModalTemplateTable from '../FormComponents/ModalTemplateTable.jsx';
import SelectContributorMultiple from '../FormComponents/SelectContributorMultiple.jsx';
import SelectContributorSingle from '../FormComponents/SelectContributorSingle.jsx';
import SelectMultipleList from '../FormComponents/SelectMultipleList';
import SelectSingleList from '../FormComponents/SelectSingleList';
import DropdownsToEntryTable from '../FormComponents/DropdownsToEntryTable.jsx';
import TinyArea from '../FormComponents/TinyArea';
import SubForm from '../FormComponents/SubForm.jsx';
import { createFormLabel } from '../../utils/GeneratorUtils.js';

function FormBuilder({ template, readonly, jsonPath = null }) {
  const { locale } = useContext(GlobalContext);
  if (!template) return false;
  const properties = template.properties;
  const defaults = template.default?.[locale];
  const formFields = [];

  // if the schema is object type
  // it returns html code
  if (template.type === 'object') {
    // console.log(properties);
    for (const [key, prop] of Object.entries(properties)) {
      const currentJsonPath = jsonPath 
        ? `${jsonPath}.${key}` 
        : `$.${key}`;
      
      const formLabel = createFormLabel(prop, locale);
      const tooltip = prop[`tooltip@${locale}`];
      const defaultValue = defaults?.[key];
      const isConst = prop['isConst'];

      /**
       * REGISTRIES
       */
      if (prop.inputType === "dropdown") {
        const registries = prop["registries"] || [prop["registry_name"]];

        const registryType = prop.type === 'string' 
          ? "simple" 
          : "complex";

        const Component = prop.type === 'array' 
          ? (prop.items?.template_name 
            ? DropdownsToEntryTable // COMPLEX REGISTRY, MULTIPLE VALUES SELECTABLE
            : SelectMultipleList) // MULTIPLE VALUES SELECTABLE
          : SelectSingleList; // ONE VALUE SELECTABLE

        formFields.push(
          <Component
            key={key}
            label={formLabel}
            formLabel={formLabel}
            propName={key}
            tooltip={tooltip}
            registries={registries}
            registryType={registryType}
            templateName={prop.template_name || prop.items?.template_name}
            defaultValue={defaultValue}
            overridable={prop["overridable"]}
            readonly={readonly || isConst}
            jsonPath={currentJsonPath}
          />
        );
      // CONTRIBUTOR
      } else if (prop.class === 'Contributor' || prop.class === 'ContributorStandard') {
        const Component = prop.type === 'array' 
          ? SelectContributorMultiple 
          : SelectContributorSingle;

        formFields.push(
          <Component
            key={key}
            propName={key}
            label={formLabel}
            formLabel={formLabel}
            tooltip={tooltip}
            templateName={prop.template_name}
            defaultValue={defaultValue}
            readonly={readonly || isConst}
            jsonPath={currentJsonPath}
          />
        );
      } else if (prop.template_name && prop.type === 'object') {
        formFields.push(
          <SubForm
            key={key}
            label={formLabel}
            formLabel={formLabel}
            propName={key}
            tooltip={tooltip}
            templateName={prop.template_name}
            readonly={readonly || isConst}
            jsonPath={currentJsonPath}
          />
        );
      // FRAGMENT LIST EDITABLE WITH MODAL
      } else if (prop.type === 'array' && prop.items.type === 'object' && prop.items.template_name) {
        formFields.push(
          <ModalTemplateTable
            key={key}
            propName={key}
            label={formLabel}
            formLabel={formLabel}
            tooltip={tooltip}
            header={prop[`table_header@${locale}`]}
            templateName={prop.items.template_name}
            readonly={readonly || isConst}
            jsonPath={currentJsonPath}
          />
        );
      /**
       * ARRAY FIELDS
       */
      } else if (prop.type === 'array' && prop.items.type === 'string') {
        formFields.push(
          <InputTextList
            key={key}
            label={formLabel}
            propName={key}
            tooltip={tooltip}
            readonly={readonly || isConst}
            jsonPath={currentJsonPath}
          />
        );
      /**
       * TEXT FIELDS
       * TEXT & TEXTAREA
       */
      } else if (prop.type === 'string' || prop.type === 'number') {
        const InputType = prop.inputType === 'textarea' 
          ? TinyArea // TEXTAREA
          : InputText; // TEXT FIELDS

        formFields.push(
          <InputType
            key={key}
            label={formLabel}
            propName={key}
            tooltip={tooltip}
            type={prop.format || prop.type}
            defaultValue={defaultValue}
            readonly={readonly || isConst}
            min={prop.type === 'number' ? 0 : undefined}
            jsonPath={currentJsonPath}
          />
        );
      }
    }
  }
  return formFields;
}

export default FormBuilder;
