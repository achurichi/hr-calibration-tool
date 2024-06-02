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

const DEFAULT_ANIMATION_FORM = {
  name: "",
  configDescription: "",
  images: [],
  motions: [],
};

export const DEFAULT_VISEME_FORM = {
  ...DEFAULT_ANIMATION_FORM,
  type: DESCRIPTION_ITEM_TYPES.VISEME,
};

export const DEFAULT_EXPRESSION_FORM = {
  ...DEFAULT_ANIMATION_FORM,
  type: DESCRIPTION_ITEM_TYPES.EXPRESSION,
};
