import { makeAutoObservable } from "mobx";

import { FUNCTIONS } from "constants/mongo";

import MotorConfiguration from "models/motors/MotorConfiguration";

class MotorConfigurationStore {
  rootStore;
  motorConfig = null;

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  setMotorConfig(motorConfig) {
    this.motorConfig = motorConfig;
  }

  getMotorConfig() {
    return this.motorConfig;
  }

  async fetchMotor(id) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.MOTOR_CONFIGURATIONS.GET_BY_MOTOR_ID,
      id,
    );
    const motorConfig = data ? new MotorConfiguration(data) : null;
    this.setMotorConfig(motorConfig);
    return motorConfig;
  }
}

export default MotorConfigurationStore;
