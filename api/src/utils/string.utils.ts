const capitalizeFirstLetter = (str) => {
  if (!str) return str; // Handle empty strings or falsy values
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const StringUtils = {
  capitalizeFirstLetter,
} as const;
