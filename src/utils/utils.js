export function pick(data, keys) {
  return keys
    .filter(key => data[key])
    .reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});
}


export function exists(data, list, keys) {
  return list.some(item =>
    keys.every(key => item[key] === data[key])
  )
}

export function except(data, excludedKeys) {
  const rest = {...data};
  excludedKeys.forEach(key => {
    delete rest[key];
  });
  return rest;
}

export function fragmentEmpty(data) {
  let rest = except(data, ['id', 'schema_id', 'action']);
  return Object.keys(rest).length === 0
}

export function normalizeString(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function stringIncludes(str = "", substr = "") {
  if (!str || !substr) return false;

  return normalizeString(str.toUpperCase()).includes(normalizeString(substr.toUpperCase()));
}

// https://stackoverflow.com/a/43467144
export function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

// Map RHF's dirtyFields over the `data` received by `handleSubmit` and return the changed subset of that data.
// https://github.com/orgs/react-hook-form/discussions/1991#discussioncomment-31308
export function dirtyValues(dirtyFields, allValues) {
  // If *any* item in an array was modified, the entire array must be submitted, because there's no way to indicate
  // "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
  if (dirtyFields === true || Array.isArray(dirtyFields))
    return allValues;
  // Here, we have an object
  return Object.fromEntries(Object.keys(dirtyFields).map(key => [key, dirtyValues(dirtyFields[key], allValues[key])]));
}
