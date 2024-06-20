import { makeAutoObservable } from "mobx";

import { UNSAVED_CHANGES_MODAL } from "constants/modals";

class UiMotorsConfigurationStore {
  uiStore;
  options = [];
  selectedOption = null;
  saveDisabledReason = null;
  saveConfiguration = () => {};
  fullscreen = false;
  enableTorque = false;
  unsavedModalConfig = { show: false };
  dirtyForm = false;

  constructor(parent) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.uiStore = parent;
  }

  get motorsConfigurationStore() {
    return this.uiStore.rootStore.motorsConfigurationStore;
  }

  setOptions(options) {
    this.options = options;
  }

  getOptions() {
    return this.options;
  }

  setSelectedOption(option) {
    this.selectedOption = option;
  }

  getSelectedOption() {
    return this.selectedOption;
  }

  setSaveDisabledReason(saveDisabledReason) {
    this.saveDisabledReason = saveDisabledReason;
  }

  getSaveDisabledReason() {
    return this.saveDisabledReason;
  }

  setSaveConfiguration(callback) {
    this.saveConfiguration = callback || (() => {});
  }

  setFullscreen(fullscreen) {
    this.fullscreen = fullscreen;
  }

  getFullscreen() {
    return this.fullscreen;
  }

  setEnableTorque(enableTorque) {
    this.enableTorque = enableTorque;
  }

  getEnableTorque() {
    return this.enableTorque;
  }

  getUnsavedModalConfig() {
    return this.unsavedModalConfig;
  }

  setDirtyForm(dirtyForm) {
    this.dirtyForm = dirtyForm;
  }

  _resetUnsavedModalConfig() {
    this.unsavedModalConfig = { show: false };
  }

  confirmIfDirty = (onConfirm) => {
    if (this.dirtyForm) {
      this.unsavedModalConfig = {
        ...UNSAVED_CHANGES_MODAL,
        onCancel: this._resetUnsavedModalConfig,
        onConfirm: () => {
          onConfirm();
          this._resetUnsavedModalConfig();
        },
      };
    } else {
      onConfirm();
    }
  };

  _getCurrentMotorIndex() {
    return !this.options.length || !this.selectedOption
      ? -1
      : this.options.findIndex((m) => m.value === this.selectedOption.value);
  }

  changeMotor(step) {
    const currentIndex = this._getCurrentMotorIndex();

    if (
      currentIndex === -1 ||
      currentIndex + step < 0 ||
      currentIndex + step >= this.options.length
    ) {
      return;
    }

    this.selectedOption = this.options[currentIndex + step];
  }

  prevMotor() {
    this.changeMotor(-1);
  }

  nextMotor() {
    this.changeMotor(1);
  }

  prevDisabled() {
    const currentIndex = this._getCurrentMotorIndex();
    return currentIndex === -1 || currentIndex === 0;
  }

  nextDisabled() {
    const currentIndex = this._getCurrentMotorIndex();
    return currentIndex === -1 || currentIndex === this.options.length - 1;
  }
}

export default UiMotorsConfigurationStore;
