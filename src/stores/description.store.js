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

  /* Description methods */

  getDescription(type) {
    return this.descriptions[type];
  }

  getDescriptionName() {
    // if both motors and animations are present, then name should be the same
    return this.descriptions.motors?.name || this.descriptions.animations?.name;
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

  async fetchDescriptionsNames() {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.DESCRIPTIONS.GET_DESCRIPTIONS_NAMES,
    );
    return data || [];
  }

  async createDescriptions(name) {
    await this.rootStore.realmStore.callFunction(
      FUNCTIONS.DESCRIPTIONS.CREATE,
      name,
    );
  }

  async deleteDescriptions(name) {
    await this.rootStore.realmStore.callFunction(
      FUNCTIONS.DESCRIPTIONS.DELETE_BY_NAME,
      name,
    );
  }

  async getOrFetchDescription(type, descriptionName) {
    const description = this.descriptions[type];
    return description || (await this.fetchDescription(type, descriptionName));
  }

  async fetchDescription(type, descriptionName) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS[`${type.toUpperCase()}_DESCRIPTION`].GET_BY_NAME,
      descriptionName,
    );
    this._saveDescription(type, data);
    return this.descriptions[type];
  }

  async saveItem(type, descriptionName, item) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS[`${type.toUpperCase()}_DESCRIPTION`].SAVE_ITEM,
      descriptionName,
      item,
    );
    this._saveDescription(type, data);
  }

  async deleteItem(type, descriptionName, item) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS[`${type.toUpperCase()}_DESCRIPTION`].DELETE_ITEM,
      descriptionName,
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
    this.descriptions[type] = new DescriptionClass(data);
  }

  /* Image methods */

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
