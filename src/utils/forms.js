import { DESCRIPTION_TYPES } from "constants/descriptions";

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

/**
 * Builds the default configuration form based on the provided item.
 *
 * @param {Object} configuredItem - The already configured item.
 * @param {string} descriptionType - The type of the description.
 * @returns {Object} The default configuration form.
 */
export const buildDefaultConfigurationForm = (
  configuredItem,
  descriptionType,
) => {
  if (descriptionType === DESCRIPTION_TYPES.MOTORS) {
    // if the class object is passed the form is not reset properly
    return {
      ...configuredItem,
      mapping: { ...configuredItem.mapping },
    };
  }

  // DESCRIPTION_TYPES.ANIMATIONS
  // if the class object is passed the form is not reset properly
  return {
    ...configuredItem,
    motions: configuredItem.motions.map((m) => ({ ...m })),
  };
};
