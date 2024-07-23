import AdvancedMapping from "../AdvancedMapping";

class MotorConfiguration {
  descId;
  motorName;
  neutralPositionValue;
  minPositionValue;
  maxPositionValue;

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
    this.descId = data.descId;
    this.motorName = data.motorName;
    this.neutralPositionValue = data.neutralPositionValue;
    this.minPositionValue = data.minPositionValue;
    this.maxPositionValue = data.maxPositionValue;

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

export default MotorConfiguration;
