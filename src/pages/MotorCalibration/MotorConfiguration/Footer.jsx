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
  const { uiMotorsConfigurationStore } = uiStore;
  const saveDisabledReason = uiMotorsConfigurationStore.getSaveDisabledReason();
  const saving = statusStore.isLoading(
    FUNCTIONS.MOTORS_CONFIGURATION.SAVE_MOTOR,
  );

  return (
    <FooterComponent
      buttons={[
        {
          disabled: saveDisabledReason || saving,
          label: "Save",
          onClick: uiMotorsConfigurationStore.saveConfiguration,
          separator: true,
          tooltipProps: {
            content: saveDisabledReason,
            id: "save-configuration",
          },
        },
        {
          disabled: uiMotorsConfigurationStore.prevDisabled() || saving,
          label: "Previous",
          onClick: () => {
            uiMotorsConfigurationStore.confirmIfDirty(() =>
              uiMotorsConfigurationStore.prevMotor(),
            );
          },
        },
        {
          disabled: uiMotorsConfigurationStore.nextDisabled() || saving,
          label: "Next",
          onClick: () => {
            uiMotorsConfigurationStore.confirmIfDirty(() =>
              uiMotorsConfigurationStore.nextMotor(),
            );
          },
        },
      ]}
    >
      <Form className={styles.form}>
        <Form.Check
          disabled={!uiMotorsConfigurationStore.getSelectedOption() || saving}
          id="enable-torque"
          label="Enable torque"
          onChange={({ target }) => {
            uiMotorsConfigurationStore.setEnableTorque(target.checked);
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
