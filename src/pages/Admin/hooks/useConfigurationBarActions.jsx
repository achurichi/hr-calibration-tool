import React, { useEffect, useState } from "react";

import rootStore from "stores/root.store";

import useCallWithNotification from "hooks/useCallWithNotification";

import { FUNCTIONS } from "constants/mongo";
import {
  DESCRIPTION_TYPES,
  DESCRIPTION_TYPES_MAP,
} from "constants/descriptions";
import { DELETE_MODAL, UNSAVED_CHANGES_MODAL } from "constants/modals";
import {
  DESCRIPTION_ITEMS_OPTIONS,
  NEW_ITEM_OPTION,
} from "constants/descriptions";

const useConfigurationBarActions = (unsaved) => {
  const { descriptionStore, uiStore } = rootStore;
  const callWithNotification = useCallWithNotification();
  const { uiDescriptionStore } = uiStore;
  const selectedItemTypeOption = uiDescriptionStore.getSelectedItemTypeOption();
  const [confirmationModalConfig, setConfirmationModalConfig] = useState({
    show: false,
  });
  const [newDescriptionModalConfig, setNewDescriptionModalConfig] = useState({
    show: false,
  });

  const fetchDescriptionNames = async () => {
    const descriptionNames = await descriptionStore.fetchDescriptionNames();

    if (!descriptionNames?.length) {
      uiDescriptionStore.setSelectedDescriptionOption(null);
      return;
    }

    const selectedValue =
      uiDescriptionStore.getSelectedDescriptionOption()?.value;
    if (!descriptionNames.includes(selectedValue)) {
      uiDescriptionStore.setSelectedDescriptionOption({
        label: descriptionNames[0],
        value: descriptionNames[0],
      });
    }
  };

  useEffect(() => {
    fetchDescriptionNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetConfirmationModal = () =>
    setConfirmationModalConfig({ show: false });

  const resetNewDescriptionModal = () =>
    setNewDescriptionModalConfig({ show: false });

  const setNewDescriptionError = (error) => {
    setNewDescriptionModalConfig((latest) => ({
      ...latest,
      errorMessage: error,
    }));
  };

  const handleUnsavedChanges = (onConfirmAction) => {
    if (unsaved) {
      setConfirmationModalConfig({
        ...UNSAVED_CHANGES_MODAL,
        onCancel: resetConfirmationModal,
        onConfirm: () => {
          onConfirmAction();
          resetConfirmationModal();
        },
      });
    } else {
      onConfirmAction();
    }
  };

  // Description actions

  const onAddDescription = async () => {
    setNewDescriptionModalConfig({
      ...newDescriptionModalConfig,
      onCancel: resetNewDescriptionModal,
      onConfirm: addDescription,
      show: true,
    });
  };

  const addDescription = async (name) => {
    if (!name) {
      setNewDescriptionError("Name is required");
      return;
    }

    const descriptionNames = descriptionStore.getDescriptionNames();
    if (descriptionNames.includes(name)) {
      setNewDescriptionError("Name already exists");
      return;
    }

    uiDescriptionStore.setEditDisabled(true);

    const { success } = await callWithNotification(
      () => descriptionStore.createDescriptions(name),
      FUNCTIONS.DESCRIPTIONS.CREATE,
      "New description created",
    );

    if (!success) {
      uiDescriptionStore.setEditDisabled(false);
      return;
    }

    await fetchDescriptionNames();
    if (!descriptionNames.includes(name)) {
      uiDescriptionStore.setSelectedDescriptionOption({
        label: name,
        value: name,
      });
    }

    resetNewDescriptionModal();
    uiDescriptionStore.setEditDisabled(false);
  };

  const onChangeDescription = (option) => {
    if (
      option?.value !== uiDescriptionStore.getSelectedDescriptionOption()?.value
    ) {
      handleUnsavedChanges(() => {
        uiDescriptionStore.setSelectedDescriptionOption(option);
        uiDescriptionStore.setSelectedItemTypeOption(
          DESCRIPTION_ITEMS_OPTIONS[0],
        );
      });
    }
  };

  const onDeleteDescription = (item) => {
    setConfirmationModalConfig({
      ...DELETE_MODAL,
      message: (
        <div>
          Are you sure you want to delete <strong>{item.label}</strong>?
          <br />
          This action will remove all associated default values, instructions
          and images.
        </div>
      ),
      onCancel: resetConfirmationModal,
      onConfirm: async () => {
        uiDescriptionStore.setEditDisabled(true);
        await callWithNotification(
          () => descriptionStore.deleteDescriptions(item.value),
          FUNCTIONS.DESCRIPTIONS.DELETE_BY_NAME,
          "Description deleted",
        );
        await fetchDescriptionNames();
        uiDescriptionStore.setEditDisabled(false);
        resetConfirmationModal();
      },
      title: "Delete Description",
    });
  };

  // Item type actions

  const onItemTypeChange = (option) => {
    if (option?.value !== selectedItemTypeOption?.value) {
      handleUnsavedChanges(() =>
        uiDescriptionStore.setSelectedItemTypeOption(option),
      );
    }
  };

  // Item actions

  const onAddItem = () => {
    if (!uiDescriptionStore.getIsNewItem()) {
      handleUnsavedChanges(() => uiDescriptionStore.setIsNewItem(true));
    }
  };

  const onChangeItem = (option) => {
    if (option?.value !== uiDescriptionStore.selectedItem?.value) {
      handleUnsavedChanges(() => uiDescriptionStore.setSelectedItem(option));
    }
  };

  const onDeleteItem = (item) => {
    if (item.value === NEW_ITEM_OPTION.value) {
      deleteItem(item);
    } else {
      setConfirmationModalConfig({
        ...DELETE_MODAL,
        message: (
          <div>
            Are you sure you want to delete <strong>{item.label}</strong>?
          </div>
        ),
        onCancel: resetConfirmationModal,
        onConfirm: async () => {
          await deleteItem(item);
          resetConfirmationModal();
        },
        title: "Delete Configuration",
      });
    }
  };

  const deleteItem = async (item) => {
    // if the element to delete is the new item, we only need to remove it from the store
    if (item.value === NEW_ITEM_OPTION.value) {
      uiDescriptionStore.setIsNewItem(false);
      uiDescriptionStore.setSelectedItem(
        uiDescriptionStore.getItemOptions()[0],
      );
      return;
    }

    const descriptionType = DESCRIPTION_TYPES_MAP[selectedItemTypeOption.value];
    const deleteFn = async () => {
      await descriptionStore.deleteItem(
        descriptionType,
        descriptionStore.getDescriptionName(),
        item.value,
      );
    };
    const fnId =
      descriptionType === DESCRIPTION_TYPES.MOTORS
        ? FUNCTIONS.MOTORS_DESCRIPTION.DELETE_ITEM
        : FUNCTIONS.ANIMATIONS_DESCRIPTION.DELETE_ITEM;

    uiDescriptionStore.setEditDisabled(true);
    await callWithNotification(deleteFn, fnId, "Configuration deleted");
    uiDescriptionStore.setEditDisabled(false);

    let newSelectedItem = null;
    const options = uiDescriptionStore.getItemOptions();
    if (options?.length) {
      const selectedItem = uiDescriptionStore.getSelectedItem();
      newSelectedItem =
        options.find((option) => option.value === selectedItem?.value) ||
        options[0];
    }

    uiDescriptionStore.setSelectedItem(newSelectedItem);
  };

  return {
    confirmationModalConfig,
    newDescriptionModalConfig,
    descriptionActions: {
      onAdd: onAddDescription,
      onChange: onChangeDescription,
      onDelete: onDeleteDescription,
    },
    itemTypeActions: {
      onChange: onItemTypeChange,
    },
    itemActions: {
      onAdd: onAddItem,
      onChange: onChangeItem,
      onDelete: onDeleteItem,
    },
  };
};

export default useConfigurationBarActions;
