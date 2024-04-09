import { makeAutoObservable } from "mobx";

import { MONGO_COLLECTIONS } from "constants/collections";

class MotorsStore {
  rootStore;
  motors = null;

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  getCollection() {
    return this.rootStore.realmStore
      .getMongoDB()
      .collection(MONGO_COLLECTIONS.motors);
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

  async fetchMotors() {
    const motors = await this.getCollection().find();
    this.setMotors(motors);
    return motors;
  }
}

export default MotorsStore;
