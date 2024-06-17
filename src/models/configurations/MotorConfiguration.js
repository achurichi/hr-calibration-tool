class MotorConfiguration {
  motorId;
  motorName;
  neutralPositionValue;
  minPositionValue;
  maxPositionValue;

  constructor(data) {
    this.motorId = data.motorId;
    this.motorName = data.motorName;
    this.neutralPositionValue = data.neutralPositionValue;
    this.minPositionValue = data.minPositionValue;
    this.maxPositionValue = data.maxPositionValue;
  }
}

export default MotorConfiguration;
