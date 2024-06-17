import { makeAutoObservable } from "mobx";
import DescriptionStore from "stores/description.store";
import FiltersStore from "stores/filters.store";
import MotorsConfigurationStore from "stores/motorsConfiguration.store";
import MotorsStore from "stores/motors.store";
import RealmStore from "stores/realm.store";
import StatusStore from "stores/status.store";
import UiStore from "stores/ui/ui.store";

class RootStore {
  static instance;
  filtersStore;
  motorsConfigurationStore;
  motorsStore;
  realmStore;
  statusStore;
  uiStore;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    this.descriptionStore = new DescriptionStore(this);
    this.filtersStore = new FiltersStore(this);
    this.motorsConfigurationStore = new MotorsConfigurationStore(this);
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
