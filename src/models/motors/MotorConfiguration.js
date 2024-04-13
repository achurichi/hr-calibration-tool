import Position from "./Position";

class MotorConfiguration {
  id;
  motorId;
  robotId;
  neutralPosition;
  minPosition;
  maxPosition;

  constructor(data) {
    this.id = data._id;
    this.motorId = data.motorId;
    this.robotId = data.robotId;
    this.neutralPosition = new Position(data.neutralPosition);
    this.minPosition = new Position(data.minPosition);
    this.maxPosition = new Position(data.maxPosition);
  }
}

export default MotorConfiguration;
