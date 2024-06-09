class PositionDescription {
  defaultValue;
  configDescription;
  images;

  constructor(data) {
    this.defaultValue = data.defaultValue;
    this.configDescription = data.configDescription;
    this.images = data.images || [];
  }
}

export default PositionDescription;
