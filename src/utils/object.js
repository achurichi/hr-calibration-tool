/**
 * Cleans an object by removing properties with empty values.
 * Empty values are considered as: `null`, `undefined`, `""` (empty string),
 * empty arrays, and empty objects.
 *
 * @param {Object} obj - The object to be cleaned.
 * @returns {Object} - The cleaned object.
 */
export const cleanObject = (obj) => {
  // Helper function to determine if a value is empty
  const isEmpty = (v) => {
    return (
      v == null ||
      v === "" ||
      (Array.isArray(v) && v.length === 0) ||
      (typeof v === "object" &&
        !Array.isArray(v) &&
        Object.keys(v).length === 0)
    );
  };

  const clean = (obj) => {
    if (Array.isArray(obj)) {
      return obj
        .map((v) => (typeof v === "object" ? clean(v) : v))
        .filter((v) => !isEmpty(v));
    } else if (typeof obj === "object" && obj !== null) {
      return Object.fromEntries(
        Object.entries(obj)
          .map(([k, v]) => [k, typeof v === "object" ? clean(v) : v])
          .filter(([_, v]) => !isEmpty(v)),
      );
    } else {
      return obj;
    }
  };

  return clean(obj);
};
