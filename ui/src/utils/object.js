/**
 * Cleans an object by removing properties with empty values.
 * Empty values are considered as: `null`, `undefined`, `""` (empty string),
 * empty arrays, and empty objects.
 *
 * @param {Object} obj - The object to be cleaned.
 * @returns {Object} - The cleaned object.
 */
export const clean = (obj) => {
  // Helper function to determine if a value is empty
  const isEmpty = (v) => {
    return (
      v == null ||
      v === '' ||
      (Array.isArray(v) && v.length === 0) ||
      (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0)
    );
  };

  const cleanObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map((v) => (typeof v === 'object' ? cleanObject(v) : v)).filter((v) => !isEmpty(v));
    } else if (typeof obj === 'object' && obj !== null) {
      return Object.fromEntries(
        Object.entries(obj)
          .map(([k, v]) => [k, typeof v === 'object' ? cleanObject(v) : v])
          .filter(([, v]) => !isEmpty(v))
      );
    } else {
      return obj;
    }
  };

  return cleanObject(obj);
};

/**
 * Trims all string properties in an object.
 *
 * @param {Object} obj - The object to be processed.
 */
export const trimStrings = (obj) => {
  const trimStringsInObject = (obj) => {
    if (Array.isArray(obj)) {
      for (const [index, value] of obj.entries()) {
        if (typeof value === 'object') {
          trimStringsInObject(value);
        } else if (typeof value === 'string') {
          obj[index] = value.trim();
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object') {
          trimStringsInObject(value);
        } else if (typeof value === 'string') {
          obj[key] = value.trim();
        }
      }
    }
  };

  trimStringsInObject(obj);
};
