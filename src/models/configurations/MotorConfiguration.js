import Advanced from "../Advanced";

class MotorConfiguration {
  motorId;
  motorName;
  neutralPositionValue;
  minPositionValue;
  maxPositionValue;
  advanced;

  constructor(data) {
    this.motorId = data.motorId;
    this.motorName = data.motorName;
    this.neutralPositionValue = data.neutralPositionValue;
    this.minPositionValue = data.minPositionValue;
    this.maxPositionValue = data.maxPositionValue;
    this.advanced = new Advanced(data.advanced || {});
  }
}

export default MotorConfiguration;
