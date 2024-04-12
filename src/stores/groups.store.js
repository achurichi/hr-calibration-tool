import { makeAutoObservable } from "mobx";

import { FUNCTIONS } from "constants/mongo";

class GroupsStore {
  rootStore;
  groups = null;

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  setGroups(groups) {
    this.groups = groups;
  }

  getGroups() {
    if (this.groups) {
      return this.groups;
    }
    return this.fetchGroups();
  }

  async fetchGroups() {
    const groups = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.GROUPS.GET_ALL,
    );
    if (groups) {
      this.setGroups(groups);
    }
    return groups;
  }
}

export default GroupsStore;
