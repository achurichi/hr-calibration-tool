import { makeAutoObservable } from "mobx";
import isEqual from "lodash/isEqual";

import {
  DESCRIPTION_ITEMS_OPTIONS,
  NEW_ITEM_OPTION,
} from "@/constants/descriptions";

class UiDescriptionStore {
  uiStore;
  selectedDescriptionOption = null;
  selectedItemTypeOption = DESCRIPTION_ITEMS_OPTIONS[0];
  selectedItemOption = null;
  isNewItem = false;
  editDisabled = true;

  constructor(parent) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.uiStore = parent;
  }

  clear() {
    this.selectedDescriptionOption = null;
    this.selectedItemTypeOption = DESCRIPTION_ITEMS_OPTIONS[0];
    this.selectedItemOption = null;
    this.isNewItem = false;
    this.editDisabled = true;
  }

  get descriptionStore() {
    return this.uiStore.rootStore.descriptionStore;
  }

  /* Selected description */

  setSelectedDescriptionOption(option) {
    this.selectedDescriptionOption = option;
  }

  getSelectedDescriptionOption() {
    return this.selectedDescriptionOption;
  }

  getSelectedDescription() {
    return this.selectedDescriptionOption?.value || null;
  }

  /* Selected item type */

  setSelectedItemTypeOption(option) {
    this.selectedItemTypeOption = option;
    this.setSelectedItemOption(null);
  }

  getSelectedItemTypeOption() {
    return this.selectedItemTypeOption;
  }

  getSelectedItemType() {
    return this.selectedItemTypeOption?.value || null;
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
    return this.descriptionStore.getDescriptionItems(
      this.getSelectedItemType(),
      this.getSelectedDescription(),
    );
  }

  /* Selected item */

  setSelectedItemOption(item) {
    // If the there new form in unselected remove it from the list
    if (this.isNewItem && item?.value !== NEW_ITEM_OPTION.value) {
      this.setIsNewItem(false);
    }
    this.selectedItemOption = item || null;
  }

  setSelectedItemOptionById(id) {
    this._setSelectedItemOptionByProp("id", id);
  }

  setSelectedItemOptionByName(name) {
    this._setSelectedItemOptionByProp("name", name);
  }

  _setSelectedItemOptionByProp(prop, propValue) {
    // Get the description items
    const items = this.getDescriptionItems();
    if (!items.length) {
      this.setSelectedItemOption(null);
      return;
    }

    // Find the item in the array of items based on the prop value
    const item = items.find((item) => item[prop] === propValue);
    if (!item) {
      this.setSelectedItemOption(null);
      return;
    }

    // Find the corresponding option based on item id
    const option =
      this.getItemOptions().find((option) => option.value === item.id) || null;
    this.setSelectedItemOption(option);
  }

  getSelectedItemOption() {
    return this.selectedItemOption;
  }

  getSelectedItem() {
    return this.selectedItemOption?.value || null;
  }

  /* New Item */

  setIsNewItem(isNewItem) {
    this.isNewItem = isNewItem;
    if (isNewItem) {
      this.setSelectedItemOption(NEW_ITEM_OPTION);
    } else if (
      !isNewItem &&
      isEqual(this.selectedItemOption, NEW_ITEM_OPTION)
    ) {
      this.setSelectedItemOption(null);
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
