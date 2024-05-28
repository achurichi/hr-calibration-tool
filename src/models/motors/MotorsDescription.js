import MotorDescription from "./MotorDescription";

class MotorsDescription {
  modelName;
  motors;

  constructor(data) {
    this.modelName = data.modelName;
    this.motors = data.motors?.map((m) => new MotorDescription(m)) || [];
  }
}

export default MotorsDescription;
