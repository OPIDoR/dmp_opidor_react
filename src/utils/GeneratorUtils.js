import { stringIncludes } from "./utils";

/**
 * It takes a JSON object and a list of keys, and returns a string that is the concatenation of the values of the keys in the JSON object
 * @param {Object} data - the data object
 * @param {Array} keys - ["$..name", "$..age", "$..address.street"]
 * @returns {string} The value of the key in the object.
 */
export function parsePattern(data, keys = []) {
  if (keys.length === 0) return JSON.stringify(data);
  const isArrayMatch = /^(.*)\[[0-9]+\]$/gi;

  return keys.map(value => {
    if (!value.startsWith("$.")) { return value; }

    return value.substr(2).trim().split(".").reduce((acc, cur) => {
      const match = cur.match(isArrayMatch);
      if (match) {
        const [, objeKey, arrIndex] = match;
        return acc?.[objeKey]?.[arrIndex];
      }
      return acc?.[cur];
    }, data) || '';
  }).join('');
}

/**
 * Creates a list of options from registry values.
 *
 * @param {Array} registryValues - The registry values from which to create the options.
 * @param {string} locale - The locale used to retrieve option labels.
 * @returns {Array} - An array of option objects, each object having a `value`, `label`, and `object` property.
 *                   The first option is an empty option with empty value and label.
 */
export function createOptions(registryValues, locale) {
  return [{ value: '', label: '' }, ...registryValues.map((option) => {
    const { label, ...optionValue } = option;
    const value = label ? label[locale] : optionValue[locale];

    return {
      value,
      label: value,
      object: optionValue,
    };
  })];
}

/**
 * Creates a placeholder message for a registry based on certain conditions.
 *
 * @param {Array} registries - The array of registries.
 * @param {boolean} overridable - Whether the registry is overridable.
 * @param {string} registryType - The type of the registry.
 * @param {function} t - A translation function used to retrieve localized messages.
 * @returns {string} - The placeholder message for the registry.
 */
export function createRegistryPlaceholder(registries, overridable, registryType, t) {
  if(registries.length > 1) {
    if (overridable) {
      return registryType === 'complex' ?
      t("Then select a value from the list or create a new one by clicking on +") :
      t("Then select a value from the list or type a new one") ;
    } else {
      return t("Then select a value from the list");
    }
  } else {
    if (overridable) {
      return registryType === 'complex' ?
      t("Select a value from the list or create a new one by clicking on +") :
      t("Select a value from the list or type a new one") ;
    } else {
      return t("Select a value from the list");
    }
  }
}

/**
 * This function extracts the label from a template property.
 * Returns the form_label if it exists, if not the label, if neither return a 'No label defined' value
 * @param property : the template property to extract the label from
 * @param locale : the locale of the form
 * @returns if it exists a label in the form language
 */
export function createFormLabel(property, locale) {
  return property[`form_label@${locale}`] || property[`label@${locale}`] || 'No label defined'
}

/**
 * This function is used by async selects. It takes an array of select options and filter it based on the value passed as a parameter
 * @param options - options of a select list
 * @param value - value used to search options in a select
 */
export function filterOptions(options, value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(options.filter(o => stringIncludes(o.label, value)));
    }, 500);
  });
}

export function researchOutputTypeToDataType(type) {
  switch(type) {
    case 'Logiciel':
    case 'Software':
      return 'software';
    default:
      return 'none';
  }
}
