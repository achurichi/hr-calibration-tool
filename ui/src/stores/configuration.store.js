import { makeAutoObservable } from "mobx";

import { DESCRIPTION_TYPES } from "constants/descriptions";

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
      const items =
        configuration instanceof MotorsConfiguration
          ? configuration.motors
          : configuration.animations;
      const item = items?.find((i) => i.descId === id);
      if (item) {
        return item;
      }
    }

    return undefined;
  }

  getAllIds() {
    const ids = [];

    for (const configuration of this.configurations.values()) {
      const items =
        configuration instanceof MotorsConfiguration
          ? configuration.motors
          : configuration.animations;
      items?.forEach((i) => ids.push(i.descId));
    }

    return ids;
  }

  getNameKey(descriptionType) {
    return descriptionType === DESCRIPTION_TYPES.MOTORS
      ? "motorName"
      : "animationName";
  }

  async fetchConfiguration(descriptionType, descriptionName, assembly) {
    const data = await this.rootStore.api.calibrationTool.configurations[
      descriptionType
    ].getByDescriptionAndAssembly(descriptionName, assembly);
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

  getAssemblyConfigurations() {
    const assemblyEntries = this.rootStore.robotStore.getAssemblyEntries();
    const configurations = [];
    assemblyEntries.forEach(([, descriptionName]) => {
      const configuration = this.configurations.get(descriptionName);
      if (configuration) {
        configurations.push(configuration);
      }
    });
    return configurations;
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
    const data = await this.rootStore.api.calibrationTool.configurations[
      descriptionType
    ].saveItem(descriptionName, assembly, itemConfiguration);
    return this._saveConfiguration(descriptionType, data);
  }

  async addMotors(motorsMap) {
    await this.rootStore.api.calibrationTool.configurations.motors.addItems(
      motorsMap,
    );
  }

  async deleteMotor(assembly, motorId) {
    const data =
      await this.rootStore.api.calibrationTool.configurations.motors.deleteItem(
        assembly,
        motorId,
      );
    return this._saveConfiguration(DESCRIPTION_TYPES.MOTORS, data);
  }

  async createConfigurations(configurationDescriptionMap) {
    await this.rootStore.api.calibrationTool.configurations.createMany(
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
