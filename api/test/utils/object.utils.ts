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

// So vscode can detect references to this file
const ObjectUtils = {
  normalizeDates,
};

export default ObjectUtils;
