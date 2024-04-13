import { makeAutoObservable } from "mobx";
import isEmpty from "lodash/isEmpty";

import { FUNCTIONS } from "constants/mongo";

import Motor from "models/motors/Motor";

class MotorsStore {
  rootStore;
  motors = [];

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  setMotors(motors) {
    this.motors = motors;
  }

  async getMotors() {
    if (!isEmpty(this.motors)) {
      return this.motors;
    }
    return this.fetchMotors();
  }

  async fetchMotors(groupId, searchString) {
    let motorsData = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.MOTORS.GET_ALL,
      groupId,
      searchString,
    );
    if (!motorsData) {
      motorsData = [];
    }
    const motors = motorsData.map((motorData) => new Motor(motorData));
    this.setMotors(motors);
    return motors;
  }
}

export default MotorsStore;
