/**
 * Counts the number of decimal places in a number.
 *
 * @param {number} num - The number to check.
 * @returns {number} The number of decimal places.
 */
export const countDecimals = (num) => {
  return (num.toString().split(".")[1] || "").length;
};

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
export const valueBetweenRange = (value, minAllowed, maxAllowed) => {
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
export const minMaxBetweenRange = (min, max, minAllowed, maxAllowed) => {
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
