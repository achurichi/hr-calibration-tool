/**
 * Counts the number of decimal places in a number.
 *
 * @param {number} num - The number to check.
 * @returns {number} The number of decimal places.
 */
export const countDecimals = (num) => {
  return (num.toString().split(".")[1] || "").length;
};
