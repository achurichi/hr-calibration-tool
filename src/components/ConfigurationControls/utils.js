/**
 * Checks if a value is numeric. Works for both strings and numbers.
 *
 * @param {*} value - The value to be checked for being numeric.
 * @returns {boolean} - Returns `true` if the value is numeric, `false` otherwise.
 */
export const isNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Checks if a value is within a specified range.
 *
 * @param {number} value - The value to check.
 * @param {number} minAllowed - The minimum allowed value.
 * @param {number} maxAllowed - The maximum allowed value.
 * @returns {boolean} True if the value is within the range, false otherwise.
 */
const valueBetweenRange = (value, minAllowed, maxAllowed) => {
  return value >= minAllowed && value <= maxAllowed;
};

/**
 * Checks if both min and max values are within a specified range.
 *
 * @param {number} min - The minimum value to check.
 * @param {number} max - The maximum value to check.
 * @param {number} minAllowed - The minimum allowed value.
 * @param {number} maxAllowed - The maximum allowed value.
 * @returns {boolean} True if both min and max are within the range, false otherwise.
 */
const minMaxBetweenRange = (min, max, minAllowed, maxAllowed) => {
  return (
    valueBetweenRange(min, minAllowed, maxAllowed) &&
    valueBetweenRange(max, minAllowed, maxAllowed)
  );
};

/**
 * Returns the value if it is within a specified range, otherwise returns undefined.
 *
 * @param {number} value - The value to check.
 * @param {number} minAllowed - The minimum allowed value.
 * @param {number} maxAllowed - The maximum allowed value.
 * @returns {number|undefined} The value if within the range, otherwise undefined.
 */
export const getLimitValue = (value, minAllowed, maxAllowed) => {
  return Number.isNaN(value) ||
    !valueBetweenRange(value, minAllowed, maxAllowed)
    ? undefined
    : value;
};

/**
 * Validates a value against specified range criteria.
 *
 * @param {string|number} value - The value to validate.
 * @param {number} min - The minimum range value.
 * @param {number} max - The maximum range value.
 * @param {number} minAllowed - The minimum allowed value.
 * @param {number} maxAllowed - The maximum allowed value.
 * @returns {string|boolean} Error message if validation fails, otherwise true.
 */
export const validateRange = (value, min, max, minAllowed, maxAllowed) => {
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return "Value is required";
  }
  if (!isNumeric(value)) {
    return "Value must be a number";
  }
  if (!minMaxBetweenRange(min, max, minAllowed, maxAllowed)) {
    return "Invalid range";
  }
  if (!valueBetweenRange(Number(value), min, max)) {
    return `Value must be between ${min} and ${max}`;
  }
  return true;
};
