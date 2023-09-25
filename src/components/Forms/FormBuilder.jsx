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

function FormBuilder({ fragment, handleChangeValue, fragmentId, template, level, readonly }) {
  const { locale, dmpId } = useContext(GlobalContext);
  if (!template) return false;
  const properties = template.properties;
  const defaults = template.default || {};
  const data = [];

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
          data.push(
            <SelectSingleList
              key={key}
              value={fragment[key]}
              registries={prop["registries"] || [prop["registry_name"]]}
              label={label}
              propName={key}
              handleChangeValue={handleChangeValue}
              tooltip={tooltip}
              fragmentId={fragmentId}
              fragment={fragment}
              registryType="complex"
              templateId={prop.schema_id}
              readonly={readonly}
            ></SelectSingleList>,
          );
          continue;
        }
        // COMPLEX REGISTRY, MULTIPLE VALUES SELECTABLE
        if (prop.items?.schema_id && prop.type === 'array') {
          data.push(
            <SelectWithCreate
              key={key}
              values={fragment[key]}
              label={label}
              propName={key}
              registries={prop["registries"] || [prop["registry_name"]]}
              handleChangeValue={handleChangeValue}
              templateId={prop.items.schema_id}
              level={level}
              header={prop[`table_header@${locale}`]}
              fragmentId={fragmentId}
              readonly={readonly}
            ></SelectWithCreate>,
          );
          continue;
        }
        // SIMPLE REGISTRY, ONE VALUE SELECTABLE
        if (prop.type === 'string') {
          data.push(
            <SelectSingleList
              key={key}
              value={fragment[key]}
              label={label}
              propName={key}
              registries={prop["registries"] || [prop["registry_name"]]}
              handleChangeValue={handleChangeValue}
              tooltip={tooltip}
              fragmentId={fragmentId}
              registryType="simple"
              readonly={readonly}
            ></SelectSingleList>,
          );
          continue;
        }
        // MULTIPLE VALUES SELECTABLE
        if (prop.type === 'array') {
          data.push(
            <SelectMultipleList
              key={key}
              values={fragment[key]}
              label={label}
              propName={key}
              registries={prop["registries"] || [prop["registry_name"]]}
              handleChangeValue={handleChangeValue}
              tooltip={tooltip}
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
        data.push(
          <SelectContributorSingle
            key={key}
            value={fragment[key]}
            propName={key}
            label={label}
            handleChangeValue={handleChangeValue}
            dmpId={dmpId}
            templateId={prop.schema_id}
            level={level}
            tooltip={tooltip}
            fragmentId={fragmentId}
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
          data.push(
            <SelectContributorMultiple
              key={key}
              values={fragment[key]}
              handleChangeValue={handleChangeValue}
              label={label}
              propName={key}
              templateId={prop.items.schema_id}
              level={level}
              tooltip={tooltip}
              header={prop[`table_header@${locale}`]}
              fragmentId={fragmentId}
              readonly={readonly}
            ></SelectContributorMultiple>,
          );
        } else {
          // FRAGMENT LIST EDITABLE WITH MODAL
          data.push(
            <ModalTemplate
              label={label}
              values={fragment[key]}
              handleChangeValue={handleChangeValue}
              key={key}
              propName={key}
              tooltip={tooltip}
              value={prop}
              templateId={prop.items.schema_id}
              level={level}
              header={prop[`table_header@${locale}`]}
              fragmentId={fragmentId}
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
        data.push(
          <InputTextDynamicaly
            key={key}
            values={fragment[key]}
            handleChangeValue={handleChangeValue}
            label={label}
            propName={key}
            tooltip={tooltip}
            fragmentId={fragmentId}
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
          data.push(
            <TinyArea
              key={key}
              value={fragment[key]}
              handleChangeValue={handleChangeValue}
              label={label}
              propName={key}
              changeValue={handleChangeValue}
              tooltip={tooltip}
              readonly={readonly}
            ></TinyArea>,
          );
          continue;
        } else {
          // TEXT FIELDS
          data.push(
            <InputText
              key={key}
              value={fragment[key]}
              handleChangeValue={handleChangeValue}
              label={label}
              type={prop.format || prop.type}
              placeholder={''}
              isSmall={false}
              propName={key}
              changeValue={handleChangeValue}
              hidden={prop.hidden}
              tooltip={tooltip}
              defaultValue={defaultValue}
              readonly={readonly}
            ></InputText>
          );
        }
        continue;
      }
    }
  }
  return data;
}

export default FormBuilder;
