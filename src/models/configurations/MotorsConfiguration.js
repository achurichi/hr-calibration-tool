import MotorConfiguration from "./MotorConfiguration";

class MotorsConfiguration {
  descriptionName;
  assembly;
  bodyName;
  motors;

  constructor(data) {
    this.descriptionName = data.descriptionName;
    this.assembly = data.assembly;
    this.bodyName = data.bodyName;
    this.motors = data.motors?.map((m) => new MotorConfiguration(m)) || [];
  }
}

export default MotorsConfiguration;
