export const MODEL_NAME = "test-model-name"; //TODO: Change this to the actual model name

export const DESCRIPTION_TYPES = {
  MOTORS: "motors",
  ANIMATIONS: "animations",
};

export const DESCRIPTION_ITEM_TYPES = {
  MOTOR: "motor",
  VISEME: "viseme",
  EXPRESSION: "expression",
};

export const DESCRIPTION_TYPES_MAP = {
  [DESCRIPTION_ITEM_TYPES.MOTOR]: DESCRIPTION_TYPES.MOTORS,
  [DESCRIPTION_ITEM_TYPES.VISEME]: DESCRIPTION_TYPES.ANIMATIONS,
  [DESCRIPTION_ITEM_TYPES.EXPRESSION]: DESCRIPTION_TYPES.ANIMATIONS,
};

export const CONFIGURATION_OPTIONS = [
  { value: DESCRIPTION_ITEM_TYPES.MOTOR, label: <strong>Motors</strong> },
  { value: DESCRIPTION_ITEM_TYPES.VISEME, label: <strong>Visemes</strong> },
  {
    value: DESCRIPTION_ITEM_TYPES.EXPRESSION,
    label: <strong>Expressions</strong>,
  },
];
