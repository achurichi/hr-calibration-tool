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
  descriptionNames = [];
  descriptions = {
    motors: null,
    animations: null,
  };
  // descriptions = {
  //   motors: new Map(),
  //   animations: new Map(),
  // };
  referenceImages = new Map();

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  clear() {
    this.descriptionNames = [];
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

  getDescriptionNames() {
    return this.descriptionNames;
  }

  _setDescriptionNames(descriptionNames) {
    this.descriptionNames = descriptionNames;
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

  async fetchDescriptionNames() {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS.DESCRIPTIONS.GET_DESCRIPTIONS_NAMES,
    );
    if (data) {
      this._setDescriptionNames(data);
    }
    return this.descriptionNames;
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
    if (description?.name && description.name === descriptionName) {
      return description;
    }
    // using this method to avoid clearing images if the description name (motors or animations) didn't change
    if (this.getDescriptionName() !== descriptionName) {
      this.referenceImages.clear();
    }
    return await this.fetchDescription(type, descriptionName);
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
