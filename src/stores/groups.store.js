import { makeAutoObservable } from "mobx";

import { FUNCTIONS } from "constants/mongo";

import Group from "models/groups/Group";

class GroupsStore {
  rootStore;
  groups = [];

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  setGroups(groups) {
    this.groups = groups;
  }

  getGroups() {
    return this.groups;
  }

  async fetchGroups() {
    let groupsData = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.GROUPS.GET_ALL,
    );
    if (!groupsData) {
      groupsData = [];
    }
    const groups = groupsData.map((groupData) => new Group(groupData));
    this.setGroups(groups);
    return groups;
  }
}

export default GroupsStore;
