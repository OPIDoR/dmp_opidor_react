import React, { useContext } from 'react';

import { GlobalContext } from '../context/Global.jsx';
import InputText from '../FormComponents/InputText.jsx';
import InputTextDynamicaly from '../FormComponents/InputTextDynamicaly';
import ModalTemplate from '../FormComponents/ModalTemplate';
import SelectContributorMultiple from '../FormComponents/SelectContributorMultiple.jsx';
import SelectContributorSingle from '../FormComponents/SelectContributorSingle.jsx';
import SelectMultipleList from '../FormComponents/SelectMultipleList';
import SelectSingleList from '../FormComponents/SelectSingleList';
import SelectWithCreate from '../FormComponents/SelectWithCreate';
import TinyArea from '../FormComponents/TinyArea';
import { createLabel } from '../../utils/GeneratorUtils.js';

function FormBuilder({ template, readonly }) {
  const { locale } = useContext(GlobalContext);
  if (!template) return false;
  const properties = template.properties;
  const defaults = template.default || {};
  const formFields = [];

  // si type shema is an object
  // retun est code html
  if (template.type === 'object') {
    for (const [key, prop] of Object.entries(properties)) {
      const label = createLabel(prop, locale);
      const tooltip = prop[`tooltip@${locale}`];
      const defaultValue = Object.prototype.hasOwnProperty.call(prop, `const@${locale}`) ? prop[`const@${locale}`] : null;

      /**
       * REGISTRIES
       */
      if (prop.inputType === "dropdown" &&
        (prop.hasOwnProperty("registry_name") || prop.hasOwnProperty("registries"))
      ) {
        // COMPLEX REGISTRY, ONE VALUE SELECTABLE
        if (prop.schema_id && prop.type === 'object') {
          formFields.push(
            <SelectSingleList
              key={key}
              label={label}
              propName={key}
              tooltip={tooltip}
              registries={prop["registries"] || [prop["registry_name"]]}
              registryType="complex"
              templateId={prop.schema_id}
              overridable={prop["overridable"]}
              readonly={readonly}
            ></SelectSingleList>,
          );
          continue;
        }
        // COMPLEX REGISTRY, MULTIPLE VALUES SELECTABLE
        if (prop.items?.schema_id && prop.type === 'array') {
          formFields.push(
            <SelectWithCreate
              key={key}
              label={label}
              propName={key}
              header={prop[`table_header@${locale}`]}
              templateId={prop.items.schema_id}
              registries={prop["registries"] || [prop["registry_name"]]}
              overridable={prop["overridable"]}
              readonly={readonly}
            ></SelectWithCreate>,
          );
          continue;
        }
        // SIMPLE REGISTRY, ONE VALUE SELECTABLE
        if (prop.type === 'string') {
          formFields.push(
            <SelectSingleList
              key={key}
              label={label}
              propName={key}
              tooltip={tooltip}
              registries={prop["registries"] || [prop["registry_name"]]}
              registryType="simple"
              overridable={prop["overridable"]}
              readonly={readonly}
            ></SelectSingleList>,
          );
          continue;
        }
        // MULTIPLE VALUES SELECTABLE
        if (prop.type === 'array') {
          formFields.push(
            <SelectMultipleList
              key={key}
              label={label}
              propName={key}
              tooltip={tooltip}
              registries={prop["registries"] || [prop["registry_name"]]}
              overridable={prop["overridable"]}
              readonly={readonly}
            ></SelectMultipleList>
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
            label={label}
            tooltip={tooltip}
            templateId={prop.schema_id}
            readonly={readonly}
          ></SelectContributorSingle>,
        );
        continue;
      }

      /**
       * SUB FRAGMENTS LIST
       */
      if (prop.type === 'array' && prop.items.type === 'object' && prop.items.schema_id) {
        if (key === 'contributor' && (prop.items.class === 'Contributor' || prop.items.class === 'ContributorStandard')) {
          formFields.push(
            <SelectContributorMultiple
              key={key}
              label={label}
              propName={key}
              header={prop[`table_header@${locale}`]}
              tooltip={tooltip}
              templateId={prop.items.schema_id}
              readonly={readonly}
            ></SelectContributorMultiple>,
          );
        } else {
          // FRAGMENT LIST EDITABLE WITH MODAL
          formFields.push(
            <ModalTemplate
              key={key}
              propName={key}
              label={label}
              tooltip={tooltip}
              header={prop[`table_header@${locale}`]}
              templateId={prop.items.schema_id}
              readonly={readonly}
            ></ModalTemplate>,
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
            label={label}
            propName={key}
            tooltip={tooltip}
            readonly={readonly}
          ></InputTextDynamicaly>,
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
              label={label}
              propName={key}
              tooltip={tooltip}
              readonly={readonly}
            ></TinyArea>,
          );
          continue;
        } else {
          // TEXT FIELDS
          formFields.push(
            <InputText
              key={key}
              label={label}
              type={prop.format || prop.type}
              placeholder={''}
              propName={key}
              tooltip={tooltip}
              hidden={prop.hidden}
              defaultValue={defaultValue}
              readonly={readonly}
            ></InputText>
          );
        }
        continue;
      }
    }
  }
  return formFields;
}

export default FormBuilder;
