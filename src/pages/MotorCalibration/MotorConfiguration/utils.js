export const positionsFromDescription = (description, neutralPositionValue) => {
  return [
    {
      configInstructions: description.neutralPosition.configInstructions,
      defaultValue: description.neutralPosition.defaultValue,
      images: description.neutralPosition.images,
      maxValue: description.maxValue,
      minValue: description.minValue,
      prop: "neutralPositionValue",
      title: "Neutral position",
    },
    {
      configInstructions: description.minPosition.configInstructions,
      defaultValue: description.minPosition.defaultValue,
      images: description.minPosition.images,
      maxValue: neutralPositionValue,
      minValue: description.minValue,
      prop: "minPositionValue",
      title: "Minimum position",
    },
    {
      configInstructions: description.maxPosition.configInstructions,
      defaultValue: description.maxPosition.defaultValue,
      images: description.maxPosition.images,
      maxValue: description.maxValue,
      minValue: neutralPositionValue,
      prop: "maxPositionValue",
      title: "Maximum position",
    },
  ];
};
