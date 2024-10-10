import { makeAutoObservable } from 'mobx';
import ConfigurationStore from '@/stores/configuration.store';
import DescriptionStore from '@/stores/description.store';
import FiltersStore from '@/stores/filters.store';
import RequestStore from '@/stores/request.store';
import RobotStore from '@/stores/robot.store';
import RosStore from '@/stores/ros.store';
import UiStore from '@/stores/ui/ui.store';
import RootApi from '@/apis/api';

class RootStore {
  static instance;

  configurationStore;
  filtersStore;
  requestStore;
  robotStore;
  rosStore;
  uiStore;

  api;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    this.configurationStore = new ConfigurationStore(this);
    this.descriptionStore = new DescriptionStore(this);
    this.filtersStore = new FiltersStore(this);
    this.requestStore = new RequestStore(this);
    this.robotStore = new RobotStore(this);
    this.rosStore = new RosStore(this);
    this.uiStore = new UiStore(this);

    this.api = new RootApi(this);
  }

  static getInstance() {
    if (!RootStore.instance) {
      RootStore.instance = new RootStore();
    }

    return RootStore.instance;
  }
}

export default RootStore.getInstance();
