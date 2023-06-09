/* eslint-disable no-restricted-syntax */
import React, { useContext } from 'react';

import { GlobalContext } from '../context/Global.jsx';
import InputText from '../Forms/InputText';
import InputTextDynamicaly from '../Forms/InputTextDynamicaly';
import ModalTemplate from '../Forms/ModalTemplate';
import SelectContributorMultiple from '../Forms/SelectContributorMultiple.jsx';
import SelectContributorSingle from '../Forms/SelectContributorSingle.jsx';
import SelectMultipleList from '../Forms/SelectMultipleList';
import SelectSingleList from '../Forms/SelectSingleList';
import SelectWithCreate from '../Forms/SelectWithCreate';
import TinyArea from '../Forms/TinyArea';
import { createLabel } from '../../utils/GeneratorUtils.js';

function HandleGenerateForms({
  shemaObject, level, changeValue, fragmentId, readonly 
}) {
  const { locale, dmpId } = useContext(GlobalContext);
  if (!shemaObject) return false;
  const properties = shemaObject.properties;
  const data = [];
  // si type shema is an object
  // retun est code html
  if (shemaObject.type === 'object') {
    for (const [key, prop] of Object.entries(properties)) {
      const label = createLabel(prop, locale);
      const tooltip = prop[`tooltip@${locale}`];
      const defaultValue = Object.prototype.hasOwnProperty.call(prop, `const@${locale}`) ? prop[`const@${locale}`] : null;
      // condition 1
      if (prop.type === 'string' || prop.type === 'number') {
        // Condition 1.1
        // si inputType === textarea

        if (prop.inputType === 'textarea') {
          data.push(
            <TinyArea
              key={key}
              level={level}
              label={label}
              propName={key}
              changeValue={changeValue}
              tooltip={tooltip}
              fragmentId={fragmentId}
              readonly={readonly}
            ></TinyArea>,
          );
          // sethtmlGenerator(data);
        }
        // Condition 1.2
        // si inputType === dropdown
        if (
          prop.inputType === 'dropdown'
          && Object.prototype.hasOwnProperty.call(prop, 'registry_id')
        ) {
          data.push(
            <SelectSingleList
              key={key}
              label={label}
              propName={key}
              registryId={prop.registry_id}
              changeValue={changeValue}
              tooltip={tooltip}
              level={level}
              fragmentId={fragmentId}
              registryType="simple"
              readonly={readonly}
            ></SelectSingleList>,
          );
        }
        // Condition 1.3
        // si on pas inputType propriete

        if (!Object.prototype.hasOwnProperty.call(prop, 'inputType')) {
          data.push(
            <InputText
              key={key}
              level={level}
              label={label}
              type={prop.format ? prop.format : prop.type}
              placeholder={''}
              isSmall={false}
              smallText={''}
              propName={key}
              changeValue={changeValue}
              hidden={prop.hidden ? true : false}
              tooltip={tooltip}
              defaultValue={defaultValue}
              fragmentId={fragmentId}
              readonly={readonly}
            ></InputText>
          );
        }
      }
      // condition 2
      if (prop.type === 'array') {
        // condition 2.1
        // si inputType === dropdown et on n'a pas de registry_name
        if (
          prop.inputType === 'dropdown'
          && Object.prototype.hasOwnProperty.call(prop, 'registry_id')
        ) {
          if (prop.items.schema_id) {
            data.push(
              <SelectWithCreate
                key={key}
                label={label}
                propName={key}
                registryId={prop.registry_id}
                changeValue={changeValue}
                templateId={prop.items.schema_id}
                level={level}
                header={prop[`table_header@${locale}`]}
                fragmentId={fragmentId}
                readonly={readonly}
              ></SelectWithCreate>,
            );
          } else {
            data.push(
              <SelectMultipleList
                key={key}
                label={label}
                propName={key}
                registryId={prop.registry_id}
                changeValue={changeValue}
                tooltip={tooltip}
                level={level}
                fragmentId={fragmentId}
                readonly={readonly}
              ></SelectMultipleList>
            );
          }
        } else {
          // si on a type === array et items.type === object
          if (prop.items.type === 'object') {
            if (key === 'contributor' && prop.items.class === 'Contributor') {
              data.push(
                <SelectContributorMultiple
                  key={key}
                  label={label}
                  propName={key}
                  changeValue={changeValue}
                  templateId={prop.items.schema_id}
                  level={level}
                  tooltip={tooltip}
                  header={prop[`table_header@${locale}`]}
                  fragmentId={fragmentId}
                  readonly={readonly}
                ></SelectContributorMultiple>,
              );
            } else {
              data.push(
                <ModalTemplate
                  label={label}
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
          }
          if (prop.items.type === 'string') {
            data.push(
              <InputTextDynamicaly
                key={key}
                label={label}
                propName={key}
                tooltip={tooltip}
                fragmentId={fragmentId}
                readonly={readonly}
              ></InputTextDynamicaly>,
            );
          }
        }
      }
      // condition 3
      if (prop.type === 'object') {
        // condition 3.1

        if (Object.prototype.hasOwnProperty.call(prop, 'schema_id')) {
          // console.log(" Sous fragment unique (sous formulaire)");
          if (prop.inputType === 'pickOrCreate') {
            data.push(
              <ModalTemplate
                key={key}
                label={label}
                propName={key}
                tooltip={tooltip}
                templateId={prop.schema_id}
                keyValue={key}
                level={level}
                fragmentId={fragmentId}
                readonly={readonly}
              ></ModalTemplate>
            );
          }

          if (prop.class === 'Contributor') {
            // console.log("TODO : condition funder à voir");
            data.push(
              <SelectContributorSingle
                key={key}
                label={label}
                propName={key}
                changeValue={changeValue}
                dmpId={dmpId}
                templateId={prop.schema_id}
                level={level}
                tooltip={tooltip}
                fragmentId={fragmentId}
                readonly={readonly}
              ></SelectContributorSingle>,
            );
          }
        }
        // codition 3.2
        if (prop.inputType === 'dropdown') {
          if (Object.prototype.hasOwnProperty.call(prop, 'registry_id')) {
            data.push(
              <SelectSingleList
                key={key}
                registryId={prop.registry_id}
                label={label}
                propName={key}
                changeValue={changeValue}
                tooltip={tooltip}
                level={level}
                fragmentId={fragmentId}
                registryType="complex"
                readonly={readonly}
              ></SelectSingleList>,
            );
          }
        }
      }
    }
  }
  return data;
}

export default HandleGenerateForms;
