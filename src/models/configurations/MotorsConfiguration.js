import MotorConfiguration from "./MotorConfiguration";

class MotorsConfiguration {
  modelName;
  robotName;
  bodyName;
  motors;

  constructor(data) {
    this.modelName = data.modelName;
    this.robotName = data.robotName;
    this.bodyName = data.bodyName;
    this.motors = data.motors?.map((m) => new MotorConfiguration(m)) || [];
  }
}

export default MotorsConfiguration;
