import cloneDeep from "lodash/cloneDeep";

/**
 * Converts an item to a form-ready format.
 * Deep clones the item to avoid modifying the original object.
 * Transforms specific properties to fit the expected form structure.
 *
 * @param {Object} item - The item to convert.
 * @param {string} itemType - The type of the item.
 * @returns {Object|null} The converted form object, or null if the item is not provided.
 */
export const convertItemToForm = (item, itemType) => {
  if (!item) {
    return null;
  }

  // clone deep to avoid editing to the original object
  const form = cloneDeep(item);

  // TODO: Extend this for animations
  ["neutralPosition", "minPosition", "maxPosition"].forEach(
    async (position) => {
      form[position].images = form[position].images.map(
        // need an object because useFieldArray from react-hook-form expects an object
        (fileId) => ({ fileId }),
      );
    },
  );
  return form;
};
