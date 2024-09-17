import { makeAutoObservable } from "mobx";

import { FUNCTIONS } from "constants/mongo";

const DEFAULT_CONFIGURATION = {
  head: { assembly: null, descriptionName: null },
  body: { assembly: null, descriptionName: null },
};

class RobotStore {
  rootStore;
  configuration = DEFAULT_CONFIGURATION;

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  clear() {
    this.configuration = DEFAULT_CONFIGURATION;
  }

  getAssemblyIds(filterEmpty = true) {
    const assemblyIds = [
      this.configuration.head.assembly,
      this.configuration.body.assembly,
    ];
    return filterEmpty ? assemblyIds.filter(Boolean) : assemblyIds;
  }

  getDescriptionNames(filterEmpty = true) {
    const descriptionNames = [
      this.configuration.head.descriptionName,
      this.configuration.body.descriptionName,
    ];
    return filterEmpty ? descriptionNames.filter(Boolean) : descriptionNames;
  }

  getAssemblyEntries(filterEmpty = true) {
    const entries = Object.values(this.configuration).map((config) => [
      config.assembly,
      config.descriptionName,
    ]);
    return filterEmpty ? entries.filter(([a, d]) => a && d) : entries;
  }

  getAssembliesWithoutDescription() {
    return this.getAssemblyEntries(false)
      .filter(([assembly, descriptionName]) => assembly && !descriptionName)
      .map(([assembly, _]) => assembly);
  }

  checkMissingConfigurations() {
    return !!this.getAssembliesWithoutDescription().length;
  }

  getAssemblyByDescriptionName(descriptionName) {
    if (!descriptionName) {
      return undefined;
    }

    const config = Object.values(this.configuration).find(
      (c) => c.descriptionName === descriptionName,
    );
    return config?.assembly;
  }

  _setConfiguration(assemblies, descriptionNamesMap) {
    this.configuration.head = {
      assembly: assemblies.head || null,
      descriptionName: descriptionNamesMap?.[assemblies.head] || null,
    };
    this.configuration.body = {
      assembly: assemblies.body || null,
      descriptionName: descriptionNamesMap?.[assemblies.body] || null,
    };
  }

  async fetchDescriptionNamesByAssembly(assemblies) {
    if (!assemblies) {
      // if assemblies are not provided, try to use the current configuration
      assemblies = {
        head: this.configuration.head.assembly,
        body: this.configuration.body.assembly,
      };
    }

    const assemblyIds = Object.values(assemblies);

    // if there are no assemblies, return
    if (assemblyIds.every((value) => !value)) {
      return;
    }

    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.DESCRIPTIONS.GET_DESCRIPTION_NAMES_BY_ASSEMBLY,
      assemblyIds,
    );

    this._setConfiguration(assemblies, data);
  }
}

export default RobotStore;
