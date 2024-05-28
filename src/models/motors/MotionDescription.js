class MotionDescription {
  id;
  name;
  description;
  defaultValue;
  minValue;
  maxValue;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.defaultValue = data.defaultValue;
    this.minValue = data.minValue;
    this.maxValue = data.maxValue;
  }
}

export default MotionDescription;
