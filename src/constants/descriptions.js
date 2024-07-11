export const DESCRIPTION_NAME = "default"; // TODO: Get from the configuration
export const ASSEMBLY = "test-assembly-id"; // TODO: Get the assembly id (head or body) from ros ws

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

export const DESCRIPTION_ITEMS_OPTIONS = [
  { value: DESCRIPTION_ITEM_TYPES.MOTOR, label: "Motors" },
  { value: DESCRIPTION_ITEM_TYPES.VISEME, label: "Visemes" },
  {
    value: DESCRIPTION_ITEM_TYPES.EXPRESSION,
    label: "Expressions",
  },
];

export const NEW_ITEM_OPTION = {
  value: "__new_item__",
  label: "New",
};
