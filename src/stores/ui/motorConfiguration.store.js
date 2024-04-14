import { makeAutoObservable } from "mobx";

class MotorConfigurationStore {
  uiStore;

  constructor(parent) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.uiStore = parent;
  }

  getMotorOptions() {
    const motors = this.uiStore.rootStore.motorsStore.getMotors();
    return motors.map((motor) => ({
      name: motor.name,
      description: motor.description,
      id: motor.id,
    }));
  }

  changeMotor(step) {
    const motorConfig = this._getMotorConfig();
    const motorOptions = this.getMotorOptions();

    if (!motorConfig || !motorOptions.length) {
      return;
    }

    const currentIndex = motorOptions.findIndex(
      (motor) => motor.id === motorConfig.motorId,
    );
    const newIndex = currentIndex + step;

    if (newIndex < 0 || newIndex >= motorOptions.length) {
      return;
    }

    const newMotor = motorOptions[newIndex];
    this._getConfigDataStore().fetchMotor(newMotor.id);
  }

  nextMotor() {
    this.changeMotor(1);
  }

  prevMotor() {
    this.changeMotor(-1);
  }

  firstMotorSelected() {
    const motorConfig = this._getMotorConfig();
    const motorOptions = this.getMotorOptions();

    if (!motorConfig || !motorOptions.length) {
      return false;
    }

    return motorOptions[0].id === motorConfig.motorId;
  }

  lastMotorSelected() {
    const motorConfig = this._getMotorConfig();
    const motorOptions = this.getMotorOptions();

    if (!motorConfig || !motorOptions.length) {
      return false;
    }

    return motorOptions[motorOptions.length - 1].id === motorConfig.motorId;
  }

  _getConfigDataStore() {
    return this.uiStore.rootStore.motorConfigurationStore;
  }

  _getMotorConfig() {
    return this._getConfigDataStore().getMotorConfig();
  }
}

export default MotorConfigurationStore;
