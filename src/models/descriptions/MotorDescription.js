import AdvancedMapping from "../AdvancedMapping";
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
  defaultShow;

  // advanced
  sort_no;
  motor_id;
  hardware;
  transmission;
  speed;
  acceleration;
  torque;
  topic;
  mapping;

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
    this.defaultShow = data.defaultShow;

    // advanced
    this.sort_no = data.sort_no;
    this.motor_id = data.motor_id;
    this.hardware = data.hardware;
    this.transmission = data.transmission;
    this.speed = data.speed;
    this.acceleration = data.acceleration;
    this.torque = data.torque;
    this.topic = data.topic;
    this.mapping = new AdvancedMapping(data.mapping || {});
  }
}

export default MotorDescription;
