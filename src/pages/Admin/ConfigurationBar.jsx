import React, { useState } from "react";
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
import ConfirmationModal from "components/ConfirmationModal/ConfirmationModal";

import styles from "./ConfigurationBar.module.scss";

const ConfigurationBar = observer(({ unsaved }) => {
  const { descriptionStore, uiStore } = rootStore;
  const callWithNotification = useCallWithNotification();
  const { uiDescriptionStore } = uiStore;
  const selectedConfiguration = uiDescriptionStore.getSelectedConfiguration();
  const editDisabled = uiDescriptionStore.getEditDisabled();
  const [confirmationModalConfig, setConfirmationModalConfig] = useState({
    show: false,
  });

  const resetConfirmationModal = () =>
    setConfirmationModalConfig({ show: false });

  const handleUnsavedChanges = (onConfirmAction) => {
    if (unsaved) {
      setConfirmationModalConfig({
        confirmLabel: "Continue",
        message:
          "There are unsaved changes. Are you sure you want to continue?",
        onCancel: resetConfirmationModal,
        onConfirm: () => {
          onConfirmAction();
          resetConfirmationModal();
        },
        show: true,
        title: "Unsaved Changes",
      });
    } else {
      onConfirmAction();
    }
  };

  const onDelete = () => {
    if (uiDescriptionStore.getIsNewItem()) {
      deleteItem();
    } else {
      setConfirmationModalConfig({
        confirmLabel: "Delete",
        confirmVariant: "danger",
        message: (
          <div>
            {"Are you sure you want to delete "}
            {uiDescriptionStore.getSelectedItem()?.label}
            {"?"}
          </div>
        ),
        onCancel: resetConfirmationModal,
        onConfirm: async () => {
          await deleteItem();
          resetConfirmationModal();
        },
        show: true,
        title: "Delete Configuration",
      });
    }
  };

  const deleteItem = async () => {
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
        ? FUNCTIONS.MOTORS_DESCRIPTION.DELETE_ITEM
        : FUNCTIONS.ANIMATIONS_DESCRIPTION.DELETE_ITEM;

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
        onChange={(option) => {
          if (
            option?.value !== uiDescriptionStore.selectedConfiguration?.value
          ) {
            handleUnsavedChanges(() =>
              uiDescriptionStore.setSelectedConfiguration(option),
            );
          }
        }}
        options={uiDescriptionStore.getConfigurationOptions()}
        value={uiDescriptionStore.getSelectedConfiguration()}
      />
      <Select
        className={styles.item}
        isClearable
        isDisabled={editDisabled}
        onChange={(option) => {
          if (option?.value !== uiDescriptionStore.selectedItem?.value) {
            handleUnsavedChanges(() =>
              uiDescriptionStore.setSelectedItem(option),
            );
          }
        }}
        options={uiDescriptionStore.getItemOptions()}
        value={uiDescriptionStore.getSelectedItem()}
      />
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
        onClick={() => {
          if (!uiDescriptionStore.getIsNewItem()) {
            handleUnsavedChanges(() => uiDescriptionStore.setIsNewItem(true));
          }
        }}
        size={20}
        tooltipProps={{ content: "Create new", id: "add-icon" }}
      />
      <ConfirmationModal disabled={editDisabled} {...confirmationModalConfig} />
    </div>
  );
});

export default ConfigurationBar;
