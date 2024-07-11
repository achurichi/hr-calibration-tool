import React from "react";
import { observer } from "mobx-react";

import { BsChevronRight } from "react-icons/bs";
import Select from "react-select";

import rootStore from "stores/root.store";

import useConfigurationBarActions from "pages/Admin/hooks/useConfigurationBarActions";

import ConfirmationModal from "components/ConfirmationModal/ConfirmationModal";
import EditableSelect from "components/EditableSelect/EditableSelect";
import NewDescriptionModal from "pages/Admin/NewDescriptionModal/NewDescriptionModal";

import { DESCRIPTION_ITEMS_OPTIONS } from "constants/descriptions";

import styles from "./ConfigurationBar.module.scss";

const ConfigurationBar = observer(({ unsaved }) => {
  const { descriptionStore, uiStore } = rootStore;
  const {
    confirmationModalConfig,
    newDescriptionModalConfig,
    descriptionActions,
    itemTypeActions,
    itemActions,
  } = useConfigurationBarActions(unsaved);
  const { uiDescriptionStore } = uiStore;
  const editDisabled = uiDescriptionStore.getEditDisabled();

  const descriptionOptions = descriptionStore
    .getDescriptionNames()
    .map((name) => ({ label: name, value: name }));

  return (
    <div>
      <div className={styles.container}>
        <EditableSelect
          isDisabled={editDisabled}
          options={descriptionOptions}
          value={uiDescriptionStore.getSelectedDescriptionOption()}
          {...descriptionActions}
        />
        <BsChevronRight />
        <Select
          isDisabled={editDisabled}
          options={DESCRIPTION_ITEMS_OPTIONS}
          value={uiDescriptionStore.getSelectedItemTypeOption()}
          {...itemTypeActions}
        />
        <BsChevronRight />
        <EditableSelect
          isDisabled={editDisabled}
          options={uiDescriptionStore.getItemOptions()}
          value={uiDescriptionStore.getSelectedItemOption()}
          {...itemActions}
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
