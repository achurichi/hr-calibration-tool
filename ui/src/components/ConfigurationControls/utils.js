import { isNumeric, minMaxBetweenRange, valueBetweenRange } from '@/utils/numbers';

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
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return 'Value is required';
  }
  if (!isNumeric(value)) {
    return 'Value must be a number';
  }
  if (!minMaxBetweenRange(min, max, minAllowed, maxAllowed)) {
    return 'Invalid range';
  }
  if (!valueBetweenRange(Number(value), min, max)) {
    return `Value must be between ${min} and ${max}`;
  }
  return true;
};
