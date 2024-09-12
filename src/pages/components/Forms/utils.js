import { isNumeric } from "utils/numbers";

/**
 * Retrieves extra props based on the control props.
 *
 * @param {object} controlProps - The control props.
 * @returns {object} - The extra props.
 */
export const getExtraProps = (controlProps) => {
  const extraProps = {};
  if (controlProps.type === "number") {
    extraProps.registerProps = {
      setValueAs: (value) => {
        return isNumeric(value) ? Number(value) : null;
      },
    };
  }
  return extraProps;
};
