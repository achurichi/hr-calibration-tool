import { DEFAULT_ADVANCED_FORM } from "constants/forms";
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
 * Builds the default configuration form based on the provided item and description.
 *
 * @param {Object} configuredItem - The already configured item, if it exists.
 * @param {Object} description - The description of the item to configure.
 * @param {string} descriptionType - The type of the description.
 * @returns {Object} The default configuration form.
 */
export const buildDefaultConfigurationForm = (
  configuredItem,
  description,
  descriptionType,
) => {
  if (descriptionType === DESCRIPTION_TYPES.MOTORS) {
    if (configuredItem) {
      // if the class object is passed the form is not reset properly
      return {
        ...configuredItem,
        advanced: { ...DEFAULT_ADVANCED_FORM, ...configuredItem.advanced },
      };
    }
    const { advanced, neutralPosition, maxPosition, minPosition } = description;
    return {
      motorId: description.id,
      motorName: description.name,
      neutralPositionValue: neutralPosition.defaultValue,
      maxPositionValue: maxPosition.defaultValue,
      minPositionValue: minPosition.defaultValue,
      advanced: { ...DEFAULT_ADVANCED_FORM, ...advanced },
    };
  }

  // DESCRIPTION_TYPES.ANIMATIONS
  if (configuredItem) {
    // if the class object is passed the form is not reset properly
    return {
      ...configuredItem,
      motions: configuredItem.motions.map((m) => ({ ...m })),
    };
  }
  return {
    animationId: description.id,
    animationName: description.name,
    motions: description.motions.map((m) => ({
      motionId: m.id,
      motionName: m.name,
      value: m.defaultValue,
    })),
  };
};
