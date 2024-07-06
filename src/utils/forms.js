/**
 * Retrieves an error message from errors object.
 *
 * @param {string} name - Name of the property to check.
 * @param {Object} errors - Errors object.
 * @returns {*} - Error data if found, otherwise undefined.
 */
export const getError = (name, errors) => {
  // name prop may come from a nested object, so we need to split by dots
  return name.split(".").reduce((obj, key) => obj?.[key], errors);
};
