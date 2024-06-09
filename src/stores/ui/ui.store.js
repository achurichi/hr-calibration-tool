import { makeAutoObservable } from "mobx";
import UiDescriptionStore from "stores/ui/uiDescription.store";
import MotorConfigurationStore from "stores/ui/motorConfiguration.store";

class UiStore {
  rootStore;
  motorConfigurationStore;

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.rootStore = root;
    this.uiDescriptionStore = new UiDescriptionStore(this);
    this.motorConfigurationStore = new MotorConfigurationStore(this);
  }
}

export default UiStore;
