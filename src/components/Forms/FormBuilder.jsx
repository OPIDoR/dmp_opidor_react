import React, { useContext } from 'react';

import { GlobalContext } from '../context/Global';
import InputText from '../FormComponents/InputText';
import InputTextDynamicaly from '../FormComponents/InputTextDynamicaly';
import ModalTemplate from '../FormComponents/ModalTemplate';
import SelectContributorMultiple from '../FormComponents/SelectContributorMultiple';
import SelectContributorSingle from '../FormComponents/SelectContributorSingle';
import SelectMultipleList from '../FormComponents/SelectMultipleList';
import SelectSingleList from '../FormComponents/SelectSingleList';
import SelectWithCreate from '../FormComponents/SelectWithCreate';
import TinyArea from '../FormComponents/TinyArea';
import SubForm from '../FormComponents/SubForm';
import { createFormLabel } from '../../utils/GeneratorUtils';

function FormBuilder({ template, readonly }) {
  const { locale } = useContext(GlobalContext);
  if (!template) return false;
  const { properties } = template;
  const defaults = template.default?.[locale];
  const formFields = [];

  // si type shema is an object
  // retun est code html
  if (template.type === 'object') {
    for (const [key, prop] of Object.entries(properties)) {
      const formLabel = createFormLabel(prop, locale);
      const tooltip = prop[`tooltip@${locale}`];
      const defaultValue = defaults?.[key];
      const { isConst } = prop;
      /**
       * REGISTRIES
       */
      if (prop.inputType === 'dropdown'
        && (prop.hasOwnProperty('registry_name') || prop.hasOwnProperty('registries'))
      ) {
        // COMPLEX REGISTRY, ONE VALUE SELECTABLE
        if (prop.schema_id && prop.type === 'object') {
          formFields.push(
            <SelectSingleList
              key={key}
              label={formLabel}
              propName={key}
              tooltip={tooltip}
              registries={prop.registries || [prop.registry_name]}
              registryType="complex"
              templateId={prop.schema_id}
              defaultValue={defaultValue}
              overridable={prop.overridable}
              readonly={readonly || isConst}
            />,
          );
          continue;
        }
        // COMPLEX REGISTRY, MULTIPLE VALUES SELECTABLE
        if (prop.items?.schema_id && prop.type === 'array') {
          formFields.push(
            <SelectWithCreate
              key={key}
              label={prop[`label@${locale}`] || 'No label defined'}
              formLabel={formLabel}
              propName={key}
              header={prop[`table_header@${locale}`]}
              templateId={prop.items.schema_id}
              registries={prop.registries || [prop.registry_name]}
              overridable={prop.overridable}
              readonly={readonly || isConst}
            />,
          );
          continue;
        }
        // SIMPLE REGISTRY, ONE VALUE SELECTABLE
        if (prop.type === 'string') {
          formFields.push(
            <SelectSingleList
              key={key}
              label={formLabel}
              propName={key}
              tooltip={tooltip}
              registries={prop.registries || [prop.registry_name]}
              registryType="simple"
              defaultValue={defaultValue}
              overridable={prop.overridable}
              readonly={readonly || isConst}
            />,
          );
          continue;
        }
        // MULTIPLE VALUES SELECTABLE
        if (prop.type === 'array') {
          formFields.push(
            <SelectMultipleList
              key={key}
              label={formLabel}
              propName={key}
              tooltip={tooltip}
              registries={prop.registries || [prop.registry_name]}
              overridable={prop.overridable}
              readonly={readonly || isConst}
            />,
          );
          continue;
        }
      }
      /**
       * SUB FRAGMENTS
       */

      // CONTRIBUTOR
      if (prop.class === 'Contributor' || prop.class === 'ContributorStandard') {
        formFields.push(
          <SelectContributorSingle
            key={key}
            propName={key}
            label={formLabel}
            tooltip={tooltip}
            templateId={prop.schema_id}
            defaultValue={defaultValue}
            readonly={readonly || isConst}
          />,
        );
        continue;
      }
      if (prop.schema_id && prop.type === 'object') {
        formFields.push(
          <SubForm
            key={key}
            label={formLabel}
            propName={key}
            tooltip={tooltip}
            templateId={prop.schema_id}
            readonly={readonly || isConst}
          />,
        );
        continue;
      }

      /**
       * SUB FRAGMENTS LIST
       */
      if (prop.type === 'array' && prop.items.type === 'object' && prop.items.schema_id) {
        if (prop.items.class === 'Contributor' || prop.items.class === 'ContributorStandard') {
          formFields.push(
            <SelectContributorMultiple
              key={key}
              label={formLabel}
              propName={key}
              header={prop[`table_header@${locale}`]}
              tooltip={tooltip}
              templateId={prop.items.schema_id}
              defaultValue={defaultValue}
              readonly={readonly || isConst}
            />,
          );
        } else {
          // FRAGMENT LIST EDITABLE WITH MODAL
          formFields.push(
            <ModalTemplate
              key={key}
              propName={key}
              label={prop[`label@${locale}`] || 'No label defined'}
              formLabel={formLabel}
              tooltip={tooltip}
              header={prop[`table_header@${locale}`]}
              templateId={prop.items.schema_id}
              readonly={readonly || isConst}
            />,
          );
        }
        continue;
      }

      /**
       * ARRAY FIELDS
       */
      if (prop.type === 'array' && prop.items.type === 'string') {
        formFields.push(
          <InputTextDynamicaly
            key={key}
            label={formLabel}
            propName={key}
            tooltip={tooltip}
            readonly={readonly || isConst}
          />,
        );
        continue;
      }

      /**
       * TEXT FIELDS
       * TEXT & TEXTAREA
       */
      if (prop.type === 'string' || prop.type === 'number') {
        //   TEXTAREA
        if (prop.inputType === 'textarea') {
          formFields.push(
            <TinyArea
              key={key}
              label={formLabel}
              propName={key}
              tooltip={tooltip}
              defaultValue={defaultValue}
              readonly={readonly || isConst}
            />,
          );
          continue;
        } else {
          // TEXT FIELDS
          formFields.push(
            <InputText
              key={key}
              label={formLabel}
              type={prop.format || prop.type}
              placeholder=""
              propName={key}
              tooltip={tooltip}
              hidden={prop.hidden}
              defaultValue={defaultValue}
              readonly={readonly || isConst}
            />,
          );
        }
        continue;
      }
    }
  }
  return formFields;
}

export default FormBuilder;
