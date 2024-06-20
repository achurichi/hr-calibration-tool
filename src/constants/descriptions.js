export const MODEL_NAME = "test-model-name"; // TODO: Get the model name from ros ws
export const ROBOT_NAME = "test-robot-name"; // TODO: Get the robot name from ros ws

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

export const NEW_ITEM_OPTION = {
  value: "__new_item__",
  label: <strong>New</strong>,
};
