import { makeAutoObservable } from "mobx";

import { FUNCTIONS } from "constants/mongo";

class MotorsStore {
  rootStore;
  motors = null;

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  setMotors(motors) {
    this.motors = motors;
  }

  getMotors() {
    if (this.motors) {
      return this.motors;
    }
    return this.fetchMotors();
  }

  async fetchMotors(groupId, searchString) {
    const motors = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.MOTORS.GET_ALL,
      groupId,
      searchString,
    );
    if (motors) {
      this.setMotors(motors);
    }
    return motors;
  }
}

export default MotorsStore;
