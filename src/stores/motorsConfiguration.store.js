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

  async fetchConfiguration(modelName) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.MOTORS_CONFIGURATION.GET_BY_MODEL_NAME,
      modelName,
    );
    this.configuration = data ? new MotorsConfiguration(data) : null;
    return this.configuration;
  }
}

export default MotorsConfigurationStore;
