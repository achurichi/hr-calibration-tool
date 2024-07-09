import React from "react";
import { observer } from "mobx-react";

import { BsChevronRight } from "react-icons/bs";
import Select from "react-select";

import rootStore from "stores/root.store";

import useConfigurationBarActions from "pages/Admin/hooks/useConfigurationBarActions";

import ConfirmationModal from "components/ConfirmationModal/ConfirmationModal";
import EditableSelect from "components/EditableSelect/EditableSelect";
import NewDescriptionModal from "pages/Admin/NewDescriptionModal/NewDescriptionModal";

import styles from "./ConfigurationBar.module.scss";

const ConfigurationBar = observer(({ unsaved }) => {
  const { uiStore } = rootStore;
  const {
    descriptionsNames,
    confirmationModalConfig,
    newDescriptionModalConfig,
    handleUnsavedChanges,
    onAddNewDescription,
    onDeleteDescription,
    onDeleteItem,
  } = useConfigurationBarActions(unsaved);
  const { uiDescriptionStore } = uiStore;
  const editDisabled = uiDescriptionStore.getEditDisabled();

  return (
    <div>
      <div className={styles.container}>
        <EditableSelect
          isDisabled={editDisabled}
          onAdd={onAddNewDescription}
          onChange={() => {}}
          onDelete={onDeleteDescription}
          options={descriptionsNames.map((name) => ({
            label: name,
            value: name,
          }))}
          value={
            descriptionsNames.map((name) => ({
              label: name,
              value: name,
            }))[0]
          }
        />
        <BsChevronRight />
        <Select
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
        <BsChevronRight />
        <EditableSelect
          isDisabled={editDisabled}
          onAdd={() => {
            if (!uiDescriptionStore.getIsNewItem()) {
              handleUnsavedChanges(() => uiDescriptionStore.setIsNewItem(true));
            }
          }}
          onChange={(option) => {
            if (option?.value !== uiDescriptionStore.selectedItem?.value) {
              handleUnsavedChanges(() =>
                uiDescriptionStore.setSelectedItem(option),
              );
            }
          }}
          onDelete={onDeleteItem}
          options={uiDescriptionStore.getItemOptions()}
          value={uiDescriptionStore.getSelectedItem()}
        />
      </div>
      <NewDescriptionModal
        disabled={editDisabled}
        {...newDescriptionModalConfig}
      />
      <ConfirmationModal disabled={editDisabled} {...confirmationModalConfig} />
    </div>
  );
});

export default ConfigurationBar;
