import cloneDeep from "lodash/cloneDeep";
import { DESCRIPTION_ITEM_TYPES } from "constants/descriptions";

/**
 * Prepares a form to be ready to be used by react-hook-form.
 * Deep clones the item to avoid modifying the original object.
 * Transforms specific properties to fit the expected form structure.
 *
 * @param {Object} form - The base form to convert.
 * @param {string} type - The type of the form.
 * @returns {Object|null} The converted form object, or null if the base form is not provided.
 */
export const prepareForm = (baseForm, type) => {
  if (!baseForm) {
    return null;
  }

  // clone deep to avoid editing to the original object
  const form = cloneDeep(baseForm);

  // need to convert flat arrays to objects because useFieldArray from react-hook-form expects objects
  if (type === DESCRIPTION_ITEM_TYPES.MOTOR) {
    ["neutralPosition", "minPosition", "maxPosition"].forEach((position) => {
      form[position].images = form[position].images.map((fileId) => ({
        fileId,
      }));
    });
  } else if (
    type === DESCRIPTION_ITEM_TYPES.EXPRESSION ||
    type === DESCRIPTION_ITEM_TYPES.VISEME
  ) {
    form.images = form.images.map((fileId) => ({ fileId }));
    form.motions = form.motions.map((motion) => ({ value: motion }));
  }

  return form;
};
