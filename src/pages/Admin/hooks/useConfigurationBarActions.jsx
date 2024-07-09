import React, { useEffect, useState } from "react";

import rootStore from "stores/root.store";

import useCallWithNotification from "hooks/useCallWithNotification";

import { FUNCTIONS } from "constants/mongo";
import {
  DESCRIPTION_NAME,
  DESCRIPTION_TYPES,
  DESCRIPTION_TYPES_MAP,
} from "constants/descriptions";
import { DELETE_MODAL, UNSAVED_CHANGES_MODAL } from "constants/modals";
import { NEW_ITEM_OPTION } from "constants/descriptions";

const useConfigurationBarActions = (unsaved) => {
  const { descriptionStore, uiStore } = rootStore;
  const callWithNotification = useCallWithNotification();
  const { uiDescriptionStore } = uiStore;
  const selectedConfiguration = uiDescriptionStore.getSelectedConfiguration();
  const [descriptionsNames, setDescriptionsNames] = useState([]);
  const [confirmationModalConfig, setConfirmationModalConfig] = useState({
    show: false,
  });
  const [newDescriptionModalConfig, setNewDescriptionModalConfig] = useState({
    show: false,
  });

  const fetchDescriptionsNames = async () => {
    const names = await descriptionStore.fetchDescriptionsNames();
    setDescriptionsNames(names);
  };

  useEffect(() => {
    fetchDescriptionsNames();
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

    const descriptionType = DESCRIPTION_TYPES_MAP[selectedConfiguration.value];
    const deleteFn = async () => {
      await descriptionStore.deleteItem(
        descriptionType,
        DESCRIPTION_NAME,
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

  const onAddNewDescription = async () => {
    setNewDescriptionModalConfig({
      ...newDescriptionModalConfig,
      onCancel: resetNewDescriptionModal,
      onConfirm: addNewDescription,
      show: true,
    });
  };

  const addNewDescription = async (name) => {
    if (!name) {
      setNewDescriptionError("Name is required");
      return;
    }
    if (descriptionsNames.includes(name)) {
      setNewDescriptionError("Name already exists");
      return;
    }

    uiDescriptionStore.setEditDisabled(true);
    const { success } = await callWithNotification(
      () => descriptionStore.createDescriptions(name),
      FUNCTIONS.DESCRIPTIONS.CREATE,
      "New description created",
    );
    await fetchDescriptionsNames();
    uiDescriptionStore.setEditDisabled(false);

    if (success) {
      resetNewDescriptionModal();
    }
  };

  const onDeleteDescription = (item) => {
    setConfirmationModalConfig({
      ...DELETE_MODAL,
      message: (
        <div>
          Are you sure you want to delete <strong>{item.label}</strong>?
          <br />
          This action will delete all the default values, instructions and
          images associated with this description.
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
        await fetchDescriptionsNames();
        uiDescriptionStore.setEditDisabled(false);
        resetConfirmationModal();
      },
      title: "Delete Description",
    });
  };

  return {
    descriptionsNames,
    confirmationModalConfig,
    newDescriptionModalConfig,
    handleUnsavedChanges,
    onAddNewDescription,
    onDeleteDescription,
    onDeleteItem,
  };
};

export default useConfigurationBarActions;
