import { makeAutoObservable } from "mobx";
import FiltersStore from "stores/filters.store";
import GroupsStore from "stores/groups.store";
import MotorsStore from "stores/motors.store";
import RealmStore from "stores/realm.store";

class RootStore {
  static instance;
  filtersStore;
  groupsStore;
  motorsStore;
  realmStore;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    this.filtersStore = new FiltersStore(this);
    this.groupsStore = new GroupsStore(this);
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
