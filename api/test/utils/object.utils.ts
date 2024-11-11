import _ from 'lodash';

const normalizeDates = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;

  for (const key in obj) {
    if (obj[key] instanceof Date) {
      obj[key] = obj[key].toISOString();
    } else if (typeof obj[key] === 'object') {
      normalizeDates(obj[key]);
    }
  }
  return obj;
};

const removeProperties = (obj: unknown, excludedProps: string[]) => {
  const newObj = _.cloneDeep(obj);

  for (const prop of excludedProps) {
    const path = prop.split('.');

    // Handle paths with "[]", meaning we need to iterate over arrays
    if (path.includes('[]')) {
      // Find the index where "[]" occurs in the path
      const arrayIndex = path.indexOf('[]');

      // Break down the path into two parts: before and after "[]"
      const arrayPath = path.slice(0, arrayIndex); // Path to the array
      const remainingPath = path.slice(arrayIndex + 1); // Path after the array

      // Get the array at the specified path
      const array = _.get(newObj, arrayPath);

      // If the array exists, iterate over each element and remove the property from each
      if (Array.isArray(array)) {
        array.forEach((item, index) => {
          // Construct the full path for each array element
          const fullPath = [...arrayPath, index.toString(), ...remainingPath];
          _.unset(newObj, fullPath);
        });
      }
    } else {
      // If no "[]", just remove the property normally
      _.unset(newObj, path);
    }
  }

  return newObj;
};

// So vscode can detect references to this file
const ObjectUtils = {
  normalizeDates,
  removeProperties,
};

export default ObjectUtils;
