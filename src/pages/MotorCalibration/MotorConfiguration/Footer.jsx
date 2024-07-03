import React from "react";
import { observer } from "mobx-react";

import Form from "react-bootstrap/Form";

import FooterComponent from "components/Footer/Footer";
import ProgressBar from "components/ProgressBar/ProgressBar";

import { FUNCTIONS } from "constants/mongo";

import rootStore from "stores/root.store";

import styles from "./Footer.module.scss";

const Footer = observer(() => {
  const { statusStore, uiStore } = rootStore;
  const { uiConfigurationStore } = uiStore;
  const saveDisabledReason = uiConfigurationStore.getSaveDisabledReason();
  const saving = statusStore.isLoading(
    FUNCTIONS.MOTORS_CONFIGURATION.SAVE_ITEM,
  );

  return (
    <FooterComponent
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
      <Form className={styles.form}>
        <Form.Check
          disabled={!uiConfigurationStore.getSelectedOption() || saving}
          id="enable-torque"
          label="Enable torque"
          onChange={({ target }) => {
            uiConfigurationStore.setEnableTorque(target.checked);
          }}
          type="checkbox"
        />
      </Form>
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
    </FooterComponent>
  );
});

export default Footer;
