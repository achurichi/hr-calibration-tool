import { makeAutoObservable } from "mobx";
import ConfigurationStore from "stores/configuration.store";
import DescriptionStore from "stores/description.store";
import FiltersStore from "stores/filters.store";
import RealmStore from "stores/realm.store";
import RobotStore from "stores/robot.store";
import RosStore from "stores/ros.store";
import StatusStore from "stores/status.store";
import UiStore from "stores/ui/ui.store";

class RootStore {
  static instance;
  configurationStore;
  filtersStore;
  realmStore;
  robotStore;
  rosStore;
  statusStore;
  uiStore;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    this.configurationStore = new ConfigurationStore(this);
    this.descriptionStore = new DescriptionStore(this);
    this.filtersStore = new FiltersStore(this);
    this.realmStore = new RealmStore(this);
    this.robotStore = new RobotStore(this);
    this.rosStore = new RosStore(this);
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
