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

const useSelectionBar = (unsaved) => {
  const { descriptionStore, uiStore } = rootStore;
  const callWithNotification = useCallWithNotification();
  const { uiDescriptionStore } = uiStore;
  const selectedDescription = uiDescriptionStore.getSelectedDescription();
  const selectedItemType = uiDescriptionStore.getSelectedItemType();
  const selectedItem = uiDescriptionStore.getSelectedItem();
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
    const fetchAndEnable = async () => {
      await fetchDescriptionNames();
      uiDescriptionStore.setEditDisabled(false);
    };

    fetchAndEnable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const configureDescription = async () => {
      if (!selectedDescription || !selectedItemType) {
        return;
      }

      uiDescriptionStore.setEditDisabled(true);

      const descriptionType = DESCRIPTION_TYPES_MAP[selectedItemType];
      await descriptionStore.getOrFetchDescription(
        descriptionType,
        selectedDescription,
      );

      uiDescriptionStore.setSelectedItemOption(
        uiDescriptionStore.getItemOptions()[0],
      );

      uiDescriptionStore.setEditDisabled(false);
    };

    configureDescription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDescription, selectedItemType]);

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

    uiDescriptionStore.setSelectedItemTypeOption(DESCRIPTION_ITEMS_OPTIONS[0]);
    uiDescriptionStore.setEditDisabled(false);
    resetNewDescriptionModal();
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
        uiDescriptionStore.setSelectedItemTypeOption(
          DESCRIPTION_ITEMS_OPTIONS[0],
        );
        uiDescriptionStore.setEditDisabled(false);
        resetConfirmationModal();
      },
      title: "Delete Description",
    });
  };

  // Item type actions

  const onItemTypeChange = (option) => {
    if (option?.value !== selectedItemType) {
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
    if (option?.value !== selectedItem) {
      handleUnsavedChanges(() =>
        uiDescriptionStore.setSelectedItemOption(option),
      );
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
        title: "Delete Item",
      });
    }
  };

  const deleteItem = async (item) => {
    // if the element to delete is the new item, we only need to remove it from the store
    if (item.value === NEW_ITEM_OPTION.value) {
      uiDescriptionStore.setIsNewItem(false);
      uiDescriptionStore.setSelectedItemOption(
        uiDescriptionStore.getItemOptions()[0],
      );
      return;
    }

    const descriptionType = DESCRIPTION_TYPES_MAP[selectedItemType];
    const deleteFn = async () => {
      await descriptionStore.deleteItem(
        descriptionType,
        uiDescriptionStore.getSelectedDescription(),
        item.value,
      );
    };
    const fnId =
      descriptionType === DESCRIPTION_TYPES.MOTORS
        ? FUNCTIONS.MOTORS_DESCRIPTION.DELETE_ITEM
        : FUNCTIONS.ANIMATIONS_DESCRIPTION.DELETE_ITEM;

    uiDescriptionStore.setEditDisabled(true);
    await callWithNotification(deleteFn, fnId, "Item deleted");
    uiDescriptionStore.setEditDisabled(false);

    let option = null;
    const options = uiDescriptionStore.getItemOptions();
    if (options?.length) {
      option =
        options.find((option) => option.value === selectedItem) || options[0];
    }

    uiDescriptionStore.setSelectedItemOption(option);
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

export default useSelectionBar;
