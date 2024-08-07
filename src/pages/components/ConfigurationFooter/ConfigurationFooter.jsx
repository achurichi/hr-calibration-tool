import React from "react";
import { observer } from "mobx-react";

import Form from "react-bootstrap/Form";

import Footer from "components/Footer/Footer";
import ProgressBar from "components/ProgressBar/ProgressBar";

import { FUNCTIONS } from "constants/mongo";

import rootStore from "stores/root.store";

import styles from "./ConfigurationFooter.module.scss";

const ConfigurationFooter = observer(
  ({ checkboxProps, descriptionType, showMotorData }) => {
    const { statusStore, uiStore } = rootStore;
    const { uiConfigurationStore } = uiStore;
    const saveDisabledReason = uiConfigurationStore.getSaveDisabledReason();
    const saving = statusStore.isLoading(
      FUNCTIONS[`${descriptionType.toUpperCase()}_CONFIGURATION`].SAVE_ITEM,
    );

    return (
      <Footer
        buttons={[
          {
            disabled: saveDisabledReason || saving,
            label: "Save",
            onClick: uiConfigurationStore.saveConfiguration,
            separator: true,
            tooltipProps: {
              content: saveDisabledReason,
              id: "save-configuration",
            },
          },
          {
            disabled: uiConfigurationStore.prevDisabled() || saving,
            label: "Previous",
            onClick: () => {
              uiConfigurationStore.confirmIfDirty(() =>
                uiConfigurationStore.prevItem(),
              );
            },
          },
          {
            disabled: uiConfigurationStore.nextDisabled() || saving,
            label: "Next",
            onClick: () => {
              uiConfigurationStore.confirmIfDirty(() =>
                uiConfigurationStore.nextItem(),
              );
            },
          },
        ]}
      >
        {checkboxProps && (
          <Form className={styles.form}>
            <Form.Check
              disabled={!uiConfigurationStore.getSelectedOption() || saving}
              id={checkboxProps.id}
              label={checkboxProps.label}
              onChange={({ target }) => {
                checkboxProps.onChange(target.checked);
              }}
              type="checkbox"
            />
          </Form>
        )}
        {showMotorData && (
          <>
            <ProgressBar
              containerClassName={styles["current-position"]}
              now={0}
              showCurrentValue
              topLabel="Motor current position"
            />
            <ProgressBar
              containerClassName={styles["motor-load"]}
              now={0}
              topLabel="Motor load"
            />
          </>
        )}
      </Footer>
    );
  },
);

export default ConfigurationFooter;
