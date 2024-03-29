import React from "react";

import Form from "react-bootstrap/Form";

import FooterComponent from "components/Footer/Footer";
import ProgressBar from "components/ProgressBar/ProgressBar";

import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <FooterComponent
      primaryButton={{ label: "Next motor" }}
      secondaryButton={{ label: "Previous motor" }}
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
};

export default Footer;
