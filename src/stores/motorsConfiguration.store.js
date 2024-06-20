import { makeAutoObservable } from "mobx";

import { FUNCTIONS } from "constants/mongo";

import MotorsConfiguration from "models/configurations/MotorsConfiguration";

class MotorsConfigurationStore {
  rootStore;
  configuration = null;

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  getConfiguration() {
    return this.configuration;
  }

  getMotor(id) {
    return this.configuration?.motors?.find((m) => m.motorId === id);
  }

  async fetchConfiguration(modelName, robotName) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.MOTORS_CONFIGURATION.GET_BY_MODEL_ROBOT_NAME,
      modelName,
      robotName,
    );
    return this._saveConfiguration(data);
  }

  async saveMotor(modelName, robotName, configuration) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.MOTORS_CONFIGURATION.SAVE_MOTOR,
      modelName,
      robotName,
      configuration,
    );
    return this._saveConfiguration(data);
  }

  _saveConfiguration(data) {
    this.configuration = data ? new MotorsConfiguration(data) : null;
    return this.configuration;
  }
}

export default MotorsConfigurationStore;
