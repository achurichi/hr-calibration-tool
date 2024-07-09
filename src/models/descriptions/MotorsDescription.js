import MotorDescription from "./MotorDescription";

class MotorsDescription {
  name;
  motors;

  constructor(data) {
    this.name = data.name;
    this.motors = data.motors?.map((m) => new MotorDescription(m)) || [];
  }
}

export default MotorsDescription;
