import DOMPurify from "dompurify";

/**
 * It takes a JSON object and a list of keys, and returns a string that is the concatenation of the values of the keys in the JSON object
 * @param data - the data object
 * @param keys - ["$..name", "$..age", "$..address.street"]
 * @returns The value of the key in the object.
 */
export function parsePattern(data, keys) {
  //https://www.measurethat.net/Benchmarks/Show/2335/1/slice-vs-substr-vs-substring-with-no-end-index
  const isArrayMatch = /^(.*)\[[0-9]+\]$/gi;
  return keys
    .map((value) => {
      if (value.startsWith("$.")) {
        const path = value.substr(2).trim().split(".");
        return path.reduce((acc, cur) => {
          if (isArrayMatch.test(cur)) {
            const arrayMatch = isArrayMatch.exec(cur);
            return acc?.[arrayMatch?.[1]][arrayMatch?.[2]];
          }
          return acc?.[cur];
        }, data);
      }
      return value;
    })
    .join("");
}

/**
 * It takes a string of HTML, sanitizes it, and returns an object with a property called __html that contains the sanitized HTML.
 * @param html - The HTML string to sanitize.
 * @returns A function that returns an object.
 */
export function createMarkup(html) {
  return {
    __html: DOMPurify.sanitize(html),
  };
}

/**
 * It returns a new array with the item at the specified index removed.
 * @param list - the array you want to remove an item from
 * @param idx - the index of the item to be removed
 * @returns A new array with the item removed.
 */
export function deleteByIndex(list, idx) {
  const newList = [...list];
  if (idx > -1) {
    newList.splice(idx, 1); // 2nd parameter means remove one item only
  }
  return newList;
}

// This function takes two parameters, type and value.
//It checks the type parameter to determine which regular
//expression should be used to test the value parameter.
//If type is "email", it tests the value against a regular expression for
// email addresses. If type is "uri", it tests the value against
// a regular expression for uri's. If neither of these are true, it returns true.
export function getCheckPattern(type, value) {
  const regExEmail = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
  const regExUri =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  if (type === "email") {
    return regExEmail.test(value);
  } else if (type === "uri") {
    return regExUri.test(value);
  } else {
    return true;
  }
}

/**
 * It takes a standardTemplate object and a form object, and returns the first key of the form object that is required and empty
 * @param standardTemplate - {
 * @param formData - form data
 * @returns The first key of the object that has a value of "" or "<p></p>\n"
 */
export function checkRequiredForm(standardTemplate, formData) {
  if (!formData) {
    return undefined;
  }
  const listRequired = standardTemplate?.required;
  //add not existe value to new object
  const newForm = listRequired.reduce((result, key) => {
    result[key] = formData[key] || "";
    return result;
  }, {});
  //check the empty object
  const filteredEntries = Object.entries(newForm).filter(
    ([key, value]) => listRequired.includes(key) && (value === "" || value === "<p></p>" || value === "<p></p>\n")
  );
  const result = Object.fromEntries(filteredEntries);
  return Object.keys(result)[0];
}

/**
 * It converts the object to a string, and then checks if the string is equal to "{}".
 * @param obj - The object to check
 */
export function isEmptyObject(obj) {
  return JSON.stringify(obj) === "{}";
}

/**
 * It takes a value and an object as parameters and returns the value of the key that matches the value parameter.
 * @param value - the key of the object
 * @param object - the object that contains the properties
 * @returns The value of the key "form_label@fr_FR" if it exists, otherwise the value of the key "label@fr_FR"
 */
export function getLabelName(value, object) {
  const keyObject = object.properties;
  if (keyObject[value].hasOwnProperty("form_label@fr_FR")) {
    return keyObject[value]["form_label@fr_FR"];
  }
  return keyObject[value]["label@fr_FR"];
}

/**
 * It takes a number and returns a string with spaces between each group of three digits.
 * @param num - The number to be formatted.
 * @returns a string.
 */
export function formatNumberWithSpaces(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


/**
 * It takes a form object, a schemaId, a propName, and a newObject, and returns a new form object with the newObject nested under the schemaId and
 * propName.
 * @param formData - the form data object
 * @param fragmentId - fragment id
 * @param propName - 'name'
 * @param newObject - {
 * @returns A new object with the formData object spread into it, and then the fragmentId object spread into it, and then the propName object spread into it.
 */
export function updateFormState(formData, fragmentId, propName, newObject) {
  return {
    ...formData,
    [fragmentId]: {
      ...formData[fragmentId],
      [propName]: newObject,
    },
  };
}


export function createOptions(registryValues, locale) {
  let options = registryValues.map((option) => {
    const {label, ...optionValue} = option;
    return {
      value: label ? label[locale] : optionValue[locale],
      label: label ? label[locale] : optionValue[locale],
      object: optionValue,
    }
  });
  return [ {value:'', label:''}, ...options ]
}


/**
 * The function returns true if there are no personnel data issues or if the query is not related to personnel data issues.
 * @param hasPersonnelData - A boolean value indicating whether the person has any personal data or not.
 * @param q - The parameter "q" is likely an object that contains information about the query being made. It is used in the function to check if the
 * classname property of the q object is equal to "personal_data_issues".
 * @returns a boolean value. It will return `true` if `hasPersonnelData` is `false` or if `q.classname` is not equal to `"personal_data_issues"`.
 * Otherwise, it will return `false`.
 */
export function showPersonnalData(hasPersonnelData, q) {
  return !hasPersonnelData || q.classname !== "personal_data_issues";
}

/**
 * The function returns the result of dividing the dividend by the divisor and rounding up to the nearest integer.
 * @param dividend - The number that is being divided. It is the numerator in a division operation.
 * @param divisor - The divisor is the number that the dividend is being divided by in the function. It is the number that determines how many equal
 * parts the dividend will be split into.
 * @returns The function `roundedUpDivision` is returning the result of dividing the `dividend` by the `divisor` and then rounding up the result to the
 * nearest integer using the `Math.ceil` method.
 */
export function roundedUpDivision(dividend, divisor) {
  return Math.ceil(dividend / divisor);
}

export function createDynamicObject(result) {
  let dynamicObject = [];
  for (let i = 0; i < result; i++) {
    var isTruth = null;
    isTruth = i === 0 ? false : true;
    dynamicObject.push(isTruth);
  }
  return dynamicObject;
}