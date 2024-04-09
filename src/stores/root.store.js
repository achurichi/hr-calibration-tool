import { makeAutoObservable } from "mobx";
import MotorsStore from "stores/motors.store";
import RealmStore from "stores/realm.store";

class RootStore {
  static instance;
  motorsStore;
  realmStore;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    this.motorsStore = new MotorsStore(this);
    this.realmStore = new RealmStore(this);
  }

  static getInstance() {
    if (!RootStore.instance) {
      RootStore.instance = new RootStore();
    }

    return RootStore.instance;
  }
}

export default RootStore.getInstance();
