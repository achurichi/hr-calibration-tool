import { makeAutoObservable } from "mobx";

import { FUNCTIONS } from "constants/mongo";
import {
  DESCRIPTION_TYPES,
  DESCRIPTION_TYPES_MAP,
} from "constants/descriptions";

import AnimationsDescription from "models/motors/AnimationsDescription";
import MotorsDescription from "models/motors/MotorsDescription";

class DescriptionStore {
  rootStore;
  descriptions = {
    motors: null,
    animations: null,
  };

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  clear() {
    this.descriptions.motors = null;
    this.descriptions.animations = null;
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
    return description?.[descriptionType] || []; // these are the items in the description
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
    return this._saveDescription(type, data);
  }

  async saveItem(type, modelName, item) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS[`${type.toUpperCase()}_DESCRIPTIONS`].SAVE_ITEM,
      modelName,
      item,
    );
    return this._saveDescription(type, data);
  }

  async deleteItem(type, modelName, item) {
    const data = await this.rootStore.realmStore.callFunction(
      FUNCTIONS[`${type.toUpperCase()}_DESCRIPTIONS`].DELETE_ITEM,
      modelName,
      item,
    );
    return this._saveDescription(type, data);
  }

  _saveDescription(type, data) {
    const DescriptionClass =
      type === DESCRIPTION_TYPES.MOTORS
        ? MotorsDescription
        : AnimationsDescription;
    const description = data ? new DescriptionClass(data) : null;
    this.setDescription(type, description);
    return description;
  }
}

export default DescriptionStore;
