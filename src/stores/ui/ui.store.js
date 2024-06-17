import { makeAutoObservable } from "mobx";
import UiDescriptionStore from "stores/ui/uiDescription.store";
import UiMotorsConfigurationStore from "stores/ui/uiMotorsConfiguration.store";

class UiStore {
  rootStore;
  uiMotorsConfigurationStore;

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.rootStore = root;
    this.uiDescriptionStore = new UiDescriptionStore(this);
    this.uiMotorsConfigurationStore = new UiMotorsConfigurationStore(this);
  }
}

export default UiStore;
