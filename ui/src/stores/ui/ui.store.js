import { makeAutoObservable } from 'mobx';
import UiDescriptionStore from '@/stores/ui/uiDescription.store';
import UiConfigurationStore from '@/stores/ui/uiConfiguration.store';

class UiStore {
  rootStore;
  uiConfigurationStore;

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.rootStore = root;
    this.uiDescriptionStore = new UiDescriptionStore(this);
    this.uiConfigurationStore = new UiConfigurationStore(this);
  }
}

export default UiStore;
