import { makeAutoObservable } from "mobx";
import MotorConfigurationStore from "stores/ui/motorConfiguration.store";

class UiStore {
  rootStore;
  motorConfigurationStore;

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.rootStore = root;
    this.motorConfigurationStore = new MotorConfigurationStore(this);
  }
}

export default UiStore;
