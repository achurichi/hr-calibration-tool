import { makeAutoObservable } from "mobx";
import isEqual from "lodash/isEqual";

import { CONFIGURATION_OPTIONS, NEW_ITEM_OPTION } from "constants/descriptions";

class UiDescriptionStore {
  uiStore;
  selectedConfiguration = CONFIGURATION_OPTIONS[0];
  selectedItem = null;
  isNewItem = false;
  editDisabled = false;

  constructor(parent) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.uiStore = parent;
  }

  clear() {
    this.selectedConfiguration = CONFIGURATION_OPTIONS[0];
    this.selectedItem = null;
    this.isNewItem = false;
    this.editDisabled = false;
  }

  get descriptionStore() {
    return this.uiStore.rootStore.descriptionStore;
  }

  /* Configuration options */

  getConfigurationOptions() {
    return CONFIGURATION_OPTIONS;
  }

  /* Selected configuration */

  setSelectedConfiguration(configuration) {
    this.selectedConfiguration = configuration;
    this.setSelectedItem(null);
  }

  getSelectedConfiguration() {
    return this.selectedConfiguration;
  }

  _getSelectedConfigurationType() {
    return this.selectedConfiguration?.value || null;
  }

  /* Item options */

  getItemOptions() {
    const options = [];
    if (this.isNewItem) {
      options.push(NEW_ITEM_OPTION);
    }

    const items = this.getDescriptionItems();
    items.forEach((item) => {
      options.push({
        value: item.id,
        label: item.name,
      });
    });

    return options;
  }

  getDescriptionItems() {
    const configurationType = this.selectedConfiguration?.value;
    return this.descriptionStore.getDescriptionItems(configurationType);
  }

  /* Selected item */

  setSelectedItem(item) {
    // If the there new form in unselected remove it from the list
    if (this.isNewItem && item?.value !== NEW_ITEM_OPTION.value) {
      this.setIsNewItem(false);
    }
    this.selectedItem = item || null;
  }

  setSelectedItemById(id) {
    this._setSelectedItemByProp("id", id);
  }

  setSelectedItemByName(name) {
    this._setSelectedItemByProp("name", name);
  }

  _setSelectedItemByProp(prop, propValue) {
    // Get the description items
    const items = this.getDescriptionItems();
    if (!items.length) {
      this.setSelectedItem(null);
      return;
    }

    // Find the item in the array of items based on the prop value
    const item = items.find((item) => item[prop] === propValue);
    if (!item) {
      this.setSelectedItem(null);
      return;
    }

    // Find the corresponding option based on item id
    const option =
      this.getItemOptions().find((option) => option.value === item.id) || null;
    this.setSelectedItem(option);
  }

  getSelectedItem() {
    return this.selectedItem;
  }

  /* New Item */

  setIsNewItem(isNewItem) {
    this.isNewItem = isNewItem;
    if (isNewItem) {
      this.setSelectedItem(NEW_ITEM_OPTION);
    } else if (!isNewItem && isEqual(this.selectedItem, NEW_ITEM_OPTION)) {
      this.setSelectedItem(null);
    }
  }

  getIsNewItem() {
    return this.isNewItem;
  }

  /* Edit disabled */

  setEditDisabled(editDisabled) {
    this.editDisabled = editDisabled;
  }

  getEditDisabled() {
    return this.editDisabled;
  }
}

export default UiDescriptionStore;
