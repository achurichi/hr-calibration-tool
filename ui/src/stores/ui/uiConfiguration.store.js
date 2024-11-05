import { makeAutoObservable } from 'mobx';

import { UNSAVED_CHANGES_MODAL } from '@/constants/modals';

class UiConfigurationStore {
  uiStore;
  options = [];
  selectedOption = null;
  saveDisabledReason = null;
  saveConfiguration = () => {};
  fullscreen = false;
  unsavedModalConfig = { show: false };
  dirtyForm = false;

  constructor(parent) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.uiStore = parent;
  }

  clear() {
    this.options = [];
    this.selectedOption = null;
    this.saveDisabledReason = null;
    this.saveConfiguration = () => {};
    this.fullscreen = false;
    this.unsavedModalConfig = { show: false };
    this.dirtyForm = false;
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

  getMotorIdForSelectedOption() {
    const descriptionId = this.getSelectedOption()?.value;
    if (!descriptionId) {
      return null;
    }
    return this.uiStore.rootStore.configurationStore.getItem(descriptionId)?.motor_id || null;
  }

  setEnableTorque(enableTorque) {
    const motorId = this.getMotorIdForSelectedOption();
    if (motorId) {
      this.uiStore.rootStore.rosStore.setEnableTorque(motorId, enableTorque);
    }
  }

  getEnableTorque() {
    const motorId = this.getMotorIdForSelectedOption();
    if (motorId) {
      return this.uiStore.rootStore.rosStore.getEnableTorque(motorId);
    }
    return false;
  }

  setPositionsForAnimation(animation) {
    const { rosStore } = this.uiStore.rootStore;

    // only set positions if preview on robot is true
    if (!rosStore.getPreviewOnRobot() || !animation?.animationName || !animation?.motions?.length) {
      return;
    }

    const { animationName, motions } = animation;
    motions.forEach((m) => {
      rosStore.setMotionPosition(animationName, m.motionName, m.value);
    });
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

  _getCurrentItemIndex() {
    return !this.options.length || !this.selectedOption
      ? -1
      : this.options.findIndex((m) => m.value === this.selectedOption.value);
  }

  _changeItem(step) {
    const currentIndex = this._getCurrentItemIndex();

    if (currentIndex === -1 || currentIndex + step < 0 || currentIndex + step >= this.options.length) {
      return;
    }

    this.selectedOption = this.options[currentIndex + step];
  }

  prevItem() {
    this._changeItem(-1);
  }

  nextItem() {
    this._changeItem(1);
  }

  prevDisabled() {
    const currentIndex = this._getCurrentItemIndex();
    return currentIndex === -1 || currentIndex === 0;
  }

  nextDisabled() {
    const currentIndex = this._getCurrentItemIndex();
    return currentIndex === -1 || currentIndex === this.options.length - 1;
  }

  checkSaveDisabled(isLoading, isDirty, isValid, nameChanged) {
    let reason = null;
    if (isLoading) {
      reason = 'Loading...';
    } else if (!nameChanged && !isDirty) {
      reason = 'Edit values to enable saving';
    } else if (!isValid) {
      reason = 'Some fields are invalid';
    }
    this.saveDisabledReason = reason;
  }
}

export default UiConfigurationStore;
