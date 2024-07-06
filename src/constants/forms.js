import { DESCRIPTION_ITEM_TYPES } from "constants/descriptions";

export const DEFAULT_ADVANCED_FORM = {
  sort_no: "",
  motor_id: "",
  hardware: "",
  transmission: "",
  speed: "",
  acceleration: "",
  torque: "",
  imax1: "",
  imax2: "",
  max1: "",
  max2: "",
  lin_max: "",
  lin_min: "",
  parser: "",
  parser_param: "",
  function: "",
  other_func: "",
  topic: "",
};

export const DEFAULT_MOTOR_FORM = {
  name: "",
  group: "",
  description: "",
  minValue: 0,
  maxValue: 4095,
  neutralPosition: {
    defaultValue: 2048,
    configInstructions: "",
    images: [],
  },
  minPosition: {
    defaultValue: 0,
    configInstructions: "",
    images: [],
  },
  maxPosition: {
    defaultValue: 4095,
    configInstructions: "",
    images: [],
  },
  advanced: DEFAULT_ADVANCED_FORM,
};

export const DEFAULT_MOTION_FORM = {
  name: "",
  description: "",
  defaultValue: 0,
  maxValue: 1,
  minValue: -1,
};

const DEFAULT_ANIMATION_FORM = {
  name: "",
  configInstructions: "",
  images: [],
  motions: [DEFAULT_MOTION_FORM],
};

export const DEFAULT_VISEME_FORM = {
  ...DEFAULT_ANIMATION_FORM,
  type: DESCRIPTION_ITEM_TYPES.VISEME,
};

export const DEFAULT_EXPRESSION_FORM = {
  ...DEFAULT_ANIMATION_FORM,
  type: DESCRIPTION_ITEM_TYPES.EXPRESSION,
};
