class PositionDescription {
  defaultValue;
  configInstructions;
  images;

  constructor(data) {
    this.defaultValue = data.defaultValue;
    this.configInstructions = data.configInstructions;
    this.images = data.images || [];
  }
}

export default PositionDescription;
