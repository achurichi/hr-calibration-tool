import { makeAutoObservable } from "mobx";
import DescriptionStore from "stores/description.store";
import FiltersStore from "stores/filters.store";
import GroupsStore from "stores/groups.store";
import MotorConfigurationStore from "stores/motorConfiguration.store";
import MotorsStore from "stores/motors.store";
import RealmStore from "stores/realm.store";
import StatusStore from "stores/status.store";
import UiStore from "stores/ui/ui.store";

class RootStore {
  static instance;
  filtersStore;
  groupsStore;
  motorConfigurationStore;
  motorsStore;
  realmStore;
  statusStore;
  uiStore;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    this.descriptionStore = new DescriptionStore(this);
    this.filtersStore = new FiltersStore(this);
    this.groupsStore = new GroupsStore(this);
    this.motorConfigurationStore = new MotorConfigurationStore(this);
    this.motorsStore = new MotorsStore(this);
    this.realmStore = new RealmStore(this);
    this.statusStore = new StatusStore(this);
    this.uiStore = new UiStore(this);
  }

  static getInstance() {
    if (!RootStore.instance) {
      RootStore.instance = new RootStore();
    }

    return RootStore.instance;
  }
}

export default RootStore.getInstance();
