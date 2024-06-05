import React from "react";
import { observer } from "mobx-react";

import { BsTrash, BsPlusLg } from "react-icons/bs";
import Select from "react-select";

import rootStore from "stores/root.store";

import useCallWithNotification from "hooks/useCallWithNotification";

import { FUNCTIONS } from "constants/mongo";
import {
  DESCRIPTION_TYPES,
  DESCRIPTION_TYPES_MAP,
  MODEL_NAME,
} from "constants/descriptions";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";

import styles from "./ConfigurationBar.module.scss";

const ConfigurationBar = observer(() => {
  const { descriptionStore, uiStore } = rootStore;
  const callWithNotification = useCallWithNotification();
  const { uiDescriptionStore } = uiStore;
  const selectedConfiguration = uiDescriptionStore.getSelectedConfiguration();
  const editDisabled = uiDescriptionStore.getEditDisabled();

  const onAdd = () => {
    if (!uiDescriptionStore.getIsNewItem()) {
      uiDescriptionStore.setIsNewItem(true);
    }
  };

  const onDelete = async () => {
    const selectedItem = uiDescriptionStore.getSelectedItem();
    if (!selectedItem) {
      return;
    }

    if (uiDescriptionStore.getIsNewItem()) {
      uiDescriptionStore.setIsNewItem(false);
      uiDescriptionStore.setSelectedItem(
        uiDescriptionStore.getItemOptions()[0],
      );
      return;
    }

    const descriptionType = DESCRIPTION_TYPES_MAP[selectedConfiguration.value];
    const deleteFn = async () => {
      await descriptionStore.deleteItem(
        descriptionType,
        MODEL_NAME,
        selectedItem.value,
      );
    };
    const fnId =
      descriptionType === DESCRIPTION_TYPES.MOTORS
        ? FUNCTIONS.MOTORS_DESCRIPTIONS.DELETE_ITEM
        : FUNCTIONS.ANIMATIONS_DESCRIPTIONS.DELETE_ITEM;

    uiDescriptionStore.setEditDisabled(true);
    await callWithNotification(deleteFn, fnId, "Configuration deleted");
    uiDescriptionStore.setEditDisabled(false);

    uiDescriptionStore.setSelectedItem(
      uiDescriptionStore.getItemOptions()?.[0] || null,
    );
  };

  return (
    <div className={styles["select-container"]}>
      <Select
        className={styles.configuration}
        isDisabled={editDisabled}
        onChange={uiDescriptionStore.setSelectedConfiguration}
        options={uiDescriptionStore.getConfigurationOptions()}
        value={uiDescriptionStore.getSelectedConfiguration()}
      />
      <Select
        className={styles.item}
        isClearable
        isDisabled={editDisabled}
        onChange={uiDescriptionStore.setSelectedItem}
        options={uiDescriptionStore.getItemOptions()}
        value={uiDescriptionStore.getSelectedItem()}
      />
      {/* TODO: Add confirmation modal on delete */}
      <ClickableIcon
        Icon={BsTrash}
        disabled={editDisabled || !uiDescriptionStore.getSelectedItem()}
        iconClassName={styles.delete}
        onClick={onDelete}
        size={20}
        tooltipProps={{ content: "Delete", id: "delete-icon" }}
      />
      <ClickableIcon
        Icon={BsPlusLg}
        disabled={editDisabled || uiDescriptionStore.getIsNewItem()}
        iconClassName={styles.add}
        onClick={onAdd}
        size={20}
        tooltipProps={{ content: "Create new", id: "add-icon" }}
      />
    </div>
  );
});

export default ConfigurationBar;
