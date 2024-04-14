import React from "react";
import { observer } from "mobx-react";

import Form from "react-bootstrap/Form";

import FooterComponent from "components/Footer/Footer";
import ProgressBar from "components/ProgressBar/ProgressBar";

import rootStore from "stores/root.store";

import styles from "./Footer.module.scss";

const Footer = observer(() => {
  const { uiStore } = rootStore;
  const { motorConfigurationStore } = uiStore;

  return (
    <FooterComponent
      primaryButton={{
        label: "Next motor",
        onClick: motorConfigurationStore.nextMotor,
        disabled: motorConfigurationStore.lastMotorSelected(),
      }}
      secondaryButton={{
        label: "Previous motor",
        onClick: motorConfigurationStore.prevMotor,
        disabled: motorConfigurationStore.firstMotorSelected(),
      }}
    >
      <Form className={styles.form}>
        <Form.Check type="checkbox" id="enable-torque" label="Enable torque" />
      </Form>
      <ProgressBar
        containerClassName={styles["current-position"]}
        now={50}
        showCurrentValue
        topLabel="Motor current position"
      />
      <ProgressBar
        containerClassName={styles["motor-load"]}
        now={50}
        topLabel="Motor load"
      />
    </FooterComponent>
  );
});

export default Footer;
