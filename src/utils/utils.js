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
  let rest = except(data, ['id', 'schema_id', 'template_name', 'action']);
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

export function getErrorMessage(error) {
  if (error.response && error.response.data) {
    return error.response.data.message || error.response.data.error;
  } else if (error.request) {
    return error.request;
  } else if (error.message) {
    return error.message;
  }
  return null;
}

export function clearLocalStorage() {
  if (localStorage.getItem('researchContext')) {
    localStorage.removeItem('researchContext');
  }
  if (localStorage.getItem('isStructured')) {
    localStorage.removeItem('isStructured');
  }
  if (localStorage.getItem('templateId')) {
    localStorage.removeItem('templateId');
  }
  if (localStorage.getItem('templateName')) {
    localStorage.removeItem('templateName');
  }
  if (localStorage.getItem('templateLanguage')) {
    localStorage.removeItem('templateLanguage');
  }
}
