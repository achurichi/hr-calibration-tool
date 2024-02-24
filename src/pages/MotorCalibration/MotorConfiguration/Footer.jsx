import React from "react";

import Form from "react-bootstrap/Form";

import Button from "components/Button/Button";
import ProgressBar from "components/ProgressBar/ProgressBar";

import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.status}>
        <Form className={styles.form}>
          <Form.Check
            type="checkbox"
            id="enable-torque"
            label="Enable torque"
          />
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
      </div>
      <div className={styles.navigation}>
        <Button>Previous motor</Button>
        <Button>Next motor</Button>
      </div>
    </div>
  );
};

export default Footer;
