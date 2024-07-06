import Advanced from "../Advanced";
import PositionDescription from "./PositionDescription";

class MotorDescription {
  id;
  name;
  group;
  description;
  minValue;
  maxValue;
  neutralPosition;
  minPosition;
  maxPosition;
  advanced;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.group = data.group;
    this.description = data.description;
    this.minValue = data.minValue;
    this.maxValue = data.maxValue;
    this.neutralPosition = new PositionDescription(data.neutralPosition || {});
    this.minPosition = new PositionDescription(data.minPosition || {});
    this.maxPosition = new PositionDescription(data.maxPosition || {});
    this.advanced = new Advanced(data.advanced || {});
  }
}

export default MotorDescription;
