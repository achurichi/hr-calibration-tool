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
    motors: new Map(),
    animations: new Map(),
  };
  referenceImages = new Map();

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  clear() {
    this.descriptionNames = [];
    this.descriptions.motors.clear();
    this.descriptions.animations.clear();
    this.clearImages();
  }

  clearImages() {
    this.referenceImages.clear();
  }

  /* Description methods */

  getDescription(type, name) {
    return this.descriptions[type]?.get(name);
  }

  getDescriptionNames() {
    return this.descriptionNames;
  }

  _setDescriptionNames(descriptionNames) {
    this.descriptionNames = descriptionNames;
  }

  getDescriptionItems(itemType, descriptionName) {
    const descriptionType = DESCRIPTION_TYPES_MAP[itemType];
    const description = this.getDescription(descriptionType, descriptionName);
    // inside the description object, there is a property with the same name as the description type (motors or animations) that contains the items
    const items = description?.[descriptionType] || [];
    return itemType === DESCRIPTION_ITEM_TYPES.MOTOR
      ? items
      : items.filter((i) => i.type === itemType); // filter expressions or visemes
  }

  getAssemblyDescriptionItems(itemType) {
    const items = [];
    this.rootStore.robotStore.getDescriptionNames().forEach((name) => {
      items.push(...this.getDescriptionItems(itemType, name));
    });
    return items;
  }

  getItemById(id, itemType) {
    for (const descriptionName of this.descriptionNames) {
      const items = this.getDescriptionItems(itemType, descriptionName);
      const item = items.find((i) => i.id === id);
      if (item) {
        return item;
      }
    }
    return undefined;
  }

  getDescriptionNameByItemId(id, descriptionType) {
    const descriptions = this.descriptions[descriptionType];
    for (const descriptionName of descriptions.keys()) {
      const items = descriptions.get(descriptionName)[descriptionType];
      const item = items.find((i) => i.id === id);
      if (item) {
        return descriptionName;
      }
    }
    return undefined;
  }

  async fetchDescriptionNames() {
    const data =
      await this.rootStore.api.calibrationTool.descriptions.getAllDescriptionNames();
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

  async fetchDescription(type, descriptionName) {
    const data =
      await this.rootStore.api.calibrationTool.descriptions[type].getByName(
        descriptionName,
      );
    this._saveDescription(type, data);
    return this.getDescription(type, descriptionName);
  }

  async getOrFetchDescription(type, descriptionName) {
    const description = this.getDescription(type, descriptionName);
    return description || (await this.fetchDescription(type, descriptionName));
  }

  async getOrFetchAssemblyDescriptions(type) {
    const descriptionsPromises = this.rootStore.robotStore
      .getDescriptionNames()
      .map((name) => this.getOrFetchDescription(type, name));
    return await Promise.all(descriptionsPromises);
  }

  async saveItem(type, descriptionName, item) {
    const data = await this.rootStore.api.calibrationTool.descriptions[
      type
    ].saveItem(descriptionName, item);
    this._saveDescription(type, data);
  }

  async deleteItem(type, descriptionName, itemId) {
    const data = await this.rootStore.api.calibrationTool.descriptions[
      type
    ].deleteItem(descriptionName, itemId);
    this._saveDescription(type, data);
  }

  _saveDescription(type, data) {
    if (!data) {
      return;
    }

    const DescriptionsClass =
      type === DESCRIPTION_TYPES.MOTORS
        ? MotorsDescription
        : AnimationsDescription;
    this.descriptions[type].set(data.name, new DescriptionsClass(data));
  }

  /* Image methods */

  getImage(id) {
    this.referenceImages.get(id);
  }

  setLoadingImage(id) {
    this.referenceImages.set(id, {
      base64: null,
      status: STATUS_TYPES.IN_PROGRESS,
    });
  }

  fetchImageIfNotPresent(id) {
    if (!this.referenceImages.has(id)) {
      this.setLoadingImage(id);
      this.fetchImage(id);
    }
  }

  async fetchImage(id) {
    const data = await this.rootStore.api.calibrationTool.images.getById(id);
    this._saveImage(data);
  }

  async saveImage(base64) {
    const data = await this.rootStore.api.calibrationTool.images.save(base64);
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
