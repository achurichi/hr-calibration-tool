import { makeAutoObservable } from "mobx";

import { FUNCTIONS } from "constants/mongo";
import {
  DESCRIPTION_ITEM_TYPES,
  DESCRIPTION_TYPES,
  DESCRIPTION_TYPES_MAP,
} from "constants/descriptions";
import { STATUS_TYPES } from "constants/status";

import AnimationsDescription from "models/descriptions/AnimationsDescription";
import MotorsDescription from "models/descriptions/MotorsDescription";

class DescriptionStore {
  rootStore;
  descriptions = {
    motors: null,
    animations: null,
  };
  referenceImages = new Map();

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  clear() {
    this.descriptions.motors = null;
    this.descriptions.animations = null;
    this.referenceImages.clear();
  }

  setDescription(type, description) {
    this.descriptions[type] = description;
  }

  getDescription(type) {
    return this.descriptions[type];
  }

  getDescriptionItems(itemType) {
    const descriptionType = DESCRIPTION_TYPES_MAP[itemType];
    const description = this.descriptions[descriptionType];
    const items = description?.[descriptionType] || []; // these are the items in the description
    return itemType === DESCRIPTION_ITEM_TYPES.MOTOR
      ? items
      : items.filter((i) => i.type === itemType);
  }

  getItemById(id, itemType) {
    const items = this.getDescriptionItems(itemType);
    return items.find((i) => i.id === id);
  }

  async fetchDescription(type, modelName) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS[`${type.toUpperCase()}_DESCRIPTIONS`].GET_BY_MODEL_NAME,
      modelName,
    );
    this._saveDescription(type, data);
  }

  async saveItem(type, modelName, item) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS[`${type.toUpperCase()}_DESCRIPTIONS`].SAVE_ITEM,
      modelName,
      item,
    );
    this._saveDescription(type, data);
  }

  async deleteItem(type, modelName, item) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS[`${type.toUpperCase()}_DESCRIPTIONS`].DELETE_ITEM,
      modelName,
      item,
    );
    this._saveDescription(type, data);
  }

  _saveDescription(type, data) {
    if (!data) {
      return;
    }

    const DescriptionClass =
      type === DESCRIPTION_TYPES.MOTORS
        ? MotorsDescription
        : AnimationsDescription;
    this.setDescription(type, new DescriptionClass(data));
  }

  getImage(id) {
    this.referenceImages.get(id);
  }

  setLoadingImage(id) {
    this.referenceImages.set(id, {
      base64: null,
      status: STATUS_TYPES.LOADING,
    });
  }

  fetchImageIfNotPresent(id) {
    if (!this.referenceImages.has(id)) {
      this.setLoadingImage(id);
      this.fetchImage(id);
    }
  }

  async fetchImage(id) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.IMAGES.GET_BY_ID,
      id,
    );
    this._saveImage(data);
  }

  async saveImage(base64) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.IMAGES.SAVE,
      base64,
    );
    return this._saveImage(data);
  }

  _saveImage(data) {
    if (!data) {
      return null;
    }

    this.referenceImages.set(data._id, {
      base64: data.base64 || null,
      status: data.base64 ? STATUS_TYPES.SUCCESS : STATUS_TYPES.ERROR,
    });
    return data._id;
  }
}

export default DescriptionStore;
