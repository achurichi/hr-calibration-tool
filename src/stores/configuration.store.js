import { makeAutoObservable } from "mobx";

import { DESCRIPTION_TYPES } from "constants/descriptions";
import { FUNCTIONS } from "constants/mongo";

import AnimationsConfiguration from "models/configurations/AnimationsConfiguration";
import MotorsConfiguration from "models/configurations/MotorsConfiguration";

class ConfigurationStore {
  rootStore;
  configurations = new Map();

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  clear() {
    this.configurations.clear();
  }

  getConfigurationKeys() {
    return Array.from(this.configurations.keys());
  }

  getItem(id) {
    for (const configuration of this.configurations.values()) {
      let item;

      if (configuration instanceof MotorsConfiguration) {
        item = configuration.motors?.find((m) => m.motorId === id);
      } else if (configuration instanceof AnimationsConfiguration) {
        item = configuration.animations?.find((a) => a.animationId === id);
      }

      if (item) {
        return item;
      }
    }

    return undefined;
  }

  async fetchConfiguration(descriptionType, descriptionName, assembly) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS[`${descriptionType.toUpperCase()}_CONFIGURATION`]
        .GET_BY_DESCRIPTION_AND_ASSEMBLY,
      descriptionName,
      assembly,
    );
    return this._saveConfiguration(descriptionType, data);
  }

  async fetchAssemblyConfigurations(descriptionType) {
    const assemblyEntries = this.rootStore.robotStore.getAssemblyEntries();
    assemblyEntries.forEach(([assembly, descriptionName]) => {
      this.fetchConfiguration(descriptionType, descriptionName, assembly);
    });
  }

  async saveItem(
    descriptionType,
    descriptionName,
    assembly,
    itemConfiguration,
  ) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS[`${descriptionType.toUpperCase()}_CONFIGURATION`].SAVE_ITEM,
      descriptionName,
      assembly,
      itemConfiguration,
    );
    return this._saveConfiguration(descriptionType, data);
  }

  async createConfigurations(configurationDescriptionMap) {
    await this.rootStore.realmStore.callFunction(
      FUNCTIONS.CONFIGURATIONS.CREATE_MANY,
      configurationDescriptionMap,
    );
  }

  _saveConfiguration(descriptionType, data) {
    if (!descriptionType || !data) {
      return null;
    }

    const configuration =
      descriptionType === DESCRIPTION_TYPES.MOTORS
        ? new MotorsConfiguration(data)
        : new AnimationsConfiguration(data);
    this.configurations.set(configuration.descriptionName, configuration);
    return configuration;
  }
}

export default ConfigurationStore;
