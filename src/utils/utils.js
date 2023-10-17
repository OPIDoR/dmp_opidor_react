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

export function normalizeString(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function stringIncludes(str, substr) {
  return normalizeString(str.toUpperCase()).includes(normalizeString(substr.toUpperCase()));
}
