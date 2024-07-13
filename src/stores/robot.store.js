import { makeAutoObservable } from "mobx";

import { FUNCTIONS } from "constants/mongo";

class RobotStore {
  rootStore;
  assemblyDescriptionNameMap = {};

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  clear() {
    this.assemblyDescriptionNameMap = {};
  }

  getAssemblyIds() {
    return Object.keys(this.assemblyDescriptionNameMap);
  }

  getDescriptionNames() {
    return Object.values(this.assemblyDescriptionNameMap);
  }

  getAssemblyByDescriptionName(descriptionName) {
    return Object.keys(this.assemblyDescriptionNameMap).find(
      (key) => this.assemblyDescriptionNameMap[key] === descriptionName,
    );
  }

  _setAssemblyDescriptionNameMap(map) {
    this.assemblyDescriptionNameMap = map;
  }

  async fetchDescriptionNamesByAssembly(assemblyIds) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.DESCRIPTIONS.GET_DESCRIPTION_NAMES_BY_ASSEMBLY,
      assemblyIds,
    );

    if (data) {
      this._setAssemblyDescriptionNameMap(data);
    }
  }
}

export default RobotStore;
