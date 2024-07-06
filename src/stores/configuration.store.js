import { makeAutoObservable } from "mobx";

import { DESCRIPTION_TYPES } from "constants/descriptions";
import { FUNCTIONS } from "constants/mongo";

import AnimationsConfiguration from "models/configurations/AnimationsConfiguration";
import MotorsConfiguration from "models/configurations/MotorsConfiguration";

class ConfigurationStore {
  rootStore;
  configuration = null;
  type = null;

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  clear() {
    this.configuration = null;
    this.type = null;
  }

  getItem(id) {
    if (!this.type) {
      return undefined;
    }
    if (this.type === DESCRIPTION_TYPES.MOTORS) {
      return this.configuration?.motors?.find((m) => m.motorId === id);
    }
    return this.configuration?.animations?.find((a) => a.animationId === id);
  }

  async fetchConfiguration(type, modelName, robotName) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS[`${type.toUpperCase()}_CONFIGURATION`].GET_BY_MODEL_ROBOT_NAME,
      modelName,
      robotName,
    );
    return this._saveConfiguration(type, data);
  }

  async saveItem(modelName, robotName, itemConfiguration) {
    if (!this.type) {
      return null;
    }
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS[`${this.type.toUpperCase()}_CONFIGURATION`].SAVE_ITEM,
      modelName,
      robotName,
      itemConfiguration,
    );
    return this._saveConfiguration(this.type, data);
  }

  _saveConfiguration(type, data) {
    if (!type) {
      return null;
    }

    this.type = type;

    if (!data) {
      return null;
    }

    this.configuration =
      type === DESCRIPTION_TYPES.MOTORS
        ? new MotorsConfiguration(data)
        : new AnimationsConfiguration(data);
    this.type = type;
    return this.configuration;
  }
}

export default ConfigurationStore;
