import {
  MAX_POSITION_PROP,
  MIN_POSITION_PROP,
  MOTOR_MAX_VALUE,
  MOTOR_MIN_VALUE,
  NEUTRAL_POSITION_PROP,
} from "constants/motors";

export const buildConfigurationData = (config) => {
  return [
    {
      description: config.neutralPosition.description,
      images: config.neutralPosition.imageUrls,
      title: "Neutral position",
      prop: NEUTRAL_POSITION_PROP,
    },
    {
      description: config.minPosition.description,
      images: config.minPosition.imageUrls,
      title: "Minimum position",
      prop: MIN_POSITION_PROP,
    },
    {
      description: config.maxPosition.description,
      images: config.maxPosition.imageUrls,
      title: "Maximum position",
      prop: MAX_POSITION_PROP,
    },
  ];
};

export const getSliderMaxValue = (config, prop) => {
  return prop === MIN_POSITION_PROP
    ? config[NEUTRAL_POSITION_PROP].value
    : MOTOR_MAX_VALUE;
};

export const getSliderMinValue = (config, prop) => {
  return prop === MAX_POSITION_PROP
    ? config[NEUTRAL_POSITION_PROP].value
    : MOTOR_MIN_VALUE;
};
