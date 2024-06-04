import { DESCRIPTION_ITEM_TYPES } from "constants/descriptions";

export const DEFAULT_MOTOR_FORM = {
  name: "",
  group: "",
  description: "",
  minValue: 0,
  maxValue: 4095,
  neutralPosition: {
    defaultValue: 2048,
    configDescription: "",
    images: [],
  },
  minPosition: {
    defaultValue: 0,
    configDescription: "",
    images: [],
  },
  maxPosition: {
    defaultValue: 4095,
    configDescription: "",
    images: [],
  },
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
  configDescription: "",
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
