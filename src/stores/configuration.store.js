import { makeAutoObservable } from "mobx";

import { DESCRIPTION_TYPES } from "constants/descriptions";
import { FUNCTIONS } from "constants/mongo";

import AnimationsConfiguration from "models/configurations/AnimationsConfiguration";
import MotorsConfiguration from "models/configurations/MotorsConfiguration";

class ConfigurationStore {
  rootStore;
  configurations = new Map(); // only stores a map of MotorsConfiguration or AnimationsConfiguration instances, not both because the keys are the description names

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
        item = configuration.motors?.find((m) => m.descId === id);
      } else if (configuration instanceof AnimationsConfiguration) {
        item = configuration.animations?.find((a) => a.animationId === id);
      }

      if (item) {
        return item;
      }
    }

    return undefined;
  }

  getAllIds() {
    const ids = [];

    for (const configuration of this.configurations.values()) {
      if (configuration instanceof MotorsConfiguration) {
        configuration.motors.forEach((m) => ids.push(m.descId));
      } else if (configuration instanceof AnimationsConfiguration) {
        configuration.animations.forEach((a) => ids.push(a.animationId));
      }
    }

    return ids;
  }

  getNameProp(descriptionType) {
    return descriptionType === DESCRIPTION_TYPES.MOTORS
      ? "motorName"
      : "animationName";
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

  async getOrFetchConfiguration(descriptionType, descriptionName, assembly) {
    const configuration = this.configurations.get(descriptionName);
    return (
      configuration ||
      (await this.fetchConfiguration(
        descriptionType,
        descriptionName,
        assembly,
      ))
    );
  }

  async getOrFetchAssemblyConfigurations(descriptionType, forceFetch = false) {
    const assemblyEntries = this.rootStore.robotStore.getAssemblyEntries();
    const configurationPromises = assemblyEntries.map(
      ([assembly, descriptionName]) =>
        forceFetch
          ? this.fetchConfiguration(descriptionType, descriptionName, assembly)
          : this.getOrFetchConfiguration(
              descriptionType,
              descriptionName,
              assembly,
            ),
    );
    return await Promise.all(configurationPromises);
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

  async addMotors(motorsMap) {
    await this.rootStore.realmStore.callFunction(
      FUNCTIONS.MOTORS_CONFIGURATION.ADD_ITEMS,
      motorsMap,
    );
  }

  async deleteMotor(assembly, motorId) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.MOTORS_CONFIGURATION.DELETE_ITEM,
      assembly,
      motorId,
    );
    return this._saveConfiguration(DESCRIPTION_TYPES.MOTORS, data);
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
