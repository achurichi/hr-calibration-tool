import { DESCRIPTION_ITEM_TYPES } from '@/constants/descriptions';

export const DEFAULT_ADVANCED_FORM = {
  motor_id: null,
  sort_no: null,
  speed: null,
  acceleration: null,
  torque: null,
  hardware: '',
  transmission: '',
  topic: '',
};

export const DEFAULT_ADVANCED_MAPPING_FORM = {
  lin_min: null,
  lin_max: null,
  imax1: null,
  max1: null,
  imax2: null,
  max2: null,
  parser: '',
  parser_param: '',
  function: '',
  other_func: '',
};

export const DEFAULT_MOTOR_FORM = {
  name: '',
  group: '',
  description: '',
  minValue: 0,
  maxValue: 4095,
  neutralPosition: {
    defaultValue: 2048,
    configInstructions: '',
    images: [],
  },
  minPosition: {
    defaultValue: 0,
    configInstructions: '',
    images: [],
  },
  maxPosition: {
    defaultValue: 4095,
    configInstructions: '',
    images: [],
  },
  defaultShow: true,
  ...DEFAULT_ADVANCED_FORM,
  mapping: DEFAULT_ADVANCED_MAPPING_FORM,
};

export const DEFAULT_MOTION_FORM = {
  name: '',
  description: '',
  defaultValue: 0,
  maxValue: 1,
  minValue: -1,
};

const DEFAULT_ANIMATION_FORM = {
  name: '',
  configInstructions: '',
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
