export const getSectionData = (description, neutralPositionValue) => {
  return [
    {
      configInstructions: description.neutralPosition.configInstructions,
      images: description.neutralPosition.images,
      maxValue: description.maxValue,
      minValue: description.minValue,
      prop: "neutralPositionValue",
      title: "Neutral position",
    },
    {
      configInstructions: description.minPosition.configInstructions,
      images: description.minPosition.images,
      maxValue: neutralPositionValue,
      minValue: description.minValue,
      prop: "minPositionValue",
      title: "Minimum position",
    },
    {
      configInstructions: description.maxPosition.configInstructions,
      images: description.maxPosition.images,
      maxValue: description.maxValue,
      minValue: neutralPositionValue,
      prop: "maxPositionValue",
      title: "Maximum position",
    },
  ];
};
